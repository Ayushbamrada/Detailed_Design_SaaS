import api from './api';

export const subActivityService = {
  // Get all sub activities
  getSubActivities: async () => {
    try {
      const response = await api.get('/subactivity/');
      return response.data;
    } catch (error) {
      console.error('Error fetching sub activities:', error);
      throw error;
    }
  },

  // Get single sub activity
  getSubActivity: async (subactivityId) => {
    try {
      const response = await api.get(`/subactivity/${subactivityId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sub activity:', error);
      throw error;
    }
  },

  // Create sub activity
  createSubActivity: async (subActivityData) => {
    try {
      const response = await api.post('/subactivity/', subActivityData);
      return response.data;
    } catch (error) {
      console.error('Error creating sub activity:', error);
      throw error;
    }
  },

  // Update sub activity
  updateSubActivity: async (subactivityId, subActivityData) => {
    try {
      const response = await api.put(`/subactivity/${subactivityId}/`, subActivityData);
      return response.data;
    } catch (error) {
      console.error('Error updating sub activity:', error);
      throw error;
    }
  },

  // Delete sub activity
  deleteSubActivity: async (subactivityId) => {
    try {
      const response = await api.delete(`/subactivity/${subactivityId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting sub activity:', error);
      throw error;
    }
  },
};