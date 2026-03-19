
// import api from './api';

// export const activityService = {
//   // Get all activities
//   getActivities: async () => {
//     try {
//       const response = await api.get('/activity/');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching activities:', error);
//       throw error;
//     }
//   },

//   // Get single activity
//   getActivity: async (activityId) => {
//     try {
//       const response = await api.get(`/activity/${activityId}/`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching activity:', error);
//       throw error;
//     }
//   },

//   // Create single activity (for backward compatibility)
//   createActivity: async (activityData) => {
//     try {
//       const payload = Array.isArray(activityData) ? activityData : [activityData];
//       console.log('Creating single activity with payload:', payload);
//       const response = await api.post('/activity/', payload);
//       return Array.isArray(response.data) ? response.data[0] : response.data;
//     } catch (error) {
//       console.error('Error creating activity:', error);
//       throw error;
//     }
//   },

//   // Create multiple activities in bulk
//   createActivitiesBulk: async (activitiesData) => {
//     try {
//       const payload = Array.isArray(activitiesData) ? activitiesData : [activitiesData];
//       console.log('Creating bulk activities with payload:', payload);
//       const response = await api.post('/activity/', payload);
//       return response.data;
//     } catch (error) {
//       console.error('Error creating bulk activities:', error);
//       if (error.response) {
//         console.error('Error response data:', error.response.data);
//         console.error('Error response status:', error.response.status);
//       }
//       throw error;
//     }
//   },

//   // Update activity
//   updateActivity: async (activityId, activityData) => {
//     try {
//       const response = await api.put(`/activity/${activityId}/`, activityData);
//       return response.data;
//     } catch (error) {
//       console.error('Error updating activity:', error);
//       throw error;
//     }
//   },

//   // Delete activity
//   deleteActivity: async (activityId) => {
//     try {
//       const response = await api.delete(`/activity/${activityId}/`);
//       return response.data;
//     } catch (error) {
//       console.error('Error deleting activity:', error);
//       throw error;
//     }
//   },
// };
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

  // Create single activity
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

  // Create multiple activities in bulk
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

  // Update activity progress - USING PUT INSTEAD OF PATCH
  updateActivityProgress: async (activityId, progressData) => {
    try {
      console.log('Updating activity progress with PUT:', { activityId, progressData });
      // Use PUT for full update
      const response = await api.put(`/activity/${activityId}/`, progressData);
      return response.data;
    } catch (error) {
      console.error('Error updating activity progress:', error);
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