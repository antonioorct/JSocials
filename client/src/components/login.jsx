import React, { Component, useContext, useState } from "react";
import { sendLoginInfo } from "../services/authService";

import { UserContext } from "../contexts/UserContext";

function Login() {
  const [userForm, setUserForm] = useState({ email: "", password: "" });
  const [user, setUser] = useContext(UserContext);

  const handleChange = (e) => {
    setUserForm({ ...userForm, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const jwt = await sendLoginInfo(this.state.email, this.state.password);
      localStorage.setItem("token", jwt);

      this.props.history.push("/");
      this.props.user = { email: "test" };
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        E-Mail
        <input
          type="text"
          id="email"
          value={userForm.email}
          onChange={handleChange}
        ></input>
      </label>
      <label>
        Password
        <input
          type="password"
          id="password"
          value={userForm.password}
          onChange={handleChange}
        ></input>
      </label>
      <input className="btn btn-primary" type="submit" value="Login"></input>
    </form>
  );
}

export default Login;
