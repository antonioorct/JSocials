import React, { useContext, useState } from "react";
import { sendRegisterInfo } from "../services/userService";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";

import { UserContext } from "../contexts/UserContext";
import Container from "react-bootstrap/Container";
import FormGroup from "react-bootstrap/FormGroup";
import FormLabel from "react-bootstrap/FormLabel";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const schema = yup.object().shape({
  username: yup.string().required().min(4).max(25).label("Username"),
  email: yup.string().required().email().label("E-mail"),
  firstName: yup.string().required().label("First name"),
  lastName: yup.string().required().label("Last name"),
  password: yup
    .string()
    .required()
    .min(8)
    .max(50)
    .matches(/[0-9]+/, { message: "Password must contain at least one number" })
    .label("Password"),
  repeatPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("password")], "Passwords must match")
    .label("Repeat password"),
});

export default function Register({ history }) {
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const setUser = useContext(UserContext)[1];
  const [serverErrors, setServerErrors] = useState("");

  const onSubmit = async (data) => {
    setServerErrors("");

    try {
      await sendRegisterInfo(data);

      history.push("/login", { registerMessage: "Registration successful!" });
    } catch (err) {
      setServerErrors(err.response.data.detail);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <FormLabel>Username</FormLabel>
          <FormControl type="text" name="username" ref={register} autoFocus />
          <p style={{ color: "red" }}>{errors.username?.message}</p>
        </FormGroup>

        <FormGroup>
          <FormLabel>E-mail</FormLabel>
          <FormControl type="e-mail" name="email" ref={register} />
          <p style={{ color: "red" }}>{errors.email?.message}</p>
        </FormGroup>

        <FormGroup>
          <Row>
            <Col>
              <FormLabel>First name</FormLabel>
              <FormControl type="text" name="firstName" ref={register} />
              <p style={{ color: "red" }}>{errors.firstName?.message}</p>
            </Col>
            <Col>
              <FormLabel>Last name</FormLabel>
              <FormControl type="text" name="lastName" ref={register} />
              <p style={{ color: "red" }}>{errors.lastName?.message}</p>
            </Col>
          </Row>
        </FormGroup>

        <FormGroup>
          <FormLabel>Password</FormLabel>
          <FormControl type="password" name="password" ref={register} />
          <p style={{ color: "red" }}>{errors.password?.message}</p>
        </FormGroup>

        <FormGroup>
          <FormLabel>Repeat password</FormLabel>
          <FormControl type="password" name="repeatPassword" ref={register} />
          <p style={{ color: "red" }}>{errors.repeatPassword?.message}</p>
        </FormGroup>

        <p style={{ color: "red" }}>{serverErrors}</p>

        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </Container>
  );
}
