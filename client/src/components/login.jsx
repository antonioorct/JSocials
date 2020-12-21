import React, { Component } from "react";
import { login } from "../services/authService";

class Login extends Component {
  state = { email: "", password: "" };

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const jwt = await login(this.state.email, this.state.password);
      localStorage.setItem("token", jwt);
      this.props.history.push("/");
    } catch (e) {
      console.log(e);
    }
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
        <input className="btn btn-primary" type="submit" value="Login"></input>
      </form>
    );
  }
}

export default Login;
