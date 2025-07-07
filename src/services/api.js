import axios from 'axios';

const API = axios.create({
  baseURL: 'https://library-management-backend-a5t7.onrender.com',
  withCredentials: true, // optional, for secure cookies or session info
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
