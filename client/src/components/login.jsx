import React, { useContext, useState } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useHistory } from "react-router-dom";

import {
  sendLoginInfo,
  getLoggedInUser,
  saveJwtToLocal,
  saveJwtToSession,
} from "../services/authService";

import { UserContext } from "../contexts/UserContext";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Container from "react-bootstrap/Container";
import FormCheck from "react-bootstrap/FormCheck";
import FormGroup from "react-bootstrap/FormGroup";
import FormLabel from "react-bootstrap/FormLabel";
import Button from "react-bootstrap/Button";

const schema = yup.object().shape({
  username: yup.string().required().min(4).max(25).label("Username"),
  password: yup.string().required().max(50).label("Password"),
});

export default function Login({ history }) {
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const setUser = useContext(UserContext)[1];
  const [serverErrors, setServerErrors] = useState("");
  let { location } = useHistory();

  const onSubmit = async ({ username, password, remember }) => {
    try {
      const jwt = await sendLoginInfo(username, password);

      if (remember) saveJwtToLocal(jwt);
      else saveJwtToSession(jwt);

      const userData = await getLoggedInUser();
      setUser(userData);

      history.push("/");
    } catch (err) {
      setServerErrors(err.response.data.detail);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <FormLabel>Username</FormLabel>
          <FormControl type="text" name="username" ref={register} />
          <p style={{ color: "red" }}>{errors.username?.message}</p>
        </FormGroup>

        <FormGroup>
          <FormLabel>Password</FormLabel>
          <FormControl type="password" name="password" ref={register} />
          <p style={{ color: "red" }}>{errors.password?.message}</p>
        </FormGroup>

        <FormGroup controlId="formBasicCheckbox">
          <FormCheck
            label="Remember me"
            type="checkbox"
            name="remember"
            ref={register}
          />
        </FormGroup>

        <p style={{ color: "red" }}>{serverErrors}</p>
        {location.state && (
          <p style={{ color: "green" }}>{location.state.registerMessage}</p>
        )}

        <Button
          variant="primary"
          type="submit"
          onClick={() => {
            setServerErrors("");
            location.state = {};
          }}
        >
          Login
        </Button>

        <Button href="/register" className="float-right" variant="success">
          Register
        </Button>
      </Form>
    </Container>
  );
}
