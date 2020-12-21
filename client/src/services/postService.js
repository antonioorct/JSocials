import http from "./httpService";

const apiEndPoint = "http://localhost:3001/api/posts";

export async function getAllPosts() {
  const { data } = await http.get(apiEndPoint);

  return data;
}

export async function getPostsFromUserId(userId) {
  const { data } = await http.get(apiEndPoint + `/${userId}`);

  return data;
}
