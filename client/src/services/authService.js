import http from "./httpService";
import jwtDecode from "jwt-decode";

const apiEndPoint = "http://localhost:3001/api/";

export async function register(email, password) {
  await http.post(apiEndPoint + "users", { email, password });
}

export async function sendLoginInfo(email, password) {
  const { data: jwt } = await http.post(apiEndPoint + "auth", {
    email,
    password,
  });

  return jwt;
}

export async function logout() {
  localStorage.removeItem("token");
}

export async function getLoggedInUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  else return jwtDecode(token);
}
