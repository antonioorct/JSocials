import React, { Component, useContext, useState } from "react";
import { sendLoginInfo, login, getLoggedInUser } from "../services/authService";

import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import { InputGroup } from "react-bootstrap/InputGroup";

import { UserContext } from "../contexts/UserContext";

function Login({ history }) {
  const [userForm, setUserForm] = useState({ email: "", password: "" });
  const [user, setUser] = useContext(UserContext);

  const handleChange = (e) => {
    setUserForm({ ...userForm, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const jwt = await sendLoginInfo(userForm.email, userForm.password);
      await login(jwt);
      const loggedInUser = await getLoggedInUser();
      setUser(loggedInUser);

      history.push("/");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <label>
        E-Mail
        <FormControl
          type="text"
          id="email"
          value={userForm.email}
          onChange={handleChange}
        />
      </label>
      <label>
        Password
        <FormControl
          type="password"
          id="password"
          value={userForm.password}
          onChange={handleChange}
        />
      </label>
      <input className="btn btn-primary" type="submit" value="Login"></input>
    </Form>
  );
}

export default Login;
