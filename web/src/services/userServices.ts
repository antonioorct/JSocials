import axios from "axios";
import { USERS_URL } from "../constants/apiRoutes";
import { IRegisterForm } from "../constants/formTypes";

export const createUser = async ({
  repeatPassword,
  ...user
}: IRegisterForm): Promise<string> => {
  const { data } = await axios.post(USERS_URL, user);

  return data;
};
