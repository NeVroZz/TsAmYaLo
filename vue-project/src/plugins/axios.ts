import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://realword-api.nouwillcode.com/api',
});

// Intercepteur pour inclure le token dans les en-têtes
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default instance;
