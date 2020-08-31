import React from "react";
import { RouteComponentProps } from "@reach/router";
import { makeStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(4),
  },
}));

const Dashboard: React.FC<RouteComponentProps> = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <p>Dashboard</p>
    </div>
  );
};

export default Dashboard;
