import api from './api';

export const activityService = {
  // Get all activities
  getActivities: async () => {
    try {
      const response = await api.get('/activity/');
      return response.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  },

  // Get single activity
  getActivity: async (activityId) => {
    try {
      const response = await api.get(`/activity/${activityId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching activity:', error);
      throw error;
    }
  },

  // Create activity
  createActivity: async (activityData) => {
    try {
      const response = await api.post('/activity/', activityData);
      return response.data;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  },

  // Update activity
  updateActivity: async (activityId, activityData) => {
    try {
      const response = await api.put(`/activity/${activityId}/`, activityData);
      return response.data;
    } catch (error) {
      console.error('Error updating activity:', error);
      throw error;
    }
  },

  // Delete activity
  deleteActivity: async (activityId) => {
    try {
      const response = await api.delete(`/activity/${activityId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  },
};