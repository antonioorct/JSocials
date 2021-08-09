export const BACKEND_URL = `http://localhost:${process.env.REACT_APP_SERVER_PORT}`;

export const API_URL = `${BACKEND_URL}/api`;

export const SOCKET_URL = `http://localhost:${process.env.REACT_APP_SOCKET_PORT}`;

export const getAssetUrl = (url: string) => `${BACKEND_URL}/${url}`;

export const USERS_URL = API_URL + "/users";

export const AUTH_URL = API_URL + "/auth";

export const POSTS_URL = API_URL + "/posts";
export const POST_URL = (postId: number) => `${POSTS_URL}/${postId}`;
export const LIKE_POST_URL = (postId: number) => `${POST_URL(postId)}/like`;

export const CHATS_URL = API_URL + "/chats";
export const CHAT_URL = (chatId: number) => `${CHATS_URL}/${chatId}`;

export const FRIENDS_URL = API_URL + "/friends";
export const FRIEND_URL = (friendId: number) => `${FRIENDS_URL}/${friendId}`;

export const FRIEND_REQUESTS_URL = API_URL + "/friend-requests";
export const FRIEND_REQUESTS_COUNT_URL = `${FRIEND_REQUESTS_URL}/count`;
export const FRIEND_REQUEST_URL = (userId: number) =>
  `${FRIEND_REQUESTS_URL}/${userId}`;
