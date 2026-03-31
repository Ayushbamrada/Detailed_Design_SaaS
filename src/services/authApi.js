
import axios from 'axios';


const AUTH_BASE_URL = 'https://6mpwdglt-8000.inc1.devtunnels.ms';

const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data', 
  },
});


authApi.interceptors.request.use(
  (config) => {
    console.log('Auth API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

authApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Auth API Error:', error.response?.status, error.config?.url, error.response?.data);
    return Promise.reject(error);
  }
);

export default authApi;