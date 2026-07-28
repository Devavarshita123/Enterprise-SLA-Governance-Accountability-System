import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASEURL,

  auth: {
    username: process.env.REACT_APP_USERNAME,
    password: process.env.REACT_APP_PASSWORD,
  },

  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default api;
