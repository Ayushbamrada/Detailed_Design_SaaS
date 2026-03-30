

// import api from './api';
// import { UNIT_MAPPING, REVERSE_UNIT_MAPPING } from '../utils/unitMapping';

// export const subActivityService = {
//   // Get all sub activities
//   getSubActivities: async () => {
//     try {
//       const response = await api.get('/subactivity/');
//       // Map backend unit values to frontend display values
//       const mappedData = Array.isArray(response.data) 
//         ? response.data.map(item => ({
//             ...item,
//             unit_display: REVERSE_UNIT_MAPPING[item.unit] || item.unit
//           }))
//         : response.data;
//       return mappedData;
//     } catch (error) {
//       console.error('Error fetching sub activities:', error);
//       throw error;
//     }
//   },

//   // Get single sub activity
//   getSubActivity: async (subactivityId) => {
//     try {
//       const response = await api.get(`/subactivity/${subactivityId}/`);
//       // Map backend unit to frontend display
//       return {
//         ...response.data,
//         unit_display: REVERSE_UNIT_MAPPING[response.data.unit] || response.data.unit
//       };
//     } catch (error) {
//       console.error('Error fetching sub activity:', error);
//       throw error;
//     }
//   },

//   // Create single sub activity
//   createSubActivity: async (subActivityData) => {
//     try {
//       // Map the unit to backend enum value
//       const mappedData = Array.isArray(subActivityData) 
//         ? subActivityData.map(item => ({
//             ...item,
//             unit: item.unit === 'status' ? 'Percentage' : (UNIT_MAPPING[item.unit] || item.unit)
//           }))
//         : {
//             ...subActivityData,
//             unit: subActivityData.unit === 'status' ? 'Percentage' : (UNIT_MAPPING[subActivityData.unit] || subActivityData.unit)
//           };
      
//       const payload = Array.isArray(mappedData) ? mappedData : [mappedData];
//       console.log('Creating sub-activity with mapped payload:', payload);
//       const response = await api.post('/subactivity/', payload);
//       return Array.isArray(response.data) ? response.data[0] : response.data;
//     } catch (error) {
//       console.error('Error creating sub activity:', error);
//       throw error;
//     }
//   },

//   // Create multiple sub-activities in bulk
//   createSubActivitiesBulk: async (subActivitiesData) => {
//     try {
//       // Map each sub-activity's unit to backend enum value
//       const mappedData = subActivitiesData.map(item => ({
//         ...item,
//         unit: item.unit === 'status' ? 'Percentage' : (UNIT_MAPPING[item.unit] || item.unit)
//       }));
      
//       const payload = Array.isArray(mappedData) ? mappedData : [mappedData];
//       console.log('Creating bulk sub-activities with mapped payload:', payload);
//       const response = await api.post('/subactivity/', payload);
      
//       // Map response units back to frontend display if needed
//       const mappedResponse = Array.isArray(response.data)
//         ? response.data.map(item => ({
//             ...item,
//             unit_display: REVERSE_UNIT_MAPPING[item.unit] || item.unit
//           }))
//         : {
//             ...response.data,
//             unit_display: REVERSE_UNIT_MAPPING[response.data.unit] || response.data.unit
//           };
      
//       return mappedResponse;
//     } catch (error) {
//       console.error('Error creating bulk sub activities:', error);
//       if (error.response) {
//         console.error('Error response data:', error.response.data);
//         console.error('Error response status:', error.response.status);
//       }
//       throw error;
//     }
//   },

//   // Update sub activity
//   updateSubActivity: async (subactivityId, subActivityData) => {
//     try {
//       // Map unit for update
//       const mappedData = {
//         ...subActivityData,
//         unit: subActivityData.unit === 'status' ? 'Percentage' : (UNIT_MAPPING[subActivityData.unit] || subActivityData.unit)
//       };
//       const response = await api.put(`/subactivity/${subactivityId}/`, mappedData);
//       return {
//         ...response.data,
//         unit_display: REVERSE_UNIT_MAPPING[response.data.unit] || response.data.unit
//       };
//     } catch (error) {
//       console.error('Error updating sub activity:', error);
//       throw error;
//     }
//   },

//   // Delete sub activity
//   deleteSubActivity: async (subactivityId) => {
//     try {
//       const response = await api.delete(`/subactivity/${subactivityId}/`);
//       return response.data;
//     } catch (error) {
//       console.error('Error deleting sub activity:', error);
//       throw error;
//     }
//   },
// };
import api from './api';

// Unit mapping from frontend display to backend enum values
const UNIT_MAPPING = {
  'Km': 'Kilometer',
  'Nos.': 'Numbers',
  'Percentage': 'Percentage',
  'status': 'Percentage' // Status-based items use Percentage unit with range='status'
};

// Reverse mapping for displaying units
export const REVERSE_UNIT_MAPPING = {
  'Kilometer': 'Km',
  'Numbers': 'Nos.',
  'Percentage': 'Percentage'
};

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

  // Create single sub activity
  createSubActivity: async (subActivityData) => {
    try {
      // Apply unit mapping to each item
      const mappedData = Array.isArray(subActivityData) 
        ? subActivityData.map(item => ({
            ...item,
            unit: UNIT_MAPPING[item.unit] || item.unit
          }))
        : {
            ...subActivityData,
            unit: UNIT_MAPPING[subActivityData.unit] || subActivityData.unit
          };
      
      const payload = Array.isArray(mappedData) ? mappedData : [mappedData];
      console.log('Creating sub-activity with mapped payload:', payload);
      const response = await api.post('/subactivity/', payload);
      return Array.isArray(response.data) ? response.data[0] : response.data;
    } catch (error) {
      console.error('Error creating sub activity:', error);
      throw error;
    }
  },

  // Create multiple sub-activities in bulk
  createSubActivitiesBulk: async (subActivitiesData) => {
    try {
      // IMPORTANT: Apply unit mapping to each item in the array
      const mappedData = subActivitiesData.map(item => ({
        ...item,
        unit: UNIT_MAPPING[item.unit] || item.unit
      }));
      
      const payload = Array.isArray(mappedData) ? mappedData : [mappedData];
      console.log('Creating bulk sub-activities with mapped payload:', JSON.stringify(payload, null, 2));
      const response = await api.post('/subactivity/', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating bulk sub activities:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      throw error;
    }
  },

  // Update sub-activity progress - USING PUT INSTEAD OF PATCH
  updateSubActivityProgress: async (subActivityId, progressData) => {
    try {
      console.log('Updating sub-activity progress with PUT:', { subActivityId, progressData });
      const response = await api.put(`/subactivity/${subActivityId}/`, progressData);
      return response.data;
    } catch (error) {
      console.error('Error updating sub-activity progress:', error);
      throw error;
    }
  },

  // Update sub-activity status - USING PUT INSTEAD OF PATCH
  updateSubActivityStatus: async (subActivityId, statusData) => {
    try {
      console.log('Updating sub-activity status with PUT:', { subActivityId, statusData });
      const response = await api.put(`/subactivity/${subActivityId}/`, statusData);
      return response.data;
    } catch (error) {
      console.error('Error updating sub-activity status:', error);
      throw error;
    }
  },

  // Update sub-activity completely
  updateSubActivity: async (subActivityId, subActivityData) => {
    try {
      const response = await api.put(`/subactivity/${subActivityId}/`, subActivityData);
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