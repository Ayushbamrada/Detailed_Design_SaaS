// src/services/authApi.js
import axios from 'axios';

// Login API base URL
const AUTH_BASE_URL = 'https://6mpwdglt-8000.inc1.devtunnels.ms';

const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data', // Login expects form-data
  },
});

// No auth token needed for login (obviously)
authApi.interceptors.request.use(
  (config) => {
    console.log('Auth API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

authApi.interceptors.response.use(
  (response) => {
    console.log('Auth API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Auth API Error:', error.response?.status, error.config?.url, error.response?.data);
    return Promise.reject(error);
  }
);

export default authApi;