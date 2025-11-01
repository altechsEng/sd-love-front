import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const api = axios.create({
  baseURL: "http://192.168.1.103:8000/api",
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = AsyncStorage.getItem('user_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      AsyncStorage.removeItem('user_token');
      window.location = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;