import api from './api';

export const companyService = {

  getCompanies: async () => {
    try {
      const response = await api.get('/Company/');
      return response.data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  },


  getCompany: async (companyId) => {
    try {
      const response = await api.get(`/Company/${companyId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching company:', error);
      throw error;
    }
  },


  createCompany: async (companyData) => {
    try {
      const response = await api.post('/Company/', companyData);
      return response.data;
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  },

  
  updateCompany: async (companyId, companyData) => {
    try {
      const response = await api.put(`/Company/${companyId}/`, companyData);
      return response.data;
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  },

  
  deleteCompany: async (companyId) => {
    try {
      const response = await api.delete(`/Company/${companyId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  },
};