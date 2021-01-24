import http from "./httpService";

export async function createNewChat(firstUser, secondUser) {
  const { data } = await http.post("http://localhost:3001/api/chats", {
    userOutgoingId: firstUser.id,
    userIncomingId: secondUser.id,
  });

  return data;
}

export default {
  createNewChat,
};
