
import api from './api';

export const projectService = {
  
  getProjects: async () => {
    try {
      const response = await api.get('/project/');
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  
  getProject: async (projectId) => {
    try {
      const response = await api.get(`/project/${projectId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  },

  
  createProject: async (projectData) => {
    try {
      console.log('Creating project with data:', projectData);
      const response = await api.post('/project/', projectData);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        
        const enhancedError = new Error(
          error.response.data?.message || 
          JSON.stringify(error.response.data) || 
          'Failed to create project'
        );
        enhancedError.response = error.response;
        enhancedError.request = error.request;
        throw enhancedError;
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('No response from server. Please check your connection.');
      } else {
        console.error('Error setting up request:', error.message);
        throw error;
      }
    }
  },

  
  updateProjectProgress: async (projectId, progressData) => {
    try {
      console.log('Updating project progress with PUT:', { projectId, progressData });
      
      const response = await api.put(`/project/${projectId}/`, progressData);
      return response.data;
    } catch (error) {
      console.error('Error updating project progress:', error);
      throw error;
    }
  },

  
  updateProject: async (projectId, projectData) => {
    try {
      const response = await api.put(`/project/${projectId}/`, projectData);
      return response.data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },


  deleteProject: async (projectId) => {
    try {
      const response = await api.delete(`/project/${projectId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },
};