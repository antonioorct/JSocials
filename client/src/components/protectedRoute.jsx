import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

export default function ProtectedRoute({ component: Component, ...rest }) {
  const user = useContext(UserContext)[0];

  return user.isAuthenticated ? (
    <Route {...rest}>
      <Component />
    </Route>
  ) : (
    <Redirect to="/login" />
  );
}
