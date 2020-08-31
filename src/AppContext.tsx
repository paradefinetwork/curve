import React from "react";
import { User } from "./api/signIn";

export type ConnectingStatus = {
  status: "connecting" | "success" | "failed" | "none";
  error?: {
    code: number;
    message: string;
  };
};

type AppContextType = {
  isInitializing: boolean;
  isConnected: boolean;
  isMMInstalled: boolean;
  user?: User;
  userId?: string;
  token?: string;
  accounts: string[];
  balance: number;
  connectingStatus: ConnectingStatus;
  onConnect: () => void;
  onDisconnect: () => void;
  updateBalance: (amount: number) => void;
};

const AppContext = React.createContext<AppContextType | undefined>(undefined);

const { Provider: AppProvider } = AppContext;

export { AppProvider };
export default AppContext;
