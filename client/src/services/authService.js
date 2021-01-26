import http from "./httpService";
import jwtDecode from "jwt-decode";
import { initialState } from "../contexts/UserContext";
import { getLocalUserData } from "./userService";

const apiEndPoint = process.env.REACT_APP_API_URL;

async function sendLoginInfo(username, password) {
  const { data } = await http.post(`${apiEndPoint}/auth`, {
    username,
    password,
  });

  return data;
}

async function refreshJwt(userId) {
  const { data } = await http.post(`${apiEndPoint}/auth/${userId}/jwt`);

  return data;
}

async function saveJwt(jwt) {
  if (isSession()) sessionStorage.setItem("token", jwt);
  else localStorage.setItem("token", jwt);
}

async function saveJwtToSession(jwt) {
  sessionStorage.setItem("token", jwt);
}

async function saveJwtToLocal(jwt) {
  localStorage.setItem("token", jwt);
}

async function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userData");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("userData");
}

async function getLoggedInUser() {
  let token = localStorage.getItem("token");
  if (!token) token = sessionStorage.getItem("token");

  if (!token) return initialState;
  else {
    const { sub: userId, iat: tokenIssuedAt, exp: tokenExpires } = jwtDecode(
      token
    );
    const userData = await getLocalUserData(userId);

    if (
      new Date(Date.now()).getTime() / 1000 - tokenIssuedAt >= 3600 &&
      !isSession()
    ) {
      console.log(
        "New token -> last time difference: " +
          (new Date(Date.now()).getTime() / 1000 - tokenIssuedAt).toString()
      );
      const newJwt = await refreshJwt(userId);

      saveJwt(newJwt);
      return await getLoggedInUser();
    }

    return { id: userId, tokenIssuedAt, isAuthenticated: true, ...userData };
  }
}

function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

function isSession() {
  return sessionStorage.getItem("token")
    ? true
    : localStorage.getItem("token")
    ? false
    : null;
}

export {
  sendLoginInfo,
  refreshJwt,
  saveJwt,
  saveJwtToLocal,
  saveJwtToSession,
  logout,
  getLoggedInUser,
  getToken,
  isSession,
};
