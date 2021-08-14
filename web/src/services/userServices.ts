import axios from "axios";
import {
  CREDENTIALS_URL,
  PROFILE_URL,
  USERS_URL,
  USER_PHOTO_URL,
} from "../constants/apiRoutes";
import { ICredentialsForm, IRegisterForm } from "../constants/formTypes";
import { IUser, IUserDetails, IUserProfile } from "../constants/models";

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

export const getUserCredentials = async (): Promise<ICredentialsForm> => {
  const { data } = await axios.get(CREDENTIALS_URL);

  return {
    username: data.username,
    email: data.email,
    password: data.password,
    repeatPassword: data.password,
  };
};

export const updateUserCredentials = async ({
  repeatPassword,
  ...credentials
}: ICredentialsForm): Promise<ICredentialsForm> => {
  const { data } = await axios.put(CREDENTIALS_URL, credentials);

  return data;
};

export const updateUserProfile = async (
  userDetails: IUserDetails
): Promise<IUserDetails> => {
  const { data } = await axios.put(USERS_URL, userDetails);

  return data;
};

export const updateProfilePhoto = async (
  photoFormData: FormData
): Promise<IUser> => {
  const { data } = await axios.put(USER_PHOTO_URL, photoFormData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const removeProfilePhoto = async (): Promise<void> =>
  await axios.delete(USER_PHOTO_URL);
