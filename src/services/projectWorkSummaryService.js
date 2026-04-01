import api from './api';

export const projectWorkSummaryService = {
  // Get project work summary by project ID
  getProjectWorkSummary: async (projectId) => {
    try {
      const response = await api.get(`/project-work-summary/${projectId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project work summary:', error);
      throw error;
    }
  },
  
  // Get work summary for all projects (if needed)
  getAllProjectsWorkSummary: async () => {
    try {
      const response = await api.get('/project-work-summary/');
      return response.data;
    } catch (error) {
      console.error('Error fetching all projects work summary:', error);
      throw error;
    }
  },
  
  // Get work summary by date range
  getProjectWorkSummaryByDateRange: async (projectId, startDate, endDate) => {
    try {
      const response = await api.get(`/project-work-summary/${projectId}/`, {
        params: { start_date: startDate, end_date: endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching project work summary by date range:', error);
      throw error;
    }
  }
};