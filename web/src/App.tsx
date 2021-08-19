import ROUTES from "./constants/routes";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { FC } from "react";
import GlobalStyle from "./theme/GlobalStyle";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "./components/Toast";
import axios, { AxiosRequestConfig } from "axios";
import { API_URL } from "./constants/apiRoutes";
import LocalStorage from "./utils/LocalStorage";
import { SocketContext, socket } from "./contexts/socket";

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = LocalStorage.getUserToken();

    if (config.url?.startsWith(API_URL) && token)
      config.headers["Authorization"] = token;

    return config;
  },
  (err) => Promise.reject(err)
);

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
      <SocketContext.Provider value={socket}>
        <GlobalStyle />
        <ToastContainer />
        <Router>
          <Switch>{getRoutes()}</Switch>
        </Router>
      </SocketContext.Provider>
    </>
  );
};

export default App;
