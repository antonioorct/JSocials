import { FC } from "react";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";

export interface IRoute {
  name: string;
  href: string;
  component: FC;
  protected: boolean;
}

interface IRoutes {
  notFound: IRoute;
  login: IRoute;
}

const routes: IRoutes = {
  login: {
    name: "Login",
    href: "/login",
    component: Login,
    protected: false,
  },
  notFound: {
    name: "404",
    href: "*",
    component: NotFound,
    protected: false,
  },
};

export default routes;
