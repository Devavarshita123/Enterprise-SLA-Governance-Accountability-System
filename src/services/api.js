import axios from "axios";

const api = axios.create({
  baseURL: process.env.baseurl,

  auth: {
    username: "username",
    password: "password",
  },

  headers: {
    username: process.env.username,
    password: process.env.password,
  },
});

export default api;
