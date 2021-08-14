import { FC } from "react";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Friends from "../pages/Friends";
import FriendRequests from "../pages/FriendRequests";
import Messenger from "../pages/Messenger";
import Settings from "../pages/Settings";

export interface IRoute {
  name: string;
  href: string;
  component: FC;
  protected: boolean;
}

interface IRoutes {
  notFound: IRoute;
  friends: IRoute;
  friendRequests: IRoute;
  login: IRoute;
  home: IRoute;
  userProfile: IRoute;
  profile: IRoute;
  register: IRoute;
  messenger: IRoute;
  settings: IRoute;
}

const routes: IRoutes = {
  login: {
    name: "Login",
    href: "/login",
    component: Login,
    protected: false,
  },
  register: {
    name: "Register",
    href: "/register",
    component: Register,
    protected: false,
  },
  messenger: {
    name: "Messenger",
    href: "/messenger",
    component: Messenger,
    protected: true,
  },
  profile: {
    name: "Profile",
    href: "/profile",
    component: Profile,
    protected: true,
  },
  userProfile: {
    name: "User profile",
    href: "/user/:id",
    component: Profile,
    protected: true,
  },
  home: {
    name: "Home",
    href: "/",
    component: Home,
    protected: true,
  },
  friends: {
    name: "Friends",
    href: "/friends",
    component: Friends,
    protected: true,
  },
  friendRequests: {
    name: "Friend requests",
    href: "/friend-requests",
    component: FriendRequests,
    protected: true,
  },
  settings: {
    name: "Settings",
    href: "/settings",
    component: Settings,
    protected: true,
  },
  notFound: {
    name: "404",
    href: "*",
    component: NotFound,
    protected: false,
  },
};

export default routes;
