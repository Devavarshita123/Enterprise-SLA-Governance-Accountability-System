import axios from "axios";

const api = axios.create({
  baseURL: "https://dev401590.service-now.com/api/now/table",

  auth: {
    username: "vrsec.student",
    password: "Snow@2311",
  },

  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
});

export default api;