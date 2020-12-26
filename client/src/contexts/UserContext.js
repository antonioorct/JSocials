import { createContext } from "react";

export const initialState = {
  email: "email@mail.com",
  id: null,
  token: null,
  isAuthenticated: false,
};

export const UserContext = createContext(initialState);
