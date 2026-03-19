
// import api from './api';

// export const logService = {
//   // Get all logs with pagination and filters
//   getAllLogs: async ({ page = 1, pageSize = 20, date, eventType, projectId, search } = {}) => {
//     try {
//       let url = `/alllogs/?page=${page}&page_size=${pageSize}`;
      
//       if (date) url += `&date=${date}`;
//       if (eventType && eventType !== 'all') url += `&event_type=${eventType}`;
//       if (projectId && projectId !== 'all') url += `&project=${projectId}`;
//       if (search) url += `&search=${encodeURIComponent(search)}`;
      
//       console.log('Fetching all logs with URL:', url);
//       const response = await api.get(url);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching all logs:', error);
//       throw error;
//     }
//   },

//   // Get logs for a specific project - FIXED URL PATTERN
//   getProjectLogs: async (projectId, { page = 1, pageSize = 20, date, eventType, search } = {}) => {
//     try {
//       // Use the date parameter or default to today
//       const dateParam = date || new Date().toISOString().split('T')[0];
//       // Use the eventType parameter or default to 'all'
//       const eventTypeParam = (eventType && eventType !== 'all') ? eventType : 'all';
      
//       // Construct URL according to Django pattern: /alllogs/<project_id>/<date>/<event_type>/
//       let url = `/alllogs/${projectId}/${dateParam}/${eventTypeParam}/?page=${page}&page_size=${pageSize}`;
      
//       if (search) url += `&search=${encodeURIComponent(search)}`;
      
//       console.log('Fetching project logs with URL:', url);
//       const response = await api.get(url);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching project logs:', error);
//       throw error;
//     }
//   },

//   // Get logs by date range
//   getLogsByDateRange: async (projectId, startDate, endDate, { page = 1, pageSize = 20 } = {}) => {
//     try {
//       let url;
//       if (projectId) {
//         // For project-specific date range, we need to use the all logs endpoint with date parameters
//         url = `/alllogs/?project=${projectId}&start_date=${startDate}&end_date=${endDate}&page=${page}&page_size=${pageSize}`;
//       } else {
//         url = `/alllogs/?start_date=${startDate}&end_date=${endDate}&page=${page}&page_size=${pageSize}`;
//       }
      
//       console.log('Fetching logs by date range with URL:', url);
//       const response = await api.get(url);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching logs by date range:', error);
//       throw error;
//     }
//   },

//   // Create a new log
//   createLog: async (logData) => {
//     try {
//       console.log('Creating log with data:', logData);
//       const response = await api.post('/alllogs/', logData);
//       return response.data;
//     } catch (error) {
//       console.error('Error creating log:', error);
//       throw error;
//     }
//   },

//   // Delete a log
//   deleteLog: async (logId) => {
//     try {
//       const response = await api.delete(`/alllogs/${logId}/`);
//       return response.data;
//     } catch (error) {
//       console.error('Error deleting log:', error);
//       throw error;
//     }
//   },

//   // Get logs statistics
//   getLogStats: async (projectId) => {
//     try {
//       const url = projectId 
//         ? `/alllogs/${projectId}/stats/`
//         : '/alllogs/stats/';
      
//       console.log('Fetching log stats with URL:', url);
//       const response = await api.get(url);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching log stats:', error);
//       throw error;
//     }
//   }
// };

// src/services/logService.js
import api from './api';

export const logService = {
  // Get all logs with pagination and filters
  getAllLogs: async ({ page = 1, pageSize = 20, date, eventType, projectId, search } = {}) => {
    try {
      let url = `/alllogs/?page=${page}&page_size=${pageSize}`;
      
      if (date) url += `&date=${date}`;
      if (eventType && eventType !== 'all') url += `&event_type=${eventType}`;
      if (projectId && projectId !== 'all') url += `&project=${projectId}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      
      console.log('Fetching all logs with URL:', url);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching all logs:', error);
      throw error;
    }
  },

  // Get logs for a specific project
  getProjectLogs: async (projectId, { page = 1, pageSize = 20, date, eventType, search } = {}) => {
    try {
      // Build URL with project filter
      let url = `/alllogs/?page=${page}&page_size=${pageSize}&project=${projectId}`;
      
      if (date) url += `&date=${date}`;
      if (eventType && eventType !== 'all') url += `&event_type=${eventType}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      
      console.log('Fetching project logs with URL:', url);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching project logs:', error);
      throw error;
    }
  },

  // Get logs by the path-based URL (if needed)
  getProjectLogsByPath: async (projectId, { page = 1, pageSize = 20, date, eventType, search } = {}) => {
    try {
      const dateParam = date || new Date().toISOString().split('T')[0];
      const eventTypeParam = (eventType && eventType !== 'all') ? eventType : 'all';
      
      let url = `/alllogs/${projectId}/${dateParam}/${eventTypeParam}/?page=${page}&page_size=${pageSize}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      
      console.log('Fetching project logs by path with URL:', url);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching project logs by path:', error);
      throw error;
    }
  },

  // Get all logs without filters (for debugging)
  getAllLogsUnfiltered: async ({ page = 1, pageSize = 50 } = {}) => {
    try {
      const url = `/alllogs/?page=${page}&page_size=${pageSize}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching unfiltered logs:', error);
      throw error;
    }
  },

  // Create a new log
  createLog: async (logData) => {
    try {
      console.log('Creating log with data:', logData);
      const response = await api.post('/alllogs/', logData);
      return response.data;
    } catch (error) {
      console.error('Error creating log:', error);
      throw error;
    }
  },

  // Delete a log
  deleteLog: async (logId) => {
    try {
      const response = await api.delete(`/alllogs/${logId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting log:', error);
      throw error;
    }
  },

  // Get logs statistics
  getLogStats: async (projectId) => {
    try {
      const url = projectId 
        ? `/alllogs/?project=${projectId}&stats=true`
        : '/alllogs/?stats=true';
      
      console.log('Fetching log stats with URL:', url);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching log stats:', error);
      throw error;
    }
  }
};