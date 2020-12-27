import React, { Component, useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import { UserContext, initialState } from "../contexts/UserContext";
import { getLoggedInUser } from "../services/authService";

import ProtectedRoute from "../components/protectedRoute";
import HeaderBar from "./headerBar";
import Register from "./register";
import Login from "./login";
import Main from "./main";

export default function App() {
  const [user, setUser] = useState(null);

  const fetchAndSetUser = async () => {
    const loggedInUser = await getLoggedInUser();

    setUser(loggedInUser);
  };

  useEffect(() => {
    fetchAndSetUser();
  }, []);

  return user ? (
    <UserContext.Provider value={[user, setUser]}>
      <HeaderBar />
      <Container>
        <Switch>
          <Route path="/login" component={Login} exact></Route>
          <Route path="/register" component={Register} exact></Route>

          <ProtectedRoute path="/" component={Main} exact></ProtectedRoute>

          <Route path="*">
            <div>404 Not Found</div>
          </Route>
        </Switch>
      </Container>
    </UserContext.Provider>
  ) : (
    <div />
  );
}
