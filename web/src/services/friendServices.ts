import axios from "axios";
import { FRIENDS_URL, FRIEND_URL } from "../constants/apiRoutes";
import { FriendStatus, IUser } from "../constants/models";

export const getAllFriends = async (): Promise<IUser[]> => {
  const { data } = await axios.get(FRIENDS_URL);

  return data;
};

export const removeFriend = async (friendId: number): Promise<void> =>
  await axios.delete(FRIEND_URL(friendId));

export const getFriendStatus = async (user: IUser): Promise<FriendStatus> => {
  const { data } = await axios.get(FRIEND_URL(user.id));

  return data;
};
