import React, { Component, Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Register from "./register";
import Login from "./login";
import Main from "./main";

class App extends Component {
  render() {
    return (
      <Fragment>
        <header></header>
        <main>
          <Switch>
            <Route path="/register" component={Register}></Route>
            <Route path="/login" component={Login}></Route>
            <Route path="/" component={Main}></Route>
          </Switch>
        </main>
      </Fragment>
    );
  }
}

export default App;
