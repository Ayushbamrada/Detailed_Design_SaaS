// import api from './api';

// // Event type mapping between frontend display and backend enum
// const EVENT_TYPE_MAP = {
//   'Project Created': 'PROJECT_CREATED',
//   'Project Updated': 'PROJECT_UPDATED',
//   'Activity Created': 'ACTIVITY_CREATED',
//   'Activity Updated': 'ACTIVITY_UPDATED',
//   'SubActivity Created': 'SUBACTIVITY_CREATED',
//   'SubActivity Updated': 'SUBACTIVITY_UPDATED',
//   'Progress Changed': 'PROGRESS_CHANGED',
//   'Extension Requested': 'EXTENSION_REQUESTED',
//   'Extension Approved': 'EXTENSION_APPROVED',
//   'Extension Rejected': 'EXTENSION_REJECTED',
//   'MANUAL_LOG': 'MANUAL_LOG',
//   'STATUS_UPDATE': 'STATUS_UPDATE'
// };

// // Helper function to normalize API responses
// const normalizeResponse = (data, page, pageSize) => {
//   // If it's already paginated with results
//   if (data && data.results && Array.isArray(data.results)) {
//     return {
//       results: data.results,
//       count: data.count || data.results.length,
//       next: data.next,
//       previous: data.previous,
//       current_page: data.current_page || page,
//       total_pages: data.total_pages || Math.ceil((data.count || data.results.length) / pageSize)
//     };
//   }
  
//   // If it's a direct array
//   if (Array.isArray(data)) {
//     const total = data.length;
//     const start = (page - 1) * pageSize;
//     const end = start + pageSize;
//     const paginatedResults = data.slice(start, end);
    
//     return {
//       results: paginatedResults,
//       count: total,
//       next: end < total ? `?page=${page + 1}` : null,
//       previous: page > 1 ? `?page=${page - 1}` : null,
//       current_page: page,
//       total_pages: Math.ceil(total / pageSize)
//     };
//   }
  
//   // If it's some other format, wrap it
//   return {
//     results: Array.isArray(data) ? data : [data],
//     count: Array.isArray(data) ? data.length : 1,
//     next: null,
//     previous: null,
//     current_page: page,
//     total_pages: 1
//   };
// };

// export const logService = {
//   // Get all logs with pagination and filters
//   getAllLogs: async ({ page = 1, pageSize = 10, date, eventType, projectId, search } = {}) => {
//     try {
//       let url = `/alllogs/?page=${page}&page_size=${pageSize}`;
      
//       if (date) url += `&date=${date}`;
      
//       // Convert frontend event type to backend enum
//       if (eventType && eventType !== 'all') {
//         const backendEventType = EVENT_TYPE_MAP[eventType] || eventType;
//         url += `&event_type=${encodeURIComponent(backendEventType)}`;
//       }
      
//       if (projectId && projectId !== 'all') url += `&project=${projectId}`;
//       if (search) url += `&search=${encodeURIComponent(search)}`;
      
//       console.log('Fetching all logs with URL:', url);
//       const response = await api.get(url);
//       return normalizeResponse(response.data, page, pageSize);
//     } catch (error) {
//       console.error('Error fetching all logs:', error);
//       throw error;
//     }
//   },

//   // Get logs for a specific project
//   getProjectLogs: async (projectId, { page = 1, pageSize = 10, date, eventType, search } = {}) => {
//     try {
//       // Try path-based URL first (as per your API spec)
//       const dateParam = date || new Date().toISOString().split('T')[0];
      
//       // Convert frontend event type to backend enum for path
//       let eventTypeParam = 'all';
//       if (eventType && eventType !== 'all') {
//         eventTypeParam = EVENT_TYPE_MAP[eventType] || eventType;
//       }
      
//       let url = `/alllogs/${projectId}/${dateParam}/${eventTypeParam}/?page=${page}&page_size=${pageSize}`;
//       if (search) url += `&search=${encodeURIComponent(search)}`;
      
//       console.log('Fetching project logs with path URL:', url);
      
//       try {
//         const response = await api.get(url);
//         return normalizeResponse(response.data, page, pageSize);
//       } catch (pathError) {
//         // If path URL fails, try query params as fallback
//         console.log('Path URL failed, trying query params...');
//         let fallbackUrl = `/alllogs/?page=${page}&page_size=${pageSize}&project=${projectId}`;
        
//         if (date) fallbackUrl += `&date=${date}`;
//         if (eventType && eventType !== 'all') {
//           const backendEventType = EVENT_TYPE_MAP[eventType] || eventType;
//           fallbackUrl += `&event_type=${encodeURIComponent(backendEventType)}`;
//         }
//         if (search) fallbackUrl += `&search=${encodeURIComponent(search)}`;
        
//         console.log('Fetching project logs with fallback URL:', fallbackUrl);
//         const fallbackResponse = await api.get(fallbackUrl);
//         return normalizeResponse(fallbackResponse.data, page, pageSize);
//       }
//     } catch (error) {
//       console.error('Error fetching project logs:', error);
//       throw error;
//     }
//   },

//   // Get all logs without filters (for debugging)
//   getAllLogsUnfiltered: async ({ page = 1, pageSize = 50 } = {}) => {
//     try {
//       const url = `/alllogs/?page=${page}&page_size=${pageSize}`;
//       console.log('Fetching unfiltered logs with URL:', url);
//       const response = await api.get(url);
//       return normalizeResponse(response.data, page, pageSize);
//     } catch (error) {
//       console.error('Error fetching unfiltered logs:', error);
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
//       console.log('Deleting log with ID:', logId);
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
//         ? `/alllogs/?project=${projectId}&stats=true`
//         : '/alllogs/?stats=true';
      
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

// Event type mapping between frontend display and backend enum
const EVENT_TYPE_MAP = {
  'Project Created': 'PROJECT_CREATED',
  'Project Updated': 'PROJECT_UPDATED',
  'Activity Created': 'ACTIVITY_CREATED',
  'Activity Updated': 'ACTIVITY_UPDATED',
  'SubActivity Created': 'SUBACTIVITY_CREATED',
  'SubActivity Updated': 'SUBACTIVITY_UPDATED',
  'Progress Changed': 'PROGRESS_CHANGED',
  'Extension Requested': 'EXTENSION_REQUESTED',
  'Extension Approved': 'EXTENSION_APPROVED',
  'Extension Rejected': 'EXTENSION_REJECTED',
  'MANUAL_LOG': 'MANUAL_LOG',
  'STATUS_UPDATE': 'STATUS_UPDATE'
};

// Helper function to normalize API responses
const normalizeResponse = (data, page, pageSize) => {
  // If it's already paginated with results
  if (data && data.results && Array.isArray(data.results)) {
    return {
      results: data.results,
      count: data.count || data.results.length,
      next: data.next,
      previous: data.previous,
      current_page: data.current_page || page,
      total_pages: data.total_pages || Math.ceil((data.count || data.results.length) / pageSize)
    };
  }
  
  // If it's a direct array
  if (Array.isArray(data)) {
    const total = data.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedResults = data.slice(start, end);
    
    return {
      results: paginatedResults,
      count: total,
      next: end < total ? `?page=${page + 1}` : null,
      previous: page > 1 ? `?page=${page - 1}` : null,
      current_page: page,
      total_pages: Math.ceil(total / pageSize)
    };
  }
  
  // If it's some other format, wrap it
  return {
    results: Array.isArray(data) ? data : [data],
    count: Array.isArray(data) ? data.length : 1,
    next: null,
    previous: null,
    current_page: page,
    total_pages: 1
  };
};

export const logService = {
  // Get all logs with pagination and filters
  getAllLogs: async ({ page = 1, pageSize = 100, date, projectId, search } = {}) => {
    try {
      let url = `/alllogs/?page=${page}&page_size=${pageSize}`;
      
      if (date) url += `&date=${date}`;
      
      // Remove event_type from API call since it's not working
      // if (eventType && eventType !== 'all') {
      //   const backendEventType = EVENT_TYPE_MAP[eventType] || eventType;
      //   url += `&event_type=${encodeURIComponent(backendEventType)}`;
      // }
      
      if (projectId && projectId !== 'all') url += `&project=${projectId}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      
      console.log('Fetching all logs with URL:', url);
      const response = await api.get(url);
      return normalizeResponse(response.data, page, pageSize);
    } catch (error) {
      console.error('Error fetching all logs:', error);
      throw error;
    }
  },

  // Get logs for a specific project
  getProjectLogs: async (projectId, { page = 1, pageSize = 100, date, search } = {}) => {
    try {
      // Try path-based URL first
      const dateParam = date || new Date().toISOString().split('T')[0];
      
      let url = `/alllogs/${projectId}/${dateParam}/all/?page=${page}&page_size=${pageSize}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      
      console.log('Fetching project logs with path URL:', url);
      
      try {
        const response = await api.get(url);
        return normalizeResponse(response.data, page, pageSize);
      } catch (pathError) {
        // If path URL fails, try query params as fallback
        console.log('Path URL failed, trying query params...');
        let fallbackUrl = `/alllogs/?page=${page}&page_size=${pageSize}&project=${projectId}`;
        
        if (date) fallbackUrl += `&date=${date}`;
        if (search) fallbackUrl += `&search=${encodeURIComponent(search)}`;
        
        console.log('Fetching project logs with fallback URL:', fallbackUrl);
        const fallbackResponse = await api.get(fallbackUrl);
        return normalizeResponse(fallbackResponse.data, page, pageSize);
      }
    } catch (error) {
      console.error('Error fetching project logs:', error);
      throw error;
    }
  },

  // Get all logs without filters (for debugging)
  getAllLogsUnfiltered: async ({ page = 1, pageSize = 50 } = {}) => {
    try {
      const url = `/alllogs/?page=${page}&page_size=${pageSize}`;
      console.log('Fetching unfiltered logs with URL:', url);
      const response = await api.get(url);
      return normalizeResponse(response.data, page, pageSize);
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
      console.log('Deleting log with ID:', logId);
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