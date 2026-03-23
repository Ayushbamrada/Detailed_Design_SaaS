// src/services/authService.js
import authApi from './authApi';

class AuthService {
  // Login using authApi
  async login(email, password) {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      
      console.log('Attempting login with:', { email });
      
      const response = await authApi.post('/user/login/', formData);
      console.log('Login response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Login service error:', error);
      throw error;
    }
  }

  // Refresh token using authApi
  async refreshToken(refreshToken) {
    try {
      const response = await authApi.post('/user/token/refresh/', {
        refresh: refreshToken
      });
      return response.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  // Logout - clear all storages
  logout() {
    localStorage.clear();
    sessionStorage.clear();
    console.log('User logged out, storage cleared');
  }

  // Get stored user data
  getUserData() {
    return {
      token: localStorage.getItem('authToken'),
      refreshToken: localStorage.getItem('refreshToken'),
      email: localStorage.getItem('userEmail'),
      name: localStorage.getItem('userName'),
      role: localStorage.getItem('userRole'),
      // Session data
      empCode: sessionStorage.getItem('emp_code'),
      department: sessionStorage.getItem('department_name'),
      company: sessionStorage.getItem('company'),
    };
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }
}

export default new AuthService();