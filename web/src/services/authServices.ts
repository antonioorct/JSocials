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

export const getUserId = (): number => {
  const token = LocalStorage.getUserToken();

  if (token) {
    const decodedToken = jwtDecode<IUserJWT>(token);

    return decodedToken.sub;
  }

  return -1;
};

export const isUserOwnerOfObject = (user: IUser) => {
  const userId = getUserId();

  return userId === user.id;
};
