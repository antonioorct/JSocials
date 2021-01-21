import axios from "axios";
import { getToken } from "./authService";

axios.interceptors.request.use(
  function (config) {
    config.headers = {
      Authorization: "Bearer " + getToken(),
      Accept: "application/json",
    };

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    console.log(error);
  }

  return Promise.reject(error);
});

const http = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  head: axios.head,
};

export default http;
