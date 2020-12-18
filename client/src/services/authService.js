import http from "./httpService";

const apiEndPoint = "http://localhost:3001/api/";

export async function register(email, password) {
  await http.post(apiEndPoint + "users", { email, password });
}

export async function login(email, password) {
  const { data: jwt } = await http.post(apiEndPoint + "auth", {
    email,
    password,
  });
  return jwt;
}
