import http from "./httpService";

const apiEndPoint = process.env.REACT_APP_API_URL;

async function getFriendsFromUserId(userId) {
  const { data } = await http.get(`${apiEndPoint}/users/${userId}/friends`);

  return data;
}

async function getFriendStatus(userId, friendId) {
  try {
    const { data } = await http.get(
      `${apiEndPoint}/users/${userId}/friends/${friendId}`
    );
    return data;
  } catch (err) {
    if (err.response.status === 404) return { status: "not friends" };
    else return {};
  }
}

async function removeFriendship(userId, friendId) {
  await http.delete(`${apiEndPoint}/users/${userId}/friends/${friendId}`);
}

async function acceptFriendRequest(friendRequestId) {
  await http.post(`${apiEndPoint}/friend-requests/${friendRequestId}`);
}

async function cancelFriendRequest(friendRequestId) {
  await http.delete(`${apiEndPoint}/friend-requests/${friendRequestId}`);
}

async function sendFriendRequest(friendId) {
  await http.post(`${apiEndPoint}/friend-requests`, { friendId });
}

export {
  getFriendsFromUserId,
  getFriendStatus,
  removeFriendship,
  acceptFriendRequest,
  cancelFriendRequest,
  sendFriendRequest,
};
