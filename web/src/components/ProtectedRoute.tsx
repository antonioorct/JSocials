import { FC } from "react";
import { RouteProps, Route } from "react-router";

interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<RouteProps>;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({
  component: Component,
  ...props
}: ProtectedRouteProps) => {
  return (
    <Route
      {...props}
      render={
        (props) => <Component {...props} />
        // TODO: add check for log in
        // LocalStorage.getUserToken() ? (
        //   <Component {...props} />
        // ) : (
        //   <Redirect
        //     to={{
        //       pathname: routes.login.href,
        //       state: { from: props.location },
        //     }}
        //   />
        // )
      }
    />
  );
};

export default ProtectedRoute;
