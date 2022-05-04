import React, { useState } from "react";
import { Container, CssBaseline } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useAuth } from "./hooks/useAuth";
import SignInSide from "./pages/SignInSide";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import Listado from "./pages/facturacion/Listado";
import "./App.css";
import Emision from "./pages/facturacion/Emision";
import Orden from "./pages/ordenes/Orden";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    height: "100vh",
    overflow: "auto",
    flexGrow: 1,
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    maxWidth: "none",
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
}));

const App = (props) => {
  const classes = useStyles();
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      {user ? (
        <Router>
          <Navbar
            open={open}
            drawerOpen={handleDrawerOpen}
            drawerClose={handleDrawerClose}
          />
          <Sidebar open={open} drawerClose={handleDrawerClose} />
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container className={classes.container}>
              <Switch>
                <Route path="/" exact component={Listado} />
                <Route path="/orden" exact component={Orden} />
                <Route path="/emision" component={Emision} />
              </Switch>
            </Container>
          </main>
        </Router>
      ) : (
        <Router>
          <Switch>
            <Route exact path="/">
              <SignInSide />
            </Route>
          </Switch>
        </Router>
      )}
    </div>
  );
};

export default App;
