import http from "./httpService";
import { isSession } from "./authService";

const apiEndPoint = process.env.REACT_APP_API_URL;

async function getUser(userId) {
  const { data } = await http.get(`${apiEndPoint}/users/${userId}`);

  return data;
}

async function getLocalUserData(userId) {
  let userData =
    localStorage.getItem("userData") || sessionStorage.getItem("userData");

  if (!userData) {
    userData = await getUser(userId);
    userData = {
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      imagePath: userData.imagePath,
    };

    if (isSession()) saveUserToSession(JSON.stringify(userData));
    else saveUserToLocal(JSON.stringify(userData));
  } else userData = JSON.parse(userData);

  return userData;
}

function saveUserToLocal(userData) {
  localStorage.setItem("userData", userData);
}
function saveUserToSession(userData) {
  sessionStorage.setItem("userData", userData);
}

export { getUser, saveUserToLocal, getLocalUserData };
