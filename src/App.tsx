import "react-perfect-scrollbar/dist/css/styles.css";
import "./assets/scss/index.scss";

import React from "react";
import { Router, RouteComponentProps } from "@reach/router";
import { ThemeProvider } from "@material-ui/styles";
import theme from "./theme";

import MainLayout from "./layout/Main";
import ConnectWallet from "./view/ConnectWallet";
import Dashboard from "./view/Dashboard";
import TokenSale from "./view/TokenSale/index";
import FullScreenLoading from "./component/FullScreenLoading";

import { AppProvider } from "./AppContext";
import useAppContext from "./useAppContext";
import TransactionList from "./view/TransactionList";
import ReferralList from "./view/ReferralList";
import CountDown from "./view/CountDown";

const App: React.FC<RouteComponentProps> = () => {
  const value = useAppContext();
  const { isInitializing, isMMInstalled, isConnected } = value;

  return isInitializing ? (
    <FullScreenLoading />
  ) : (
    <ThemeProvider theme={theme}>
      <AppProvider value={value}>
        {!isMMInstalled || !isConnected ? (
          <ConnectWallet path="/" />
        ) : (
          <Router>
            <CountDown path="/" />
            {/*<MainLayout path="/">*/}
            {/*  <Dashboard path="/" />*/}
            {/*  <TokenSale path="/token-sale" />*/}
            {/*  <TransactionList path="/history" />*/}
            {/*  <ReferralList path="/refer-friends" />*/}
            {/*</MainLayout>*/}
          </Router>
        )}
      </AppProvider>
    </ThemeProvider>
  );
};

const RApp = () => (
  <Router>
    <App path="/*" />
  </Router>
);

export default RApp;
