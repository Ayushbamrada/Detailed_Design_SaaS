import axios from 'axios';

// Base URL from your dev tunnel
const BASE_URL = 'https://ksncfd6v-8004.inc1.devtunnels.ms';
const API_PREFIX = '/detaildesign';

const api = axios.create({
  baseURL: BASE_URL + API_PREFIX,
  headers: {
    'Content-Type': 'application/json',
  },
});

// List of all your API endpoints that don't require authentication
const publicEndpoints = [
  '/Company/',
  '/SubCompany/',
  '/sector/',
  '/client/',
  '/activity/',
  '/project/',
  '/subactivity/'
];

// Request interceptor - DON'T add auth token to any requests
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - DON'T logout on 401
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url, error.response?.data);
    
    // DON'T logout on 401 since we don't have auth yet
    // Just log the error and let the component handle it
    
    return Promise.reject(error);
  }
);

export default api;