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

axios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response || err.response.status >= 500)
      return Promise.reject({
        ...err,
        response: { data: { detail: "Internal server error" } },
      });

    console.log(err.response);

    if (err.response.status >= 400 && err.response.status <= 405)
      return Promise.reject(err);

    return Promise.reject(err);
  }
);

const http = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  head: axios.head,
};

export default http;
