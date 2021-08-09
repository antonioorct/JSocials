import axios from "axios";
import {
  FRIEND_REQUESTS_COUNT_URL,
  FRIEND_REQUESTS_URL,
  FRIEND_URL,
} from "../constants/apiRoutes";
import { IFriendRequests, IUser } from "../constants/models";

export const getAllFriendRequests = async (): Promise<IFriendRequests> => {
  const { data } = await axios.get(FRIEND_REQUESTS_URL);

  return data;
};

export const getFriendRequestCount = async (): Promise<number> => {
  const { data } = await axios.get(FRIEND_REQUESTS_COUNT_URL);

  return data;
};

export const cancelFriendRequest = async (friend: IUser): Promise<void> =>
  await axios.put(FRIEND_REQUESTS_URL, {
    incoming_user_id: friend.id,
  });

export const declineFriendRequest = async (friend: IUser): Promise<void> =>
  await axios.put(FRIEND_REQUESTS_URL, {
    outgoing_user_id: friend.id,
  });

export const acceptFriendRequest = async (user: IUser): Promise<void> =>
  await axios.post(FRIEND_URL(user.id));
