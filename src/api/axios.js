import axios from 'axios';

const BASEURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API URL:', BASEURL);

const api = axios.create({
  baseURL: BASEURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lv_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;