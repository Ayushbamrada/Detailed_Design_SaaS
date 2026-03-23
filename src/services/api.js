// import axios from 'axios';

// // Base URL from your dev tunnel
// const BASE_URL = 'https://ksncfd6v-8004.inc1.devtunnels.ms';
// const API_PREFIX = '/detaildesign';

// const api = axios.create({
//   baseURL: BASE_URL + API_PREFIX,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // List of all your API endpoints that don't require authentication
// const publicEndpoints = [
//   '/Company/',
//   '/SubCompany/',
//   '/sector/',
//   '/client/',
//   '/activity/',
//   '/project/',
//   '/subactivity/'
// ];

// // Request interceptor - DON'T add auth token to any requests
// api.interceptors.request.use(
//   (config) => {
//     console.log('API Request:', config.method.toUpperCase(), config.url);
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor - DON'T logout on 401
// api.interceptors.response.use(
//   (response) => {
//     console.log('API Response:', response.status, response.config.url);
//     return response;
//   },
//   (error) => {
//     console.error('API Error:', error.response?.status, error.config?.url, error.response?.data);
    
//     // DON'T logout on 401 since we don't have auth yet
//     // Just log the error and let the component handle it
    
//     return Promise.reject(error);
//   }
// );

// export default api;

// src/services/api.js
import axios from 'axios';

const BASE_URL = 'https://ksncfd6v-8007.inc1.devtunnels.ms';
const API_PREFIX = '/detaildesign';

const api = axios.create({
  baseURL: BASE_URL + API_PREFIX,
  headers: {
    'Content-Type': 'application/json',
  },
});

// IMPORTANT: Now we need to add auth token to these requests
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    
    // Add auth token from localStorage if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Auth token added to request');
    } else {
      console.warn('No auth token found for API request');
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle 401 errors (token expired)
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error('API Error:', error.response?.status, error.config?.url, error.response?.data);
    
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          // No refresh token, redirect to login
          console.log('No refresh token found, redirecting to login');
          window.location.href = '/';
          return Promise.reject(error);
        }
        
        // Call refresh token endpoint (using authApi because it's an auth endpoint)
        const authApi = (await import('./authApi')).default;
        const response = await authApi.post('/user/token/refresh/', {
          refresh: refreshToken
        });
        
        if (response.data.access) {
          // Store new token
          localStorage.setItem('authToken', response.data.access);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Refresh failed, redirect to login
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;