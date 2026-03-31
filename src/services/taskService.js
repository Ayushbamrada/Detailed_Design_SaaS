
import api from './api';

class TaskService {
  // Pick a task - Update subactivity's picked_at field
  async pickTask(subActivityId, empCode, empName) {
    try {
      // Fetch all subactivities to find the specific one (since GET detail not available)
      const allResponse = await api.get('/subactivity/');
      const subActivity = allResponse.data.find(s => s.id === subActivityId);
      
      if (!subActivity) {
        throw new Error('Sub-activity not found');
      }
      
      const currentPicks = subActivity.picked_at || [];
      
      // Check if already picked by someone else
      const isAlreadyPicked = currentPicks.length > 0 && 
        currentPicks.some(pick => pick.emp_code !== empCode);
      
      if (isAlreadyPicked) {
        const pickerName = currentPicks.find(pick => pick.emp_code !== empCode)?.emp_name;
        throw new Error(`This task is already picked by ${pickerName}`);
      }
      
      // Check if this user already picked it
      const alreadyPicked = currentPicks.some(pick => pick.emp_code === empCode);
      if (alreadyPicked) {
        throw new Error('You have already picked this task');
      }
      
      // Add new pick
      const newPick = {
        emp_code: empCode,
        emp_name: empName,
        picked_at: new Date().toISOString(),
        status: 'PENDING',
        completed_quantity: 0,
        progress: 0,
        total_time_spent: 0
      };
      
      const updatedPicks = [...currentPicks, newPick];
      
      // Update the subactivity with new picked_at
      const updateData = {
        ...subActivity,
        picked_at: updatedPicks
      };
      
      const response = await api.put(`/subactivity/${subActivityId}/`, updateData);
      
      return response.data;
    } catch (error) {
      console.error('Error picking task:', error);
      throw error;
    }
  }
  
  // Get user's picked tasks
  async getUserTasks(empCode) {
    try {
      const response = await api.get('/subactivity/');
      const allSubActivities = response.data;
      
      const userTasks = allSubActivities.filter(sub => {
        const picks = sub.picked_at || [];
        return picks.some(pick => pick.emp_code === empCode);
      }).map(sub => {
        const userPick = (sub.picked_at || []).find(pick => pick.emp_code === empCode);
        const activity = sub.activity_detail || {};
        const project = activity.project_detail || {};
        
        return {
          id: sub.id,
          subactivity_name: sub.subactivity_name,
          activity_name: activity.activity_name,
          activity_id: activity.id,
          project_name: project.project_name,
          project_code: project.project_code,
          project_id: project.id,
          unit: sub.unit,
          total_quantity: sub.total_quantity,
          completed_quantity: userPick?.completed_quantity || sub.completed_quantity || 0,
          progress: userPick?.progress || sub.progress || 0,
          status: userPick?.status || 'PENDING',
          picked_at: userPick?.picked_at,
          started_at: userPick?.started_at,
          completed_at: userPick?.completed_at,
          total_time_spent: userPick?.total_time_spent || 0,
          end_date: sub.end_date,
          start_date: sub.start_date,
          is_completed: sub.is_completed || false
        };
      });
      
      return userTasks;
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      throw error;
    }
  }
  
  // Start working on a task
  async startTask(subActivityId, empCode) {
    try {
      const allResponse = await api.get('/subactivity/');
      const subActivity = allResponse.data.find(s => s.id === subActivityId);
      
      if (!subActivity) {
        throw new Error('Sub-activity not found');
      }
      
      const currentPicks = subActivity.picked_at || [];
      
      const updatedPicks = currentPicks.map(pick => {
        if (pick.emp_code === empCode) {
          return {
            ...pick,
            started_at: new Date().toISOString(),
            status: 'IN_PROGRESS'
          };
        }
        return pick;
      });
      
      const updateData = {
        ...subActivity,
        picked_at: updatedPicks
      };
      
      const response = await api.put(`/subactivity/${subActivityId}/`, updateData);
      
      return response.data;
    } catch (error) {
      console.error('Error starting task:', error);
      throw error;
    }
  }
  
  // Complete a task - with time tracking
  async completeTask(subActivityId, empCode, completedQuantity) {
    try {
      const allResponse = await api.get('/subactivity/');
      const subActivity = allResponse.data.find(s => s.id === subActivityId);
      
      if (!subActivity) {
        throw new Error('Sub-activity not found');
      }
      
      const currentPicks = subActivity.picked_at || [];
      const userPick = currentPicks.find(pick => pick.emp_code === empCode);
      
      if (!userPick) {
        throw new Error('Task not found for this user');
      }
      
      // Calculate time spent
      let totalTimeSpent = userPick.total_time_spent || 0;
      if (userPick.started_at && !userPick.completed_at) {
        const startTime = new Date(userPick.started_at);
        const endTime = new Date();
        const diffMs = endTime - startTime;
        const hoursSpent = diffMs / (1000 * 60 * 60);
        totalTimeSpent += hoursSpent;
      }
      
      // Calculate new progress
      const totalQty = subActivity.total_quantity || 0;
      let newProgress = 0;
      let newCompletedQty = completedQuantity || subActivity.completed_quantity || 0;
      
      if (totalQty > 0) {
        newProgress = Math.round((newCompletedQty / totalQty) * 100);
      } else {
        newProgress = 100;
      }
      
      // Update user's pick record
      const updatedPicks = currentPicks.map(pick => {
        if (pick.emp_code === empCode) {
          return {
            ...pick,
            completed_at: new Date().toISOString(),
            completed_quantity: newCompletedQty,
            total_time_spent: totalTimeSpent,
            progress: newProgress,
            status: newProgress === 100 ? 'COMPLETED' : 'IN_PROGRESS'
          };
        }
        return pick;
      });
      
      // Update subactivity
      const updateData = {
        ...subActivity,
        picked_at: updatedPicks,
        completed_quantity: newCompletedQty,
        progress: newProgress,
        status: newProgress === 100 ? 'Complete' : (newProgress > 0 ? 'Inprogress' : 'Pending'),
        is_completed: newProgress === 100
      };
      
      const response = await api.put(`/subactivity/${subActivityId}/`, updateData);
      
      return response.data;
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  }
  
  // Update task progress
  async updateTaskProgress(subActivityId, empCode, completedQuantity) {
    try {
      const allResponse = await api.get('/subactivity/');
      const subActivity = allResponse.data.find(s => s.id === subActivityId);
      
      if (!subActivity) {
        throw new Error('Sub-activity not found');
      }
      
      const totalQty = subActivity.total_quantity || 0;
      let newProgress = totalQty > 0 ? Math.round((completedQuantity / totalQty) * 100) : 0;
      
      const currentPicks = subActivity.picked_at || [];
      const updatedPicks = currentPicks.map(pick => {
        if (pick.emp_code === empCode) {
          return {
            ...pick,
            completed_quantity: completedQuantity,
            progress: newProgress,
            status: newProgress === 100 ? 'COMPLETED' : 'IN_PROGRESS'
          };
        }
        return pick;
      });
      
      const updateData = {
        ...subActivity,
        picked_at: updatedPicks,
        completed_quantity: completedQuantity,
        progress: newProgress,
        status: newProgress === 100 ? 'Complete' : (newProgress > 0 ? 'Inprogress' : 'Pending')
      };
      
      const response = await api.put(`/subactivity/${subActivityId}/`, updateData);
      
      return response.data;
    } catch (error) {
      console.error('Error updating task progress:', error);
      throw error;
    }
  }
  
  // Get picked users for a subactivity (for admin view)
  async getPickedUsers(subActivityId) {
    try {
      const allResponse = await api.get('/subactivity/');
      const subActivity = allResponse.data.find(s => s.id === subActivityId);
      
      return subActivity?.picked_at || [];
    } catch (error) {
      console.error('Error fetching picked users:', error);
      return [];
    }
  }
}

export default new TaskService();