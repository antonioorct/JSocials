import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
import ProtectedRoute from "../components/protectedRoute";
import { UserContext } from "../contexts/UserContext";
import { getLoggedInUser } from "../services/authService";
import HeaderBar from "./headerBar";
import Login from "./login";
import Main from "./main";
import Messenger from "./messenger";
import Register from "./register";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchAndSetUser = async () => {
      const loggedInUser = await getLoggedInUser();

      setUser(loggedInUser);
    };

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
          <ProtectedRoute
            path="/messenger"
            component={Messenger}
            exact
          ></ProtectedRoute>

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
