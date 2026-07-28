import axios from "axios";

const api = axios.create({
  baseURL: "baseurl",

  auth: {
    username: "username",
    password: "password",
  },

  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
});

export default api;
