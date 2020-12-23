import React, { Component, Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";

import { getLoggedInUser } from "../services/authService";

import HeaderBar from "./navbar";
import Register from "./register";
import Login from "./login";
import Main from "./main";

class App extends Component {
  state = { user: {} };

  async componentDidMount() {
    const loggedUser = await getLoggedInUser();

    this.setState({ user: loggedUser });
  }

  render() {
    return (
      <Fragment>
        <HeaderBar user={this.state.user} />
        <Container>
          <Switch>
            <Route path="/register" component={Register}></Route>
            <Route path="/login" component={Login}></Route>
            <Route path="/" component={Main}></Route>
          </Switch>
        </Container>
      </Fragment>
    );
  }
}

export default App;
