import api from './api';

export const clientService = {
  // Get all clients
  getClients: async () => {
    try {
      const response = await api.get('/client/');
      return response.data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  // Get single client
  getClient: async (clientId) => {
    try {
      const response = await api.get(`/client/${clientId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching client:', error);
      throw error;
    }
  },

  // Create client
  createClient: async (clientData) => {
    try {
      const response = await api.post('/client/', clientData);
      return response.data;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  // Update client
  updateClient: async (clientId, clientData) => {
    try {
      const response = await api.put(`/client/${clientId}/`, clientData);
      return response.data;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  },

  // Delete client
  deleteClient: async (clientId) => {
    try {
      const response = await api.delete(`/client/${clientId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  },
};