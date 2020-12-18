import React, { Component } from "react";
import { register } from "../services/authService";

class Register extends Component {
  state = { email: "", password: "" };

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    register(this.state.email, this.state.password);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          E-Mail
          <input
            type="text"
            id="email"
            value={this.state.email}
            onChange={this.handleChange}
          ></input>
        </label>
        <label>
          Password
          <input
            type="password"
            id="password"
            value={this.state.password}
            onChange={this.handleChange}
          ></input>
        </label>
        <input type="submit" value="Register"></input>
      </form>
    );
  }
}

export default Register;
