
import api from './api';


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

export const logService = {
  
  getAllLogs: async () => {
    try {
      const url = `/alllogs/`;
      console.log('Fetching all logs with URL:', url);
      const response = await api.get(url);
      
      
      const data = response.data;
      
      return {
        results: Array.isArray(data) ? data : (data.results || []),
        count: Array.isArray(data) ? data.length : (data.count || 0),
        next: null,
        previous: null
      };
    } catch (error) {
      console.error('Error fetching all logs:', error);
      return {
        results: [],
        count: 0,
        next: null,
        previous: null
      };
    }
  },


  getProjectLogs: async (projectId, { date, eventType, search } = {}) => {
    try {
      
      const projectParam = projectId || 'all';
      const dateParam = date || 'all';
      const eventTypeParam = (eventType && eventType !== 'all') ? eventType : 'all';
      
      let url = `/alllogs/${projectParam}/${dateParam}/${eventTypeParam}/`;
      
      
      if (search) {
        url += `?search=${encodeURIComponent(search)}`;
      }
      
      console.log('Fetching project logs with URL:', url);
      const response = await api.get(url);
      
      
      const data = response.data;
      
      return {
        results: Array.isArray(data) ? data : (data.results || []),
        count: Array.isArray(data) ? data.length : (data.count || 0),
        next: null,
        previous: null
      };
    } catch (error) {
      console.error('Error fetching project logs:', error);
      return {
        results: [],
        count: 0,
        next: null,
        previous: null
      };
    }
  },

  
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


  deleteLog: async (logId) => {
    try {
      console.log('Deleting log with ID:', logId);
      const response = await api.delete(`/alllogs/${logId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting log:', error);
      throw error;
    }
  }
};