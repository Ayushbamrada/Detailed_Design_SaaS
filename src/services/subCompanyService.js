import api from './api';

export const subCompanyService = {

  getSubCompanies: async () => {
    try {
      const response = await api.get('/SubCompany/');
      return response.data;
    } catch (error) {
      console.error('Error fetching sub companies:', error);
      throw error;
    }
  },

  // Get single sub company
  getSubCompany: async (subcompanyId) => {
    try {
      const response = await api.get(`/SubCompany/${subcompanyId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sub company:', error);
      throw error;
    }
  },

  // Create sub company
  createSubCompany: async (subCompanyData) => {
    try {
      const response = await api.post('/SubCompany/', subCompanyData);
      return response.data;
    } catch (error) {
      console.error('Error creating sub company:', error);
      throw error;
    }
  },

  // Update sub company
  updateSubCompany: async (subcompanyId, subCompanyData) => {
    try {
      const response = await api.put(`/SubCompany/${subcompanyId}/`, subCompanyData);
      return response.data;
    } catch (error) {
      console.error('Error updating sub company:', error);
      throw error;
    }
  },

  // Delete sub company
  deleteSubCompany: async (subcompanyId) => {
    try {
      const response = await api.delete(`/SubCompany/${subcompanyId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting sub company:', error);
      throw error;
    }
  },
};