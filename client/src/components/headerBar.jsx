import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
import { Redirect, useHistory } from "react-router-dom";
import { initialState, UserContext } from "../contexts/UserContext";
import { logout } from "../services/authService";

export default function HeaderBar(props) {
  const [user, setUser] = useContext(UserContext);
  const [search, setSearch] = useState("");
  const history = useHistory();

  const handleLogout = () => {
    logout();

    setUser(initialState);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="/">TVZSocials</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Nav>
        <Nav.Link href="/messenger">Messenger</Nav.Link>
      </Nav>
      <Nav className="ml-auto">
        <Form
          onSubmit={(e) => {
            e.preventDefault();

            if (window.location.pathname === "/search")
              window.location.reload();
            history.replace("/search", { firstName: search });
          }}
          className="mr-4"
        >
          <InputGroup>
            <FormControl
              value={search}
              onChange={({ target }) => setSearch(target.value)}
              placeholder="Search"
            ></FormControl>
            <InputGroup.Append>
              <Button type="submit" variant="outline-success">
                Search
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Form>
        {user.isAuthenticated ? (
          <>
            <LinkContainer to={`/${user.username}`}>
              <Nav.Link>{`${user.firstName} ${user.lastName}`}</Nav.Link>
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
