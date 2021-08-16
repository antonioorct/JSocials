import axios from "axios";
import { CHATS_URL, CHAT_URL } from "../constants/apiRoutes";
import { IChat, IMessage, IUser } from "../constants/models";

export const getAllChats = async (): Promise<IChat[]> => {
  const { data } = await axios.get(CHATS_URL);

  data.map((chat: IChat) => {
    chat.recepient = chat.users[0];

    return chat;
  });

  return data;
};

export const createChat = async (
  content: string,
  user: IUser
): Promise<IChat> => {
  const { data } = await axios.post(CHATS_URL, { userId: user.id, content });

  data.recepient = data.users[0];

  return data;
};

export const sendMessage = async (
  chatId: number,
  content: string
): Promise<IMessage> => {
  const { data } = await axios.post(CHAT_URL(chatId), { content });

  return data;
};

export const addMessage = ([...chats]: IChat[], message: IMessage): IChat[] => {
  const chatIndex = chats.findIndex((chat) => chat.id === message.chatId);

  chats[chatIndex].messages.unshift(message);

  const [chat] = chats.splice(chatIndex, 1);

  chats.unshift(chat);

  return chats;
};
