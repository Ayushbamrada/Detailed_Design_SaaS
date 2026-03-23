// src/features/tasks/taskSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { showSuccess, showError } from "../../utils/toast";

// Fetch user's picked tasks
export const fetchUserTasks = createAsyncThunk(
  'tasks/fetchUserTasks',
  async (empCode, { rejectWithValue }) => {
    try {
      const url = empCode ? `/userpicked/?emp_code=${empCode}` : '/userpicked/';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Pick a task
export const pickTask = createAsyncThunk(
  'tasks/pickTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await api.post('/userpicked/', taskData);
      showSuccess('Task picked successfully!');
      return response.data;
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to pick task');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Start a task
export const startTask = createAsyncThunk(
  'tasks/startTask',
  async ({ taskId, empCode }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/userpicked/${taskId}/`, {
        status: 'IN_PROGRESS',
        started_at: new Date().toISOString(),
        emp_code: empCode
      });
      showSuccess('Task started! Timer running...');
      return response.data;
    } catch (error) {
      showError('Failed to start task');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Stop/Complete a task
export const stopTask = createAsyncThunk(
  'tasks/stopTask',
  async ({ taskId, empCode, completedQuantity }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const task = state.tasks.userTasks.find(t => t.id === taskId);
      
      let totalTimeSpent = 0;
      if (task && task.started_at) {
        const startTime = new Date(task.started_at);
        const endTime = new Date();
        const diffMs = endTime - startTime;
        totalTimeSpent = diffMs / (1000 * 60 * 60); // Convert to hours
      }

      const response = await api.patch(`/userpicked/${taskId}/`, {
        status: 'COMPLETED',
        completed_at: new Date().toISOString(),
        completed_quantity: completedQuantity || task?.completed_quantity || 0,
        total_time_spent: totalTimeSpent,
        emp_code: empCode
      });
      showSuccess(`Task completed! Time spent: ${totalTimeSpent.toFixed(2)} hours`);
      return response.data;
    } catch (error) {
      showError('Failed to complete task');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update task progress
export const updateTaskProgress = createAsyncThunk(
  'tasks/updateTaskProgress',
  async ({ taskId, progressData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/userpicked/${taskId}/`, progressData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete a task
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      await api.delete(`/userpicked/${taskId}/`);
      showSuccess('Task removed from your list');
      return taskId;
    } catch (error) {
      showError('Failed to delete task');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    userTasks: [],
    loading: false,
    error: null,
    stats: {
      total: 0,
      inProgress: 0,
      completed: 0,
      pending: 0
    }
  },
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },
    calculateStats: (state) => {
      state.stats = {
        total: state.userTasks.length,
        inProgress: state.userTasks.filter(t => t.status === 'IN_PROGRESS').length,
        completed: state.userTasks.filter(t => t.status === 'COMPLETED').length,
        pending: state.userTasks.filter(t => t.status === 'PENDING').length
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchUserTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.userTasks = action.payload;
        // Calculate stats
        state.stats = {
          total: state.userTasks.length,
          inProgress: state.userTasks.filter(t => t.status === 'IN_PROGRESS').length,
          completed: state.userTasks.filter(t => t.status === 'COMPLETED').length,
          pending: state.userTasks.filter(t => t.status === 'PENDING').length
        };
      })
      .addCase(fetchUserTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Pick task
      .addCase(pickTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(pickTask.fulfilled, (state, action) => {
        state.loading = false;
        state.userTasks.push(action.payload);
        state.stats.total++;
        state.stats.pending++;
      })
      .addCase(pickTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Start task
      .addCase(startTask.fulfilled, (state, action) => {
        const index = state.userTasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.userTasks[index] = action.payload;
          state.stats.inProgress++;
          state.stats.pending--;
        }
      })
      
      // Stop/Complete task
      .addCase(stopTask.fulfilled, (state, action) => {
        const index = state.userTasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.userTasks[index] = action.payload;
          state.stats.inProgress--;
          state.stats.completed++;
        }
      })
      
      // Update progress
      .addCase(updateTaskProgress.fulfilled, (state, action) => {
        const index = state.userTasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.userTasks[index] = action.payload;
        }
      })
      
      // Delete task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.userTasks = state.userTasks.filter(t => t.id !== action.payload);
        // Recalculate stats
        state.stats = {
          total: state.userTasks.length,
          inProgress: state.userTasks.filter(t => t.status === 'IN_PROGRESS').length,
          completed: state.userTasks.filter(t => t.status === 'COMPLETED').length,
          pending: state.userTasks.filter(t => t.status === 'PENDING').length
        };
      });
  }
});

export const { clearTaskError, calculateStats } = taskSlice.actions;
export default taskSlice.reducer;