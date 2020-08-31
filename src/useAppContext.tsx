import { useState, useEffect, useRef, useCallback } from "react";
import MetaMaskOnboarding from "@metamask/onboarding";
import * as Cookies from "js-cookie";
import { ConnectingStatus } from "./AppContext";
import { signIn, User } from "./api/signIn";
import { roundNumberDown } from "./utils/format-number";
import { useNavigate } from "@reach/router";

const defaultConnectingStatus: ConnectingStatus = {
  status: "none",
};

export default function useAppContext() {
  const onboarding = useRef<MetaMaskOnboarding>();
  const [isInitializing, setIsInitializing] = useState(true);
  const [isMMInstalled, setIsMMInstalled] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [accounts, setEthAccounts] = useState<string[]>([]);
  const [connectingStatus, setConnectingStatus] = useState<ConnectingStatus>(
    defaultConnectingStatus
  );
  const [user, setUser] = useState<User>();
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const navigate = useNavigate();

  const getReferralAddress = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get("ref") || Cookies.get("ref") || "";
    if (ref) {
      Cookies.set("ref", ref);
    }
    return ref;
  };

  const handleNewAccounts = useCallback(
    (accounts: string[]) => {
      (async () => {
        setIsInitializing(true);
        // @ts-ignore
        if (window.ethereum.chainId !== "0x1") {
          setConnectingStatus({
            status: "failed",
            error: {
              code: 501,
              message: "Network not supported",
            },
          });
          setIsConnected(false);
          navigate("/").then();
        } else {
          const ref = getReferralAddress();
          if (accounts.length > 0) {
            try {
              const { data } = await signIn(accounts[0], ref);
              if (data) {
                setToken(data.token);
                setUser(data.user);
                setUserId(data.user.ethWallet);
              }
              setEthAccounts(accounts);
              setIsConnected(true);
              setConnectingStatus({ status: "success" });
            } catch (error) {
              setIsConnected(false);
              setConnectingStatus({
                status: "failed",
                error: {
                  code: error.response.code,
                  message: "Something wrong. Please contact admin",
                },
              });
            }
          } else {
            setIsConnected(false);
            navigate("/").then();
          }
        }
        setIsInitializing(false);
      })();
    },
    [navigate]
  );

  useEffect(() => {
    (async () => {
      if (!onboarding.current) {
        onboarding.current = new MetaMaskOnboarding();
      }
      if (MetaMaskOnboarding.isMetaMaskInstalled()) {
        setIsMMInstalled(true);

        // @ts-ignore
        const ethereum = window.ethereum;
        ethereum.request({ method: "eth_accounts" }).then(handleNewAccounts);
        ethereum.on("accountsChanged", handleNewAccounts);
      } else {
        setIsInitializing(false);
      }
    })();
  }, [handleNewAccounts]);

  // Get ETH balance when accounts change
  useEffect(() => {
    if (accounts.length) {
      const params = [accounts[0], "latest"];
      // @ts-ignore
      window.ethereum
        .request({ method: "eth_getBalance", params })
        .then((_balance: string) => {
          const toIntBalance = parseInt(_balance) / 1e18;
          const roundBalance = roundNumberDown(toIntBalance);
          setBalance(roundBalance);
        });
    }
  }, [accounts]);

  // Update User PRT balance real-time
  useEffect(() => {
    if (userId) {
      // @ts-ignore
      return firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .onSnapshot((doc: any) => {
          if (doc.exists) {
            setUser((user) => {
              if (user) {
                return {
                  ...user,
                  cdtAmount: doc.data().cdtAmount,
                };
              }
            });
          }
        });
    }
  }, [userId]);

  const updateBalance = useCallback(
    (amount: number) => {
      setBalance(roundNumberDown(balance - amount));
    },
    [balance]
  );
  const onConnect = useCallback(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      // @ts-ignore
      const ethereum = window.ethereum;
      setConnectingStatus({ status: "connecting" });
      ethereum
        .request({ method: "eth_requestAccounts" })
        .then((a: string[]) => {
          handleNewAccounts(a);
        })
        .catch((error: any) => {
          setConnectingStatus({
            status: "failed",
            error: {
              code: error.code,
              message: error.message,
            },
          });
        });
    } else {
      onboarding.current!.startOnboarding();
    }
  }, [handleNewAccounts]);
  const onDisconnect = useCallback(() => {
    setIsConnected(false);
    navigate("/").then();
  }, [navigate]);

  return {
    isInitializing,
    isMMInstalled,
    isConnected,
    token,
    user,
    userId,
    accounts,
    balance,
    connectingStatus,
    onConnect,
    onDisconnect,
    updateBalance,
  };
}
