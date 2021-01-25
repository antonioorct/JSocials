import React, { Component, useContext, useState } from "react";
import {
  sendLoginInfo,
  getLoggedInUser,
  saveJwtToLocal,
  saveJwtToSession,
} from "../services/authService";

import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";

import { UserContext } from "../contexts/UserContext";
import Container from "react-bootstrap/Container";
import FormCheck from "react-bootstrap/FormCheck";

function Login({ history }) {
  const [userForm, setUserForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const setUser = useContext(UserContext)[1];

  const handleChange = ({ target }) => {
    setUserForm({ ...userForm, [target.id]: target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const jwt = await sendLoginInfo(userForm.email, userForm.password);

      if (userForm.remember) saveJwtToLocal(jwt);
      else saveJwtToSession(jwt);

      const userData = await getLoggedInUser();
      setUser(userData);

      history.push("/");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container>
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
        <FormCheck
          type="checkbox"
          id="remember"
          label="Remember me"
          checked={userForm.remember}
          onChange={({ target }) =>
            setUserForm({ ...userForm, remember: target.checked })
          }
        ></FormCheck>
        <input className="btn btn-primary" type="submit" value="Login"></input>
      </Form>
    </Container>
  );
}

export default Login;
