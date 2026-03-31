import api from './api';

export const activityService = {
  
  getActivities: async () => {
    try {
      const response = await api.get('/activity/');
      return response.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  },

  
  getActivity: async (activityId) => {
    try {
      const response = await api.get(`/activity/${activityId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching activity:', error);
      throw error;
    }
  },

  
  createActivity: async (activityData) => {
    try {
      const payload = Array.isArray(activityData) ? activityData : [activityData];
      console.log('Creating activity with payload:', payload);
      const response = await api.post('/activity/', payload);
      return Array.isArray(response.data) ? response.data[0] : response.data;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  },

  
  createActivitiesBulk: async (activitiesData) => {
    try {
      const payload = Array.isArray(activitiesData) ? activitiesData : [activitiesData];
      console.log('Creating bulk activities with payload:', payload);
      const response = await api.post('/activity/', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating bulk activities:', error);
      throw error;
    }
  },

  
  updateActivityProgress: async (activityId, progressData) => {
    try {
      console.log('Updating activity progress with PUT:', { activityId, progressData });
      
      const response = await api.put(`/activity/${activityId}/`, progressData);
      return response.data;
    } catch (error) {
      console.error('Error updating activity progress:', error);
      throw error;
    }
  },

  
  updateActivity: async (activityId, activityData) => {
    try {
      const response = await api.put(`/activity/${activityId}/`, activityData);
      return response.data;
    } catch (error) {
      console.error('Error updating activity:', error);
      throw error;
    }
  },

  
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