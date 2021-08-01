import ROUTES from "./constants/routes";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { FC } from "react";
import GlobalStyle from "./theme/GlobalStyle";
import Header from "./components/Header";

const getRoutes = (): React.ReactElement[] =>
  Object.keys(ROUTES).map((key, index) => {
    const route = ROUTES[key as keyof typeof ROUTES];

    return route.protected ? (
      <ProtectedRoute
        key={index}
        path={route.href}
        component={route.component}
        exact
      />
    ) : (
      <Route key={index} path={route.href} component={route.component} exact />
    );
  });

const App: FC = () => {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Header />
        <Switch>{getRoutes()}</Switch>
      </Router>
    </>
  );
};

export default App;
