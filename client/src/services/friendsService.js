import http from "./httpService";

export async function getFriends(user) {
  const { data } = await http.get(
    "http://localhost:3001/api/users/friends/" + user.id
  );

  return data;
}

export default {
  getFriends,
};
