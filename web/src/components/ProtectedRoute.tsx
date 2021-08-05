import { FC } from "react";
import { RouteProps, Route } from "react-router";
import { Redirect } from "react-router-dom";
import routes from "../constants/routes";
import LocalStorage from "../utils/LocalStorage";

interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<RouteProps>;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({
  component: Component,
  ...props
}: ProtectedRouteProps) => (
  <Route
    {...props}
    render={(props) =>
      LocalStorage.getUserToken() ? (
        <Component component={Component} {...props} />
      ) : (
        <Redirect to={routes.login.href} />
      )
    }
  />
);

export default ProtectedRoute;
