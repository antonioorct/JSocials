import React, { Component, useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import { UserContext, initialState } from "../contexts/UserContext";
import { getLoggedInUser } from "../services/authService";

import HeaderBar from "./headerBar";
import Register from "./register";
import Login from "./login";
import Main from "./main";

export default function App() {
  const [user, setUser] = useState(initialState);

  useEffect(() => {
    async function fetchUser() {
      const loggedInUser = await getLoggedInUser();

      setUser(loggedInUser);
    }
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={[user, setUser]}>
      <HeaderBar />
      <Container>
        <Switch>
          <Route path="/register" component={Register} exact></Route>
          <Route path="/login" component={Login} exact></Route>
          <Route path="/" component={Main} exact></Route>
          <Route path="*">
            <div>404 Not Found</div>
          </Route>
        </Switch>
      </Container>
    </UserContext.Provider>
  );
}
