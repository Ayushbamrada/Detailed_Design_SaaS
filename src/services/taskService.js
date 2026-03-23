// src/services/taskService.js
import api from './api';

class TaskService {
  // Get all picked tasks for a user
  async getUserTasks(empCode) {
    try {
      const url = empCode ? `/userpicked/?emp_code=${empCode}` : '/userpicked/';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      throw error;
    }
  }

  // Pick a task (add to user's tasks)
  async pickTask(taskData) {
    try {
      const response = await api.post('/userpicked/', taskData);
      return response.data;
    } catch (error) {
      console.error('Error picking task:', error);
      throw error;
    }
  }

  // Update task progress
  async updateTaskProgress(taskId, progressData) {
    try {
      const response = await api.patch(`/userpicked/${taskId}/`, progressData);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  // Start a task
  async startTask(taskId, empCode) {
    try {
      const response = await api.patch(`/userpicked/${taskId}/`, {
        status: 'IN_PROGRESS',
        started_at: new Date().toISOString(),
        emp_code: empCode
      });
      return response.data;
    } catch (error) {
      console.error('Error starting task:', error);
      throw error;
    }
  }

  // Complete a task
  async completeTask(taskId, empCode, completedQuantity) {
    try {
      const response = await api.patch(`/userpicked/${taskId}/`, {
        status: 'COMPLETED',
        completed_at: new Date().toISOString(),
        completed_quantity: completedQuantity,
        emp_code: empCode
      });
      return response.data;
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  }

  // Delete a picked task (if needed)
  async deleteTask(taskId) {
    try {
      const response = await api.delete(`/userpicked/${taskId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
}

export default new TaskService();