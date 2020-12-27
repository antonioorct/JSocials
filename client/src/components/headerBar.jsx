import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
import { initialState, UserContext } from "../contexts/UserContext";
import { logout } from "../services/authService";

export default function HeaderBar() {
  const [user, setUser] = useContext(UserContext);

  const handleLogout = () => {
    logout();

    setUser(initialState);
  };

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
        {user.isAuthenticated ? (
          <>
            <LinkContainer to={`/${user.email}`}>
              <Nav.Link>{user.email}</Nav.Link>
            </LinkContainer>
            <Button onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <Button href="/login">Login</Button>
        )}
      </Nav>
    </Navbar>
  );
}
