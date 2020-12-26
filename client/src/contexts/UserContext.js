import { createContext } from "react";

export const initialState = {
  email: null,
  id: null,
  token: null,
  isAuthenticated: false,
};

export const UserContext = createContext(initialState);
