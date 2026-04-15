
import api from './api';



export const projectService = {

  // getProjects: async () => {
  //   try {
  //     const response = await api.get('/project/');
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error fetching projects:', error);
  //     throw error;
  //   }
  // },

  getProjects: async (user) => {
    try {
      let url;
      let emp_code = sessionStorage.getItem('emp_code')
      // 🔥 Role-based API logic
      if (user?.role === 'TL') {
        url = `user-assigned-projects/${emp_code}/`;
      } else {
        // url = '/get-project/';
        url = '/project/';
      }

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  getProjectsWithDetails: async (user) => {
    try {
      let url;
      let emp_code = sessionStorage.getItem('emp_code')
      // 🔥 Role-based API logic
      if (user?.role === 'TL') {
        url = `user-assigned-projects/${emp_code}/`;
      } else {
        url = '/project/';
      }

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  getProjectDetails: async (user) => {
    try {
      const response = await api.get(`/get-projectdetails-byid/${projectId}/`);
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

  tlSubactivitySubmitwithProof: async (proofData) => {
    try {
      const formData = new FormData();
      proofData.documents.forEach((file) => {
        formData.append("files", file);
      });
      // formData.append("message", proofData.message);
      for (const key in proofData) {
        key !== "documents" &&
          formData.append(key, proofData[key]);
      }
      const response = await api.post(`/subactivity-submission/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting subactivity with proof:', error);
      throw error;
    }
  }
};