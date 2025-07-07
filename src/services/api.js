import axios from 'axios';

// 🔍 Debug log to check if the environment variable is being read correctly
console.log("REACT_APP_BACKEND_URL =", process.env.REACT_APP_BACKEND_URL);

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
