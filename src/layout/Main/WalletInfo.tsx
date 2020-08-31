import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core";
import AppContext from "../../AppContext";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

const WalletInfo = () => {
  const classes = useStyles();
  const { user, balance } = React.useContext(AppContext)!;

  return (
    <div className={`wallet-info ${classes.root}`}>
      <div className="wallet">
        <div>Your balance in ParaDefi</div>
        <div className="coin-cdt">{user?.cdtAmount} PRT</div>
      </div>
      <div className="wallet">
        <div>Your wallet balance</div>
        <div className="coin-eth">{balance} ETH</div>
      </div>
    </div>
  );
};

export default WalletInfo;
