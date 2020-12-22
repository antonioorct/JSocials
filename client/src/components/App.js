import React, { Component, Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";

import HeaderBar from "./navbar";
import Register from "./register";
import Login from "./login";
import Main from "./main";

class App extends Component {
  render() {
    return (
      <Fragment>
        <HeaderBar />
        <Container>
          <main>
            <Switch>
              <Route path="/register" component={Register}></Route>
              <Route path="/login" component={Login}></Route>
              <Route path="/" component={Main}></Route>
            </Switch>
          </main>
        </Container>
      </Fragment>
    );
  }
}

export default App;
