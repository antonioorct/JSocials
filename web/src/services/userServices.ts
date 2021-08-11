import axios from "axios";
import { PROFILE_URL, USERS_URL } from "../constants/apiRoutes";
import { IRegisterForm } from "../constants/formTypes";
import { IUserDetails, IUserProfile } from "../constants/models";

export const createUser = async ({
  repeatPassword,
  ...user
}: IRegisterForm): Promise<string> => {
  const { data } = await axios.post(USERS_URL, user);

  return data;
};

export const getUserProfile = async (userId: number): Promise<IUserProfile> => {
  const { data } = await axios.get(PROFILE_URL(userId));

  return data;
};

export const updateUserProfile = async (
  userDetails: IUserDetails
): Promise<IUserDetails> => {
  const { data } = await axios.put(USERS_URL, userDetails);

  return data;
};
