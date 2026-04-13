import api from './api';

export const activityTemplateService = {

  getActivityTemplates: async () => {
    try {
      const response = await api.get('/activity-template/');
      return response.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  },


  getActivityTemplate: async (activityId) => {
    try {
      const response = await api.get(`/activity-template/${activityId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching activity:', error);
      throw error;
    }
  },


  createActivityTemplate: async (activityTemplateData) => {
    try {
      const payload = Array.isArray(activityTemplateData) ? activityTemplateData : [activityTemplateData];
      console.log('Creating activity template with payload:', payload);
      const response = await api.post('/activity-template/', payload);
      return Array.isArray(response.data) ? response.data[0] : response.data; // Doubt : why 1st item of list 
    } catch (error) {
      console.error('Error creating activity template:', error);
      throw error;
    }
  },


  createActivityTemplatesBulk: async (activityTemplateData) => {
    try {
      const payload = Array.isArray(activityTemplateData) ? activityTemplateData : [activityTemplateData];
      console.log('Creating bulk activity templates with payload:', payload);
      const response = await api.post('/activity-template/', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating bulk activity templates:', error);
      throw error;
    }
  },

  updateActivityTemplate: async (activityTemplateId, activityTemplateData) => {
    try {
      const response = await api.put(`/activity/${activityTemplateId}/`, activityTemplateData);
      return response.data;
    } catch (error) {
      console.error('Error updating activity:', error);
      throw error;
    }
  },


  deleteActivityTemplate: async (activityTemplateId) => {
    try {
      const response = await api.delete(`/activity/${activityTemplateId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  },
};