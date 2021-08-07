import axios from "axios";
import { AUTH_URL } from "../constants/apiRoutes";
import { ILoginForm } from "../constants/formTypes";
import { IUser, IUserJWT } from "../constants/models";
import LocalStorage from "../utils/LocalStorage";
import jwtDecode from "jwt-decode";

export const sendLoginInfo = async (form: ILoginForm) => {
  const { data } = await axios.post(AUTH_URL, form);

  return data;
};

export const getUserId = (): IUserJWT | null => {
  const token = LocalStorage.getUserToken();

  if (token) return jwtDecode<IUserJWT>(token);

  return null;
};

export const isUserOwnerOfObject = (user: IUser) => {
  const t = getUserId();

  return t?.sub === user.id;
};
