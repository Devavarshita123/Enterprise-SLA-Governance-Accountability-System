import axios from "axios";

const api = axios.create({
  baseURL: process.env.baseurl,

  auth: {
    username: process.env.username,
    password: process.env.password,
  },

  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default api;
