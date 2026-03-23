


// // src/features/tasks/taskSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../../services/api";
// import { showSuccess, showError } from "../../utils/toast";

// // Debounce utility for progress updates (kept for reference but not used in auto-update)
// const debounce = (func, delay) => {
//   let timeoutId;
//   return (...args) => {
//     clearTimeout(timeoutId);
//     timeoutId = setTimeout(() => func(...args), delay);
//   };
// };

// // Fetch user's picked tasks from subactivities
// export const fetchUserTasks = createAsyncThunk(
//   'tasks/fetchUserTasks',
//   async (empCode, { rejectWithValue }) => {
//     try {
//       const response = await api.get('/subactivity/');
//       const allSubActivities = response.data;
      
//       const userTasks = allSubActivities.filter(sub => {
//         const picks = sub.picked_at || [];
//         return picks.some(pick => pick.emp_code === empCode);
//       }).map(sub => {
//         const userPick = (sub.picked_at || []).find(pick => pick.emp_code === empCode);
//         const activity = sub.activity_detail || {};
//         const project = activity.project_detail || {};
        
//         return {
//           id: sub.id,
//           subactivity_name: sub.subactivity_name,
//           activity_name: activity.activity_name,
//           activity_id: activity.id,
//           project_name: project.project_name,
//           project_code: project.project_code,
//           project_id: project.id,
//           unit: sub.unit,
//           total_quantity: sub.total_quantity,
//           completed_quantity: userPick?.completed_quantity || sub.completed_quantity || 0,
//           progress: userPick?.progress || sub.progress || 0,
//           status: userPick?.status || 'PENDING',
//           picked_at: userPick?.picked_at,
//           started_at: userPick?.started_at,
//           completed_at: userPick?.completed_at,
//           total_time_spent: userPick?.total_time_spent || 0,
//           end_date: sub.end_date,
//           start_date: sub.start_date,
//           is_completed: sub.is_completed || false,
//           work_logs: userPick?.work_logs || []
//         };
//       });
      
//       return userTasks;
//     } catch (error) {
//       console.error('Error fetching user tasks:', error);
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// // Pick a task
// export const pickTask = createAsyncThunk(
//   'tasks/pickTask',
//   async ({ subActivityId, empCode, empName }, { rejectWithValue }) => {
//     try {
//       const allResponse = await api.get('/subactivity/');
//       const subActivity = allResponse.data.find(s => s.id === subActivityId);
      
//       if (!subActivity) throw new Error('Sub-activity not found');
      
//       const currentPicks = subActivity.picked_at || [];
//       const alreadyPickedByOther = currentPicks.some(pick => pick.emp_code !== empCode);
//       if (alreadyPickedByOther) throw new Error('This task is already picked by another user');
      
//       const alreadyPicked = currentPicks.some(pick => pick.emp_code === empCode);
//       if (alreadyPicked) throw new Error('You have already picked this task');
      
//       const newPick = {
//         emp_code: empCode,
//         emp_name: empName,
//         picked_at: new Date().toISOString(),
//         status: 'PENDING',
//         completed_quantity: 0,
//         progress: 0,
//         total_time_spent: 0,
//         work_logs: []
//       };
      
//       const updatedPicks = [...currentPicks, newPick];
//       const updateData = { ...subActivity, picked_at: updatedPicks };
      
//       const response = await api.put(`/subactivity/${subActivityId}/`, updateData);
//       showSuccess('Task picked successfully!');
//       return response.data;
//     } catch (error) {
//       showError(error.message || 'Failed to pick task');
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // Save daily work log (simple start/end time)
// export const saveDailyWorkLog = createAsyncThunk(
//   'tasks/saveDailyWorkLog',
//   async ({ subActivityId, empCode, date, startTime, endTime, note, status }, { rejectWithValue }) => {
//     try {
//       // Get current subactivity
//       const allResponse = await api.get('/subactivity/');
//       const subActivity = allResponse.data.find(s => s.id === subActivityId);
//       if (!subActivity) throw new Error('Sub-activity not found');
      
//       const currentPicks = subActivity.picked_at || [];
//       const userPick = currentPicks.find(pick => pick.emp_code === empCode);
//       if (!userPick) throw new Error('Task not found for this user');
      
//       // Calculate hours worked only if status is WORKED
//       let hoursWorked = 0;
//       let workLogEntry = {};
      
//       if (status === 'WORKED') {
//         // Validate times
//         if (!startTime || !endTime) {
//           throw new Error('Please enter both start and end time');
//         }
        
//         const start = new Date(`${date}T${startTime}`);
//         const end = new Date(`${date}T${endTime}`);
        
//         if (start >= end) {
//           throw new Error('End time must be after start time');
//         }
        
//         hoursWorked = (end - start) / (1000 * 60 * 60);
        
//         workLogEntry = {
//           date: date,
//           start_time: `${date}T${startTime}`,
//           end_time: `${date}T${endTime}`,
//           hours_worked: parseFloat(hoursWorked.toFixed(2)),
//           note: note || '',
//           status: 'WORKED'
//         };
//       } else {
//         // NOT_WORKED status
//         if (!note || !note.trim()) {
//           throw new Error('Please provide a reason for not working');
//         }
        
//         workLogEntry = {
//           date: date,
//           note: note.trim(),
//           status: 'NOT_WORKED',
//           hours_worked: 0
//         };
//       }
      
//       // Add work log to user's record
//       const workLogs = [...(userPick.work_logs || []), workLogEntry];
//       const totalTimeSpent = (userPick.total_time_spent || 0) + hoursWorked;
      
//       // Calculate progress based on completed quantity (if any)
//       let newProgress = userPick.progress || 0;
//       let newCompletedQty = userPick.completed_quantity || 0;
      
//       // If user logged completed quantity, update progress
//       if (workLogEntry.completed_quantity) {
//         newCompletedQty += workLogEntry.completed_quantity;
//         const totalQty = subActivity.total_quantity || 0;
//         if (totalQty > 0) {
//           newProgress = Math.min(100, Math.round((newCompletedQty / totalQty) * 100));
//         }
//       }
      
//       // Update user's pick record
//       const updatedPicks = currentPicks.map(pick => {
//         if (pick.emp_code === empCode) {
//           return {
//             ...pick,
//             total_time_spent: totalTimeSpent,
//             work_logs: workLogs,
//             completed_quantity: newCompletedQty,
//             progress: newProgress,
//             status: newProgress === 100 ? 'COMPLETED' : (newProgress > 0 ? 'IN_PROGRESS' : 'PENDING')
//           };
//         }
//         return pick;
//       });
      
//       // Update subactivity
//       const updateData = {
//         ...subActivity,
//         picked_at: updatedPicks
//       };
      
//       const response = await api.put(`/subactivity/${subActivityId}/`, updateData);
      
//       // Optional: Save to ActivityTimeLog if endpoint exists (don't block main flow)
//       try {
//         if (status === 'WORKED') {
//           const timeLogData = {
//             subactivity: subActivityId,
//             user: empCode,
//             entry_type: 'WORK_LOG',
//             status: 'IN_PROGRESS',
//             start_time: `${date}T${startTime}`,
//             end_time: `${date}T${endTime}`,
//             duration: hoursWorked * 3600,
//             note: note || `Worked on ${subActivity.subactivity_name} for ${hoursWorked.toFixed(2)} hours`
//           };
//           await api.post('/activity-timelog/', timeLogData);
//         } else {
//           const timeLogData = {
//             subactivity: subActivityId,
//             user: empCode,
//             entry_type: 'LEAVE',
//             status: 'ABSENT',
//             start_time: `${date}T00:00`,
//             end_time: `${date}T23:59`,
//             note: note || 'No work done'
//           };
//           await api.post('/activity-timelog/', timeLogData);
//         }
//       } catch (logError) {
//         console.warn('Time log save failed (non-critical):', logError.message);
//         // Don't throw - main update succeeded
//       }
      
//       showSuccess(status === 'WORKED' ? `Work logged! ${hoursWorked.toFixed(2)} hours recorded` : 'Leave record saved');
//       return response.data;
//     } catch (error) {
//       console.error('Error saving work log:', error);
//       showError(error.message || 'Failed to save record');
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // Update task progress only (without time tracking)
// export const updateTaskProgress = createAsyncThunk(
//   'tasks/updateTaskProgress',
//   async ({ subActivityId, empCode, completedQuantity }, { rejectWithValue }) => {
//     try {
//       const allResponse = await api.get('/subactivity/');
//       const subActivity = allResponse.data.find(s => s.id === subActivityId);
//       if (!subActivity) throw new Error('Sub-activity not found');
      
//       const totalQty = subActivity.total_quantity || 0;
//       let newProgress = totalQty > 0 ? Math.min(100, Math.round((completedQuantity / totalQty) * 100)) : 0;
      
//       const currentPicks = subActivity.picked_at || [];
//       const updatedPicks = currentPicks.map(pick => {
//         if (pick.emp_code === empCode) {
//           return {
//             ...pick,
//             completed_quantity: completedQuantity,
//             progress: newProgress,
//             status: newProgress === 100 ? 'COMPLETED' : (newProgress > 0 ? 'IN_PROGRESS' : 'PENDING')
//           };
//         }
//         return pick;
//       });
      
//       // Also update subactivity's overall progress
//       const updateData = {
//         ...subActivity,
//         picked_at: updatedPicks,
//         completed_quantity: completedQuantity,
//         progress: newProgress,
//         status: newProgress === 100 ? 'Complete' : (newProgress > 0 ? 'Inprogress' : 'Pending'),
//         is_completed: newProgress === 100
//       };
      
//       const response = await api.put(`/subactivity/${subActivityId}/`, updateData);
//       showSuccess('Progress updated successfully!');
//       return response.data;
//     } catch (error) {
//       console.error('Error updating progress:', error);
//       showError(error.message || 'Failed to update progress');
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const taskSlice = createSlice({
//   name: 'tasks',
//   initialState: {
//     userTasks: [],
//     loading: false,
//     updating: false,
//     error: null,
//     stats: {
//       total: 0,
//       inProgress: 0,
//       completed: 0,
//       pending: 0,
//       totalTimeSpent: 0
//     }
//   },
//   reducers: {
//     clearTaskError: (state) => {
//       state.error = null;
//     },
//     calculateStats: (state) => {
//       state.stats = {
//         total: state.userTasks.length,
//         inProgress: state.userTasks.filter(t => t.status === 'IN_PROGRESS').length,
//         completed: state.userTasks.filter(t => t.status === 'COMPLETED').length,
//         pending: state.userTasks.filter(t => t.status === 'PENDING').length,
//         totalTimeSpent: state.userTasks.reduce((sum, t) => sum + (t.total_time_spent || 0), 0)
//       };
//     },
//     updateTaskLocally: (state, action) => {
//       const { taskId, updates } = action.payload;
//       const index = state.userTasks.findIndex(t => t.id === taskId);
//       if (index !== -1) {
//         state.userTasks[index] = { ...state.userTasks[index], ...updates };
//       }
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch user tasks
//       .addCase(fetchUserTasks.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserTasks.fulfilled, (state, action) => {
//         state.loading = false;
//         state.userTasks = action.payload || [];
//         state.stats = {
//           total: state.userTasks.length,
//           inProgress: state.userTasks.filter(t => t.status === 'IN_PROGRESS').length,
//           completed: state.userTasks.filter(t => t.status === 'COMPLETED').length,
//           pending: state.userTasks.filter(t => t.status === 'PENDING').length,
//           totalTimeSpent: state.userTasks.reduce((sum, t) => sum + (t.total_time_spent || 0), 0)
//         };
//       })
//       .addCase(fetchUserTasks.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // Pick task
//       .addCase(pickTask.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(pickTask.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(pickTask.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // Save daily work log
//       .addCase(saveDailyWorkLog.pending, (state) => {
//         state.updating = true;
//       })
//       .addCase(saveDailyWorkLog.fulfilled, (state, action) => {
//         state.updating = false;
//         const index = state.userTasks.findIndex(t => t.id === action.payload?.id);
//         if (index !== -1) {
//           state.userTasks[index] = { ...state.userTasks[index], ...action.payload };
//           state.stats = {
//             total: state.userTasks.length,
//             inProgress: state.userTasks.filter(t => t.status === 'IN_PROGRESS').length,
//             completed: state.userTasks.filter(t => t.status === 'COMPLETED').length,
//             pending: state.userTasks.filter(t => t.status === 'PENDING').length,
//             totalTimeSpent: state.userTasks.reduce((sum, t) => sum + (t.total_time_spent || 0), 0)
//           };
//         }
//       })
//       .addCase(saveDailyWorkLog.rejected, (state, action) => {
//         state.updating = false;
//         state.error = action.payload;
//       })
      
//       // Update task progress
//       .addCase(updateTaskProgress.pending, (state) => {
//         state.updating = true;
//       })
//       .addCase(updateTaskProgress.fulfilled, (state, action) => {
//         state.updating = false;
//         const index = state.userTasks.findIndex(t => t.id === action.payload?.id);
//         if (index !== -1) {
//           state.userTasks[index] = { ...state.userTasks[index], ...action.payload };
//           state.stats = {
//             total: state.userTasks.length,
//             inProgress: state.userTasks.filter(t => t.status === 'IN_PROGRESS').length,
//             completed: state.userTasks.filter(t => t.status === 'COMPLETED').length,
//             pending: state.userTasks.filter(t => t.status === 'PENDING').length,
//             totalTimeSpent: state.userTasks.reduce((sum, t) => sum + (t.total_time_spent || 0), 0)
//           };
//         }
//       })
//       .addCase(updateTaskProgress.rejected, (state, action) => {
//         state.updating = false;
//         state.error = action.payload;
//       });
//   }
// });

// export const { clearTaskError, calculateStats, updateTaskLocally } = taskSlice.actions;
// export default taskSlice.reducer;


// src/features/tasks/taskSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { showSuccess, showError } from "../../utils/toast";

// Fetch user's picked tasks from subactivities
export const fetchUserTasks = createAsyncThunk(
  'tasks/fetchUserTasks',
  async (empCode, { rejectWithValue }) => {
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
          is_completed: sub.is_completed || false,
          work_logs: userPick?.work_logs || []
        };
      });
      
      return userTasks;
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Pick a task
export const pickTask = createAsyncThunk(
  'tasks/pickTask',
  async ({ subActivityId, empCode, empName }, { rejectWithValue }) => {
    try {
      const allResponse = await api.get('/subactivity/');
      const subActivity = allResponse.data.find(s => s.id === subActivityId);
      
      if (!subActivity) throw new Error('Sub-activity not found');
      
      const currentPicks = subActivity.picked_at || [];
      const alreadyPickedByOther = currentPicks.some(pick => pick.emp_code !== empCode);
      if (alreadyPickedByOther) throw new Error('This task is already picked by another user');
      
      const alreadyPicked = currentPicks.some(pick => pick.emp_code === empCode);
      if (alreadyPicked) throw new Error('You have already picked this task');
      
      const newPick = {
        emp_code: empCode,
        emp_name: empName,
        picked_at: new Date().toISOString(),
        status: 'PENDING',
        completed_quantity: 0,
        progress: 0,
        total_time_spent: 0,
        work_logs: []
      };
      
      const updatedPicks = [...currentPicks, newPick];
      const updateData = { ...subActivity, picked_at: updatedPicks };
      
      const response = await api.put(`/subactivity/${subActivityId}/`, updateData);
      showSuccess('Task picked successfully!');
      return response.data;
    } catch (error) {
      showError(error.message || 'Failed to pick task');
      return rejectWithValue(error.message);
    }
  }
);

// Save daily work log (simple start/end time)
export const saveDailyWorkLog = createAsyncThunk(
  'tasks/saveDailyWorkLog',
  async ({ subActivityId, empCode, date, startTime, endTime, note, status }, { rejectWithValue }) => {
    try {
      // Get current subactivity
      const allResponse = await api.get('/subactivity/');
      const subActivity = allResponse.data.find(s => s.id === subActivityId);
      if (!subActivity) throw new Error('Sub-activity not found');
      
      const currentPicks = subActivity.picked_at || [];
      const userPick = currentPicks.find(pick => pick.emp_code === empCode);
      if (!userPick) throw new Error('Task not found for this user');
      
      // Calculate hours worked only if status is WORKED
      let hoursWorked = 0;
      let workLogEntry = {};
      
      if (status === 'WORKED') {
        // Validate times
        if (!startTime || !endTime) {
          throw new Error('Please enter both start and end time');
        }
        
        const start = new Date(`${date}T${startTime}`);
        const end = new Date(`${date}T${endTime}`);
        
        if (start >= end) {
          throw new Error('End time must be after start time');
        }
        
        hoursWorked = (end - start) / (1000 * 60 * 60);
        
        workLogEntry = {
          date: date,
          start_time: `${date}T${startTime}`,
          end_time: `${date}T${endTime}`,
          hours_worked: parseFloat(hoursWorked.toFixed(2)),
          note: note || '',
          status: 'WORKED',
          completed_quantity: 0
        };
      } else {
        // NOT_WORKED status
        if (!note || !note.trim()) {
          throw new Error('Please provide a reason for not working');
        }
        
        workLogEntry = {
          date: date,
          note: note.trim(),
          status: 'NOT_WORKED',
          hours_worked: 0
        };
      }
      
      // Add work log to user's record
      const workLogs = [...(userPick.work_logs || []), workLogEntry];
      const totalTimeSpent = (userPick.total_time_spent || 0) + hoursWorked;
      
      // Update user's pick record
      const updatedPicks = currentPicks.map(pick => {
        if (pick.emp_code === empCode) {
          return {
            ...pick,
            total_time_spent: totalTimeSpent,
            work_logs: workLogs,
            status: pick.status === 'IN_PROGRESS' ? 'PENDING' : pick.status
          };
        }
        return pick;
      });
      
      // Update subactivity
      const updateData = {
        ...subActivity,
        picked_at: updatedPicks
      };
      
      const response = await api.put(`/subactivity/${subActivityId}/`, updateData);
      
      // Optional: Save to ActivityTimeLog if endpoint exists (don't block main flow)
      // Get project ID from subactivity
      const activity = subActivity.activity_detail || {};
      const project = activity.project_detail || {};
      const projectId = project.id;
      
      // Get user UUID - we need to fetch user details or store in localStorage
      const userUUID = localStorage.getItem('user_id') || sessionStorage.getItem('user_id');
      
      if (projectId && userUUID) {
        try {
          if (status === 'WORKED') {
            const timeLogData = {
              project: projectId,
              user: userUUID,
              subactivity: subActivityId,
              entry_type: 'WORK_LOG',
              status: 'IN_PROGRESS',
              start_time: `${date}T${startTime}`,
              end_time: `${date}T${endTime}`,
              duration: hoursWorked * 3600,
              note: note || `Worked on ${subActivity.subactivity_name} for ${hoursWorked.toFixed(2)} hours`
            };
            await api.post('/activity-timelog/', timeLogData);
          } else {
            const timeLogData = {
              project: projectId,
              user: userUUID,
              subactivity: subActivityId,
              entry_type: 'LEAVE',
              status: 'ABSENT',
              start_time: `${date}T00:00`,
              end_time: `${date}T23:59`,
              duration: 86400,
              note: note || 'No work done'
            };
            await api.post('/activity-timelog/', timeLogData);
          }
        } catch (logError) {
          console.warn('Time log save failed (non-critical):', logError.response?.data || logError.message);
          // Don't throw - main update succeeded
        }
      } else {
        console.warn('Missing projectId or userUUID for time log:', { projectId, userUUID });
      }
      
      showSuccess(status === 'WORKED' ? `Work logged! ${hoursWorked.toFixed(2)} hours recorded` : 'Leave record saved');
      return response.data;
    } catch (error) {
      console.error('Error saving work log:', error);
      showError(error.message || 'Failed to save record');
      return rejectWithValue(error.message);
    }
  }
);

// Update task progress only (without time tracking)
export const updateTaskProgress = createAsyncThunk(
  'tasks/updateTaskProgress',
  async ({ subActivityId, empCode, completedQuantity }, { rejectWithValue }) => {
    try {
      const allResponse = await api.get('/subactivity/');
      const subActivity = allResponse.data.find(s => s.id === subActivityId);
      if (!subActivity) throw new Error('Sub-activity not found');
      
      const totalQty = subActivity.total_quantity || 0;
      let newProgress = totalQty > 0 ? Math.min(100, Math.round((completedQuantity / totalQty) * 100)) : 0;
      
      const currentPicks = subActivity.picked_at || [];
      const updatedPicks = currentPicks.map(pick => {
        if (pick.emp_code === empCode) {
          return {
            ...pick,
            completed_quantity: completedQuantity,
            progress: newProgress,
            status: newProgress === 100 ? 'COMPLETED' : (newProgress > 0 ? 'IN_PROGRESS' : 'PENDING')
          };
        }
        return pick;
      });
      
      // Also update subactivity's overall progress
      const updateData = {
        ...subActivity,
        picked_at: updatedPicks,
        completed_quantity: completedQuantity,
        progress: newProgress,
        status: newProgress === 100 ? 'Complete' : (newProgress > 0 ? 'Inprogress' : 'Pending'),
        is_completed: newProgress === 100
      };
      
      const response = await api.put(`/subactivity/${subActivityId}/`, updateData);
      showSuccess('Progress updated successfully!');
      return response.data;
    } catch (error) {
      console.error('Error updating progress:', error);
      showError(error.message || 'Failed to update progress');
      return rejectWithValue(error.message);
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    userTasks: [],
    loading: false,
    updating: false,
    error: null,
    stats: {
      total: 0,
      inProgress: 0,
      completed: 0,
      pending: 0,
      totalTimeSpent: 0
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
        pending: state.userTasks.filter(t => t.status === 'PENDING').length,
        totalTimeSpent: state.userTasks.reduce((sum, t) => sum + (t.total_time_spent || 0), 0)
      };
    },
    updateTaskLocally: (state, action) => {
      const { taskId, updates } = action.payload;
      const index = state.userTasks.findIndex(t => t.id === taskId);
      if (index !== -1) {
        state.userTasks[index] = { ...state.userTasks[index], ...updates };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user tasks
      .addCase(fetchUserTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.userTasks = action.payload || [];
        state.stats = {
          total: state.userTasks.length,
          inProgress: state.userTasks.filter(t => t.status === 'IN_PROGRESS').length,
          completed: state.userTasks.filter(t => t.status === 'COMPLETED').length,
          pending: state.userTasks.filter(t => t.status === 'PENDING').length,
          totalTimeSpent: state.userTasks.reduce((sum, t) => sum + (t.total_time_spent || 0), 0)
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
      .addCase(pickTask.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(pickTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Save daily work log
      .addCase(saveDailyWorkLog.pending, (state) => {
        state.updating = true;
      })
      .addCase(saveDailyWorkLog.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.userTasks.findIndex(t => t.id === action.payload?.id);
        if (index !== -1) {
          state.userTasks[index] = { ...state.userTasks[index], ...action.payload };
          state.stats = {
            total: state.userTasks.length,
            inProgress: state.userTasks.filter(t => t.status === 'IN_PROGRESS').length,
            completed: state.userTasks.filter(t => t.status === 'COMPLETED').length,
            pending: state.userTasks.filter(t => t.status === 'PENDING').length,
            totalTimeSpent: state.userTasks.reduce((sum, t) => sum + (t.total_time_spent || 0), 0)
          };
        }
      })
      .addCase(saveDailyWorkLog.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      
      // Update task progress
      .addCase(updateTaskProgress.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateTaskProgress.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.userTasks.findIndex(t => t.id === action.payload?.id);
        if (index !== -1) {
          state.userTasks[index] = { ...state.userTasks[index], ...action.payload };
          state.stats = {
            total: state.userTasks.length,
            inProgress: state.userTasks.filter(t => t.status === 'IN_PROGRESS').length,
            completed: state.userTasks.filter(t => t.status === 'COMPLETED').length,
            pending: state.userTasks.filter(t => t.status === 'PENDING').length,
            totalTimeSpent: state.userTasks.reduce((sum, t) => sum + (t.total_time_spent || 0), 0)
          };
        }
      })
      .addCase(updateTaskProgress.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  }
});

export const { clearTaskError, calculateStats, updateTaskLocally } = taskSlice.actions;
export default taskSlice.reducer;