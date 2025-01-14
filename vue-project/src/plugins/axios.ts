import axios from "axios";

const instance = axios.create({
  baseURL: "https://realword-api.nouwillcode.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajout automatique du token JWT dans les en-têtes
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default instance;
