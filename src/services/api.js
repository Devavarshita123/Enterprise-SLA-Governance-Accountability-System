import axios from "axios";

const api = axios.create({
  baseURL: "base-url",

  auth: {
    username: "user-name",
    password: "pass-word",
  },

  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
});

export default api;
