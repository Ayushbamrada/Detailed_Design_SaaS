// src/services/authService.js
import authApi from './authApi';

class AuthService {

  async login(email, password) {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      const response = await authApi.post('/user/login/', formData);
      return response.data;
    } catch (error) {
      console.error('Login service error:', error);
      throw error;
    }
  }

  
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

  
  logout() {
    localStorage.clear();
    sessionStorage.clear();
  }


  getUserData() {
    return {
      token: localStorage.getItem('authToken'),
      refreshToken: localStorage.getItem('refreshToken'),
      email: localStorage.getItem('userEmail'),
      name: localStorage.getItem('userName'),
      role: localStorage.getItem('userRole'),
      
      empCode: sessionStorage.getItem('emp_code'),
      department: sessionStorage.getItem('department_name'),
      company: sessionStorage.getItem('company'),
    };
  }

  
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }
}

export default new AuthService();