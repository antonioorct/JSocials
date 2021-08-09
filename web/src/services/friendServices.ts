import axios from "axios";
import { FRIENDS_URL, FRIEND_URL } from "../constants/apiRoutes";
import { IUser } from "../constants/models";

export const getAllFriends = async (): Promise<IUser[]> => {
  const { data } = await axios.get(FRIENDS_URL);

  return data;
};

export const removeFriend = async (friendId: number): Promise<void> =>
  await axios.delete(FRIEND_URL(friendId));
