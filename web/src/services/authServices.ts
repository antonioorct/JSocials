import axios from "axios";
import { AUTH_URL } from "../constants/apiRoutes";
import { ILoginForm } from "../constants/formTypes";

export const sendLoginInfo = async (form: ILoginForm) => {
  const { data } = await axios.post(AUTH_URL, form);

  return data;
};
