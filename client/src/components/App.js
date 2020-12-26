import React, { Component, useState } from "react";
import { Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import { UserContext } from "../contexts/UserContext";

import HeaderBar from "./headerBar";
import Register from "./register";
import Login from "./login";
import Main from "./main";

export default function App() {
  const [user, setUser] = useState({ email: "test@test", id: 1 });

  return (
    <UserContext.Provider value={[user, setUser]}>
      <HeaderBar />
      <Container>
        <Switch>
          <Route path="/register" component={Register}></Route>
          <Route path="/login" component={Login}></Route>
          <Route path="/" component={Main}></Route>
        </Switch>
      </Container>
    </UserContext.Provider>
  );
}
