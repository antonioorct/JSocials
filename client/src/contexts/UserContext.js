import { createContext } from "react";

export const initialState = {
  id: null,
  username: null,
  email: null,
  firstName: null,
  lastName: null,
  imagePath: null,
  isAuthenticated: false,
};

export const UserContext = createContext(initialState);
