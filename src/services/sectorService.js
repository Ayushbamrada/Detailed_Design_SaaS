import api from './api';

export const sectorService = {
  // Get all sectors
  getSectors: async () => {
    try {
      const response = await api.get('/sector/');
      return response.data;
    } catch (error) {
      console.error('Error fetching sectors:', error);
      throw error;
    }
  },

  // Get single sector
  getSector: async (sectorId) => {
    try {
      const response = await api.get(`/sector/${sectorId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sector:', error);
      throw error;
    }
  },

  // Create sector
  createSector: async (sectorData) => {
    try {
      const response = await api.post('/sector/', sectorData);
      return response.data;
    } catch (error) {
      console.error('Error creating sector:', error);
      throw error;
    }
  },

  // Update sector
  updateSector: async (sectorId, sectorData) => {
    try {
      const response = await api.put(`/sector/${sectorId}/`, sectorData);
      return response.data;
    } catch (error) {
      console.error('Error updating sector:', error);
      throw error;
    }
  },

  // Delete sector
  deleteSector: async (sectorId) => {
    try {
      const response = await api.delete(`/sector/${sectorId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting sector:', error);
      throw error;
    }
  },
};