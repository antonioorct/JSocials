import React, { Component } from "react";

import jwtDecode from "jwt-decode";

class Main extends Component {
  state = {};

  getUser() {
    const token = localStorage.getItem("token");
    if (!token) return "Nobody";

    const { email } = jwtDecode(token);

    return email;
  }

  render() {
    return <h1>Welcome {this.getUser()}</h1>;
  }
}

export default Main;
