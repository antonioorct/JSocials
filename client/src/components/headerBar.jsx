import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { LinkContainer } from "react-router-bootstrap";

export function HeaderBar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="/">TVZSocials</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Nav className="ml-auto">
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            console.log(e.target);
          }}
          className="mr-4"
        >
          <InputGroup>
            <FormControl placeholder="Search"></FormControl>
            <InputGroup.Append>
              <Button variant="outline-success">Search</Button>
            </InputGroup.Append>
          </InputGroup>
        </Form>
        {this.props.user && (
          <>
            <LinkContainer to={`/${this.props.user.email}`}>
              <Nav.Link>{this.props.user.email}</Nav.Link>
            </LinkContainer>
            <Button
              onClick={() => {
                localStorage.removeItem("token");
              }}
            >
              Logout
            </Button>
          </>
        )}
        {!this.props.user && <Button href="/login">Login</Button>}
      </Nav>
    </Navbar>
  );
}
