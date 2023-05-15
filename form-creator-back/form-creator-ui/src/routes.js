import React, { useEffect } from "react";
import CreateForm from "./pages/CreateForm";
import AnswerForm from "./pages/AnswerForm";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ListForms from "./pages/ListForms";
import EditForm from "./pages/EditForm";
import GetForm from "./pages/GetForm";
import VisualizeForm from "./pages/VisualizeForm";
import Acknowledgement from "./pages/Acknowledgement";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  let usr = true;
  rest.path === "/list/:id" &&
    rest.computedMatch.params.id !== window.sessionStorage.getItem("userId") &&
    (usr = false);
  return (
    <Route
      {...rest}
      render={(props) =>
        usr && window.sessionStorage.getItem("token") !== null ? (
          <Component {...props} />
        ) : (
            <Redirect to={{ pathname: "/" }} />
          )
      }
    />
  );
};

const Routes = () => (
  <HashRouter>
    <Header />
    <Switch>
      <Route exact path="/">
        <Redirect to="/SignIn" />
      </Route>
      <Route exact path="/SignUp" component={SignUp} />
      <Route exact path="/SignIn" component={SignIn} />
      <PrivateRoute
        exact
        path="/visualize/:id"
        component={() => <VisualizeForm />}
      />
      <PrivateRoute exact path="/create" component={() => <CreateForm />} />
      <Route exact path="/answer/:id" component={() => <AnswerForm />} />
      <PrivateRoute exact path="/edit/:id" component={() => <EditForm />} />
      <PrivateRoute exact path="/list/:id" component={() => <ListForms />} />
      <PrivateRoute exact path="/form/:id" component={() => <GetForm />} />
      <Route exact path="/post/:again" component={() => <Acknowledgement />} />
    </Switch>
    <Footer />
  </HashRouter>
);

export default Routes;
