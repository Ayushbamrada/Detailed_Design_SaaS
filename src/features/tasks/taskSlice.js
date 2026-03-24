// // src/features/tasks/taskSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../../services/api";
// import { showSuccess, showError } from "../../utils/toast";

// // Build a map of activity_id -> project from projects data
// const buildActivityProjectMap = (projects) => {
//   const map = new Map();
  
//   projects.forEach(project => {
//     const projectId = project.id;
//     const projectName = project.project_name;
//     const projectCode = project.project_code;
    
//     // Check activities_detail array
//     if (project.activities_detail && Array.isArray(project.activities_detail)) {
//       project.activities_detail.forEach(activity => {
//         if (activity.id) {
//           map.set(activity.id, {
//             project_id: projectId,
//             project_name: projectName,
//             project_code: projectCode,
//             activity_name: activity.activity_name
//           });
//         }
//       });
//     }
    
//     // Also check activities array (IDs)
//     if (project.activities && Array.isArray(project.activities)) {
//       project.activities.forEach(activityId => {
//         if (!map.has(activityId)) {
//           map.set(activityId, {
//             project_id: projectId,
//             project_name: projectName,
//             project_code: projectCode
//           });
//         }
//       });
//     }
//   });
  
//   console.log(`Built activity-project map with ${map.size} entries`);
//   return map;
// };

// // Fetch user's picked tasks from subactivities
// export const fetchUserTasks = createAsyncThunk(
//   'tasks/fetchUserTasks',
//   async (empCode, { getState, rejectWithValue }) => {
//     try {
//       // Get current state
//       const state = getState();
//       const projects = state.api.projects || [];
//       const activities = state.api.activities || [];
      
//       console.log(`Processing with ${projects.length} projects, ${activities.length} activities`);
      
//       // Build activity to project map
//       const activityProjectMap = buildActivityProjectMap(projects);
      
//       // Fetch subactivities
//       const response = await api.get('/subactivity/');
//       const allSubActivities = response.data;
      
//       console.log(`Total subactivities: ${allSubActivities.length}`);
      
//       // Filter subactivities picked by this user
//       const userPickedSubs = allSubActivities.filter(sub => {
//         const picks = sub.picked_at || [];
//         return picks.some(pick => pick.emp_code === empCode);
//       });
      
//       console.log(`Found ${userPickedSubs.length} subactivities picked by user ${empCode}`);
      
//       // Process each subactivity
//       const userTasks = [];
      
//       for (const sub of userPickedSubs) {
//         const userPick = (sub.picked_at || []).find(pick => pick.emp_code === empCode);
//         const activityId = sub.activity;
        
//         // Get project info from our map
//         let projectInfo = activityProjectMap.get(activityId);
        
//         // If not found in map, try to find from activities array
//         if (!projectInfo) {
//           const activity = activities.find(a => a.id === activityId);
//           if (activity && activity.project) {
//             // If activity has project field, find that project
//             const project = projects.find(p => p.id === activity.project);
//             if (project) {
//               projectInfo = {
//                 project_id: project.id,
//                 project_name: project.project_name,
//                 project_code: project.project_code
//               };
//             }
//           }
//         }
        
//         // If still not found, log warning and use unknown
//         if (!projectInfo) {
//           console.warn(`Could not find project for activity ${activityId}`, {
//             subId: sub.id,
//             subName: sub.subactivity_name,
//             activityId: activityId
//           });
//         }
        
//         // Calculate progress
//         const totalQty = sub.total_quantity || 0;
//         const completedQty = userPick?.completed_quantity || sub.completed_quantity || 0;
//         const progress = totalQty > 0 ? Math.round((completedQty / totalQty) * 100) : (sub.progress || 0);
        
//         // Get activity name
//         let activityName = 'Unknown Activity';
//         const activity = activities.find(a => a.id === activityId);
//         if (activity) {
//           activityName = activity.activity_name;
//         } else if (sub.activity_detail) {
//           activityName = sub.activity_detail.activity_name;
//         }
        
//         userTasks.push({
//           id: sub.id,
//           subactivity_id: sub.id,
//           subactivity_name: sub.subactivity_name,
//           activity_name: activityName,
//           activity_id: activityId,
//           // Project details - from our map
//           project_id: projectInfo?.project_id || 'unknown',
//           project_name: projectInfo?.project_name || 'Unknown Project',
//           project_code: projectInfo?.project_code || 'N/A',
//           // Task details
//           unit: sub.unit,
//           unit_display: sub.unit === 'Kilometer' ? 'Km' : 
//                        sub.unit === 'Numbers' ? 'Nos.' : 
//                        sub.unit === 'Percentage' ? '%' : 'status',
//           total_quantity: totalQty,
//           completed_quantity: completedQty,
//           progress: progress,
//           status: userPick?.status || (progress === 100 ? 'COMPLETED' : progress > 0 ? 'IN_PROGRESS' : 'PENDING'),
//           // Timestamps
//           picked_at: userPick?.picked_at,
//           started_at: userPick?.started_at,
//           completed_at: userPick?.completed_at,
//           total_time_spent: userPick?.total_time_spent || 0,
//           // Dates
//           end_date: sub.end_date,
//           start_date: sub.start_date,
//           is_completed: sub.is_completed || progress === 100,
//           // Work logs
//           work_logs: userPick?.work_logs || []
//         });
//       }
      
//       // Log the results
//       const groupedByProject = userTasks.reduce((acc, task) => {
//         const projectKey = task.project_id;
//         if (!acc[projectKey]) {
//           acc[projectKey] = [];
//         }
//         acc[projectKey].push(task);
//         return acc;
//       }, {});
      
//       console.log('Processed user tasks grouped by project:', 
//         Object.keys(groupedByProject).map(key => ({
//           project: groupedByProject[key][0]?.project_name,
//           count: groupedByProject[key].length
//         }))
//       );
      
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
//   async ({ subActivityId, empCode, empName }, { getState, rejectWithValue }) => {
//     try {
//       const state = getState();
//       const projects = state.api.projects || [];
//       const activities = state.api.activities || [];
      
//       // Build activity to project map
//       const activityProjectMap = buildActivityProjectMap(projects);
      
//       // Get the subactivity
//       const subResponse = await api.get(`/subactivity/${subActivityId}/`);
//       const subActivity = subResponse.data;
      
//       if (!subActivity) throw new Error('Sub-activity not found');
      
//       const activityId = subActivity.activity;
      
//       // Get project info from map
//       let projectInfo = activityProjectMap.get(activityId);
      
//       // If not found, try to find from activities
//       if (!projectInfo) {
//         const activity = activities.find(a => a.id === activityId);
//         if (activity && activity.project) {
//           const project = projects.find(p => p.id === activity.project);
//           if (project) {
//             projectInfo = {
//               project_id: project.id,
//               project_name: project.project_name,
//               project_code: project.project_code
//             };
//           }
//         }
//       }
      
//       // Get activity name
//       let activityName = 'Unknown Activity';
//       const activity = activities.find(a => a.id === activityId);
//       if (activity) {
//         activityName = activity.activity_name;
//       } else if (subActivity.activity_detail) {
//         activityName = subActivity.activity_detail.activity_name;
//       }
      
//       const currentPicks = subActivity.picked_at || [];
      
//       // Check if already picked by someone else
//       const alreadyPickedByOther = currentPicks.some(pick => pick.emp_code !== empCode);
//       if (alreadyPickedByOther) {
//         const pickerName = currentPicks.find(pick => pick.emp_code !== empCode)?.emp_name;
//         throw new Error(`This task is already picked by ${pickerName}`);
//       }
      
//       // Check if this user already picked it
//       const alreadyPicked = currentPicks.some(pick => pick.emp_code === empCode);
//       if (alreadyPicked) {
//         throw new Error('You have already picked this task');
//       }
      
//       // Create new pick record
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
      
//       // Update the subactivity
//       const updateData = {
//         ...subActivity,
//         picked_at: updatedPicks
//       };
      
//       const response = await api.put(`/subactivity/${subActivityId}/`, updateData);
      
//       const taskName = subActivity.subactivity_name;
//       const projectName = projectInfo?.project_name || 'Unknown Project';
      
//       showSuccess(`Task "${taskName}" picked successfully from project "${projectName}"!`);
      
//       return {
//         ...response.data,
//         id: subActivityId,
//         subactivity_name: taskName,
//         activity_name: activityName,
//         activity_id: activityId,
//         project_id: projectInfo?.project_id || 'unknown',
//         project_name: projectName,
//         project_code: projectInfo?.project_code || 'N/A',
//         unit: subActivity.unit,
//         total_quantity: subActivity.total_quantity || 0,
//         completed_quantity: 0,
//         progress: 0,
//         status: 'PENDING',
//         picked_at: newPick.picked_at,
//         end_date: subActivity.end_date,
//         start_date: subActivity.start_date,
//         total_time_spent: 0,
//         work_logs: []
//       };
//     } catch (error) {
//       console.error('Error picking task:', error);
//       showError(error.message || 'Failed to pick task');
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // Save daily work log
// export const saveDailyWorkLog = createAsyncThunk(
//   'tasks/saveDailyWorkLog',
//   async ({ subActivityId, empCode, date, startTime, endTime, note, status }, { getState, rejectWithValue }) => {
//     try {
//       const state = getState();
//       const existingTask = state.tasks.userTasks.find(t => t.id === subActivityId);
      
//       const subResponse = await api.get(`/subactivity/${subActivityId}/`);
//       const subActivity = subResponse.data;
//       if (!subActivity) throw new Error('Sub-activity not found');
      
//       const currentPicks = subActivity.picked_at || [];
//       const userPick = currentPicks.find(pick => pick.emp_code === empCode);
//       if (!userPick) throw new Error('Task not found for this user');
      
//       let hoursWorked = 0;
//       let workLogEntry = {};
      
//       if (status === 'WORKED') {
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
//           status: 'WORKED',
//           completed_quantity: 0
//         };
//       } else {
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
      
//       const workLogs = [...(userPick.work_logs || []), workLogEntry];
//       const totalTimeSpent = (userPick.total_time_spent || 0) + hoursWorked;
      
//       const updatedPicks = currentPicks.map(pick => {
//         if (pick.emp_code === empCode) {
//           return {
//             ...pick,
//             total_time_spent: totalTimeSpent,
//             work_logs: workLogs,
//             status: pick.status === 'IN_PROGRESS' ? 'PENDING' : pick.status
//           };
//         }
//         return pick;
//       });
      
//       const updateData = {
//         ...subActivity,
//         picked_at: updatedPicks
//       };
      
//       const response = await api.put(`/subactivity/${subActivityId}/`, updateData);
      
//       showSuccess(status === 'WORKED' ? `Work logged! ${hoursWorked.toFixed(2)} hours recorded` : 'Leave record saved');
      
//       return {
//         ...response.data,
//         id: subActivityId,
//         project_name: existingTask?.project_name,
//         project_code: existingTask?.project_code,
//         project_id: existingTask?.project_id,
//         activity_name: existingTask?.activity_name,
//         subactivity_name: existingTask?.subactivity_name,
//         total_time_spent: totalTimeSpent,
//         work_logs: workLogs
//       };
//     } catch (error) {
//       console.error('Error saving work log:', error);
//       showError(error.message || 'Failed to save record');
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // Update task progress
// export const updateTaskProgress = createAsyncThunk(
//   'tasks/updateTaskProgress',
//   async ({ subActivityId, empCode, completedQuantity }, { getState, rejectWithValue }) => {
//     try {
//       const state = getState();
//       const existingTask = state.tasks.userTasks.find(t => t.id === subActivityId);
      
//       const subResponse = await api.get(`/subactivity/${subActivityId}/`);
//       const subActivity = subResponse.data;
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
//             status: newProgress === 100 ? 'COMPLETED' : (newProgress > 0 ? 'IN_PROGRESS' : 'PENDING'),
//             completed_at: newProgress === 100 ? new Date().toISOString() : pick.completed_at
//           };
//         }
//         return pick;
//       });
      
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
      
//       return {
//         ...response.data,
//         id: subActivityId,
//         project_name: existingTask?.project_name,
//         project_code: existingTask?.project_code,
//         project_id: existingTask?.project_id,
//         activity_name: existingTask?.activity_name,
//         subactivity_name: existingTask?.subactivity_name,
//         completed_quantity: completedQuantity,
//         progress: newProgress,
//         status: newProgress === 100 ? 'COMPLETED' : (newProgress > 0 ? 'IN_PROGRESS' : 'PENDING')
//       };
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
//         inProgress: state.userTasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'ONGOING').length,
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
//         state.stats = {
//           total: state.userTasks.length,
//           inProgress: state.userTasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'ONGOING').length,
//           completed: state.userTasks.filter(t => t.status === 'COMPLETED').length,
//           pending: state.userTasks.filter(t => t.status === 'PENDING').length,
//           totalTimeSpent: state.userTasks.reduce((sum, t) => sum + (t.total_time_spent || 0), 0)
//         };
//       }
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUserTasks.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserTasks.fulfilled, (state, action) => {
//         state.loading = false;
//         state.userTasks = action.payload || [];
//         state.stats = {
//           total: state.userTasks.length,
//           inProgress: state.userTasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'ONGOING').length,
//           completed: state.userTasks.filter(t => t.status === 'COMPLETED').length,
//           pending: state.userTasks.filter(t => t.status === 'PENDING').length,
//           totalTimeSpent: state.userTasks.reduce((sum, t) => sum + (t.total_time_spent || 0), 0)
//         };
//       })
//       .addCase(fetchUserTasks.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       .addCase(pickTask.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(pickTask.fulfilled, (state, action) => {
//         state.loading = false;
//         const exists = state.userTasks.some(t => t.id === action.payload.id);
//         if (!exists) {
//           const newTask = {
//             id: action.payload.id,
//             subactivity_id: action.payload.id,
//             subactivity_name: action.payload.subactivity_name,
//             activity_name: action.payload.activity_name,
//             activity_id: action.payload.activity_id,
//             project_id: action.payload.project_id,
//             project_name: action.payload.project_name,
//             project_code: action.payload.project_code,
//             unit: action.payload.unit,
//             total_quantity: action.payload.total_quantity,
//             completed_quantity: 0,
//             progress: 0,
//             status: 'PENDING',
//             picked_at: action.payload.picked_at,
//             end_date: action.payload.end_date,
//             start_date: action.payload.start_date,
//             total_time_spent: 0,
//             work_logs: []
//           };
//           state.userTasks.push(newTask);
//           state.stats = {
//             total: state.userTasks.length,
//             inProgress: state.userTasks.filter(t => t.status === 'IN_PROGRESS').length,
//             completed: state.userTasks.filter(t => t.status === 'COMPLETED').length,
//             pending: state.userTasks.filter(t => t.status === 'PENDING').length,
//             totalTimeSpent: state.userTasks.reduce((sum, t) => sum + (t.total_time_spent || 0), 0)
//           };
//         }
//       })
//       .addCase(pickTask.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       .addCase(saveDailyWorkLog.pending, (state) => {
//         state.updating = true;
//       })
//       .addCase(saveDailyWorkLog.fulfilled, (state, action) => {
//         state.updating = false;
//         const index = state.userTasks.findIndex(t => t.id === action.payload.id);
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
      
//       .addCase(updateTaskProgress.pending, (state) => {
//         state.updating = true;
//       })
//       .addCase(updateTaskProgress.fulfilled, (state, action) => {
//         state.updating = false;
//         const index = state.userTasks.findIndex(t => t.id === action.payload.id);
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

// Helper to get user UUID from storage or state
const getUserUUID = () => {
  return localStorage.getItem('user_uuid') || 
         sessionStorage.getItem('user_uuid') || 
         null;
};

// Helper to get employee code
const getEmpCode = () => {
  return localStorage.getItem('emp_code') || 
         sessionStorage.getItem('emp_code') || 
         null;
};

// Build a comprehensive map of activity_id -> project from both projects and activities data
const buildActivityProjectMap = (projects, activities) => {
  const map = new Map();
  
  console.log(`Building activity-project map with ${projects.length} projects and ${activities.length} activities`);
  
  // Method 1: From projects' activities_detail array (most reliable)
  projects.forEach(project => {
    const projectId = project.id;
    const projectName = project.project_name;
    const projectCode = project.project_code;
    
    // Check activities_detail array (full activity objects)
    if (project.activities_detail && Array.isArray(project.activities_detail)) {
      project.activities_detail.forEach(activity => {
        if (activity.id) {
          map.set(activity.id, {
            project_id: projectId,
            project_name: projectName,
            project_code: projectCode,
            activity_name: activity.activity_name
          });
          console.log(`Mapped activity ${activity.id} (${activity.activity_name}) -> project ${projectName}`);
        }
      });
    }
    
    // Check activities array (just IDs)
    if (project.activities && Array.isArray(project.activities)) {
      project.activities.forEach(activityId => {
        if (!map.has(activityId)) {
          map.set(activityId, {
            project_id: projectId,
            project_name: projectName,
            project_code: projectCode
          });
          console.log(`Mapped activity ID ${activityId} -> project ${projectName}`);
        }
      });
    }
  });
  
  // Method 2: If we still have unmapped activities, try to infer from activity's project field
  activities.forEach(activity => {
    if (activity.id && !map.has(activity.id)) {
      // If activity has a project field that's not null
      if (activity.project) {
        const project = projects.find(p => p.id === activity.project);
        if (project) {
          map.set(activity.id, {
            project_id: project.id,
            project_name: project.project_name,
            project_code: project.project_code,
            activity_name: activity.activity_name
          });
          console.log(`Inferred mapping for activity ${activity.id} -> project ${project.project_name}`);
        }
      }
    }
  });
  
  console.log(`Activity-project map built with ${map.size} entries`);
  return map;
};

// Fetch user's work logs from ActivityTimeLog API
export const fetchUserWorkLogs = createAsyncThunk(
  'tasks/fetchUserWorkLogs',
  async (_, { getState, rejectWithValue }) => {
    try {
      const userUUID = getUserUUID();
      if (!userUUID) {
        console.warn('No user UUID found');
        return [];
      }
      
      console.log(`Fetching work logs for user UUID: ${userUUID}`);
      
      // Fetch time logs for this user
      const response = await api.get(`/activity-timelog/?user=${userUUID}`);
      const logs = response.data.results || response.data;
      
      // Transform logs to a consistent format
      const transformedLogs = logs.map(log => ({
        id: log.id,
        project_id: log.project,
        project_name: log.project_detail?.project_name || 'Unknown Project',
        project_code: log.project_detail?.project_code || 'N/A',
        activity_id: log.activity,
        activity_name: log.activity_detail?.activity_name || 'Unknown Activity',
        subactivity_id: log.subactivity,
        subactivity_name: log.subactivity_detail?.subactivity_name || 'Unknown Task',
        entry_type: log.entry_type,
        status: log.status,
        start_time: log.start_time,
        end_time: log.end_time,
        duration: log.duration,
        note: log.note,
        created_at: log.created_at,
        date: log.start_time?.split('T')[0] || new Date().toISOString().split('T')[0]
      }));
      
      console.log(`Fetched ${transformedLogs.length} work logs`);
      return transformedLogs;
    } catch (error) {
      console.error('Error fetching user work logs:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch user's picked tasks from subactivities
export const fetchUserTasks = createAsyncThunk(
  'tasks/fetchUserTasks',
  async (empCode, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const projects = state.api.projects || [];
      const activities = state.api.activities || [];
      
      console.log(`Fetching tasks for employee: ${empCode}`);
      console.log(`Projects available: ${projects.length}`);
      console.log(`Activities available: ${activities.length}`);
      
      const activityProjectMap = buildActivityProjectMap(projects, activities);
      
      const response = await api.get('/subactivity/');
      const allSubActivities = response.data;
      
      const userPickedSubs = allSubActivities.filter(sub => {
        const picks = sub.picked_at || [];
        return picks.some(pick => pick.emp_code === empCode);
      });
      
      console.log(`Found ${userPickedSubs.length} subactivities picked by user ${empCode}`);
      
      const userTasks = [];
      
      for (const sub of userPickedSubs) {
        const userPick = (sub.picked_at || []).find(pick => pick.emp_code === empCode);
        const activityId = sub.activity;
        
        // Get project info from our map
        let projectInfo = activityProjectMap.get(activityId);
        
        // If still not found, try to find by activity name in projects
        if (!projectInfo && sub.activity_detail) {
          const activityName = sub.activity_detail.activity_name;
          // Search through projects for this activity name
          for (const project of projects) {
            if (project.activities_detail) {
              const foundActivity = project.activities_detail.find(a => a.activity_name === activityName);
              if (foundActivity && foundActivity.id === activityId) {
                projectInfo = {
                  project_id: project.id,
                  project_name: project.project_name,
                  project_code: project.project_code
                };
                console.log(`Found project by activity name match: ${project.project_name} for ${activityName}`);
                break;
              }
            }
          }
        }
        
        // Get activity name
        let activityName = 'Unknown Activity';
        const activity = activities.find(a => a.id === activityId);
        if (activity) {
          activityName = activity.activity_name;
        } else if (sub.activity_detail) {
          activityName = sub.activity_detail.activity_name;
        }
        
        const totalQty = sub.total_quantity || 0;
        const completedQty = userPick?.completed_quantity || sub.completed_quantity || 0;
        const progress = totalQty > 0 ? Math.round((completedQty / totalQty) * 100) : (sub.progress || 0);
        
        userTasks.push({
          id: sub.id,
          subactivity_id: sub.id,
          subactivity_name: sub.subactivity_name,
          activity_name: activityName,
          activity_id: activityId,
          project_id: projectInfo?.project_id || 'unknown',
          project_name: projectInfo?.project_name || 'Unknown Project',
          project_code: projectInfo?.project_code || 'N/A',
          unit: sub.unit,
          unit_display: sub.unit === 'Kilometer' ? 'Km' : 
                       sub.unit === 'Numbers' ? 'Nos.' : 
                       sub.unit === 'Percentage' ? '%' : 'status',
          total_quantity: totalQty,
          completed_quantity: completedQty,
          progress: progress,
          status: userPick?.status || (progress === 100 ? 'COMPLETED' : progress > 0 ? 'IN_PROGRESS' : 'PENDING'),
          picked_at: userPick?.picked_at,
          started_at: userPick?.started_at,
          completed_at: userPick?.completed_at,
          total_time_spent: userPick?.total_time_spent || 0,
          end_date: sub.end_date,
          start_date: sub.start_date,
          is_completed: sub.is_completed || progress === 100,
          work_logs: userPick?.work_logs || []
        });
      }
      
      // Log the results grouped by project
      const groupedByProject = userTasks.reduce((acc, task) => {
        const projectKey = task.project_id;
        if (!acc[projectKey]) {
          acc[projectKey] = [];
        }
        acc[projectKey].push(task);
        return acc;
      }, {});
      
      console.log('User tasks grouped by project:');
      Object.entries(groupedByProject).forEach(([projectId, tasks]) => {
        console.log(`  - ${tasks[0]?.project_name} (${projectId}): ${tasks.length} tasks`);
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
  async ({ subActivityId, empCode, empName }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const projects = state.api.projects || [];
      const activities = state.api.activities || [];
      const activityProjectMap = buildActivityProjectMap(projects, activities);
      
      // Get all subactivities and find the specific one
      const allResponse = await api.get('/subactivity/');
      const subActivity = allResponse.data.find(s => s.id === subActivityId);
      
      if (!subActivity) throw new Error('Sub-activity not found');
      
      const activityId = subActivity.activity;
      let projectInfo = activityProjectMap.get(activityId);
      
      // If still not found, try to find by activity name
      if (!projectInfo && subActivity.activity_detail) {
        const activityName = subActivity.activity_detail.activity_name;
        for (const project of projects) {
          if (project.activities_detail) {
            const foundActivity = project.activities_detail.find(a => a.activity_name === activityName);
            if (foundActivity && foundActivity.id === activityId) {
              projectInfo = {
                project_id: project.id,
                project_name: project.project_name,
                project_code: project.project_code
              };
              break;
            }
          }
        }
      }
      
      let activityName = 'Unknown Activity';
      const activity = activities.find(a => a.id === activityId);
      if (activity) {
        activityName = activity.activity_name;
      } else if (subActivity.activity_detail) {
        activityName = subActivity.activity_detail.activity_name;
      }
      
      const currentPicks = subActivity.picked_at || [];
      
      const alreadyPickedByOther = currentPicks.some(pick => pick.emp_code !== empCode);
      if (alreadyPickedByOther) {
        const pickerName = currentPicks.find(pick => pick.emp_code !== empCode)?.emp_name;
        throw new Error(`This task is already picked by ${pickerName}`);
      }
      
      const alreadyPicked = currentPicks.some(pick => pick.emp_code === empCode);
      if (alreadyPicked) {
        throw new Error('You have already picked this task');
      }
      
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
      
      const taskName = subActivity.subactivity_name;
      const projectName = projectInfo?.project_name || 'Unknown Project';
      
      showSuccess(`Task "${taskName}" picked successfully from project "${projectName}"!`);
      
      return {
        ...response.data,
        id: subActivityId,
        subactivity_name: taskName,
        activity_name: activityName,
        activity_id: activityId,
        project_id: projectInfo?.project_id || 'unknown',
        project_name: projectName,
        project_code: projectInfo?.project_code || 'N/A',
        unit: subActivity.unit,
        total_quantity: subActivity.total_quantity || 0,
        completed_quantity: 0,
        progress: 0,
        status: 'PENDING',
        picked_at: newPick.picked_at,
        end_date: subActivity.end_date,
        start_date: subActivity.start_date,
        total_time_spent: 0,
        work_logs: []
      };
    } catch (error) {
      console.error('Error picking task:', error);
      showError(error.message || 'Failed to pick task');
      return rejectWithValue(error.message);
    }
  }
);

// Save daily work log with proper UUID handling
export const saveDailyWorkLog = createAsyncThunk(
  'tasks/saveDailyWorkLog',
  async ({ subActivityId, date, startTime, endTime, note, status }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const empCode = getEmpCode();
      const userUUID = getUserUUID();
      
      if (!empCode) throw new Error('User not authenticated');
      if (!userUUID) throw new Error('User UUID not found');
      
      const existingTask = state.tasks.userTasks.find(t => t.id === subActivityId);
      
      // Get ALL subactivities and find the specific one
      const allResponse = await api.get('/subactivity/');
      const subActivity = allResponse.data.find(s => s.id === subActivityId);
      
      if (!subActivity) throw new Error('Sub-activity not found');
      
      const currentPicks = subActivity.picked_at || [];
      const userPick = currentPicks.find(pick => pick.emp_code === empCode);
      if (!userPick) throw new Error('Task not found for this user');
      
      let hoursWorked = 0;
      let workLogEntry = {};
      
      if (status === 'WORKED') {
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
      
      const workLogs = [...(userPick.work_logs || []), workLogEntry];
      const totalTimeSpent = (userPick.total_time_spent || 0) + hoursWorked;
      
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
      
      const updateData = {
        ...subActivity,
        picked_at: updatedPicks
      };
      
      await api.put(`/subactivity/${subActivityId}/`, updateData);
      
      // Get project details
      const activityId = subActivity.activity;
      let projectId = null;
      
      // Try to get project info from existing task
      if (existingTask?.project_id && existingTask?.project_id !== 'unknown') {
        projectId = existingTask.project_id;
      } else {
        // Try to find from activities and projects
        const projects = state.api.projects || [];
        const activities = state.api.activities || [];
        const activity = activities.find(a => a.id === activityId);
        
        if (activity && activity.project) {
          projectId = activity.project;
        } else {
          // Try to find by activity name in projects
          const activityName = subActivity.activity_detail?.activity_name;
          if (activityName) {
            for (const project of projects) {
              if (project.activities_detail) {
                const found = project.activities_detail.find(a => a.activity_name === activityName);
                if (found) {
                  projectId = project.id;
                  break;
                }
              }
            }
          }
        }
      }
      
      // Save to ActivityTimeLog
      if (projectId && userUUID) {
        try {
          if (status === 'WORKED') {
            const durationSeconds = Math.round(hoursWorked * 3600);
            const startDateTime = `${date}T${startTime}:00`;
            const endDateTime = `${date}T${endTime}:00`;
            
            const timeLogData = {
              project: projectId,
              user: userUUID,
              subactivity: subActivityId,
              entry_type: 'WORK_LOG',
              status: 'IN_PROGRESS',
              start_time: startDateTime,
              end_time: endDateTime,
              duration: durationSeconds,
              note: note || `Worked on ${subActivity.subactivity_name} for ${hoursWorked.toFixed(2)} hours`
            };
            
            await api.post('/activity-timelog/', timeLogData);
          } else {
            const startDateTime = `${date}T00:00:00`;
            const endDateTime = `${date}T23:59:59`;
            
            const timeLogData = {
              project: projectId,
              user: userUUID,
              subactivity: subActivityId,
              entry_type: 'LEAVE',
              status: 'ABSENT',
              start_time: startDateTime,
              end_time: endDateTime,
              duration: 86400,
              note: note || 'No work done'
            };
            
            await api.post('/activity-timelog/', timeLogData);
          }
        } catch (logError) {
          console.error('Time log save failed:', logError.response?.data || logError.message);
        }
      }
      
      showSuccess(status === 'WORKED' ? `Work logged! ${hoursWorked.toFixed(2)} hours recorded` : 'Leave record saved');
      
      return {
        id: subActivityId,
        project_name: existingTask?.project_name,
        project_code: existingTask?.project_code,
        project_id: existingTask?.project_id,
        activity_name: existingTask?.activity_name,
        subactivity_name: existingTask?.subactivity_name,
        total_time_spent: totalTimeSpent,
        work_logs: workLogs
      };
    } catch (error) {
      console.error('Error saving work log:', error);
      showError(error.message || 'Failed to save record');
      return rejectWithValue(error.message);
    }
  }
);

// Update task progress
export const updateTaskProgress = createAsyncThunk(
  'tasks/updateTaskProgress',
  async ({ subActivityId, completedQuantity }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const empCode = getEmpCode();
      const existingTask = state.tasks.userTasks.find(t => t.id === subActivityId);
      
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
            status: newProgress === 100 ? 'COMPLETED' : (newProgress > 0 ? 'IN_PROGRESS' : 'PENDING'),
            completed_at: newProgress === 100 ? new Date().toISOString() : pick.completed_at
          };
        }
        return pick;
      });
      
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
      
      return {
        ...response.data,
        id: subActivityId,
        project_name: existingTask?.project_name,
        project_code: existingTask?.project_code,
        project_id: existingTask?.project_id,
        activity_name: existingTask?.activity_name,
        subactivity_name: existingTask?.subactivity_name,
        completed_quantity: completedQuantity,
        progress: newProgress,
        status: newProgress === 100 ? 'COMPLETED' : (newProgress > 0 ? 'IN_PROGRESS' : 'PENDING')
      };
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
    userWorkLogs: [],
    loading: false,
    updating: false,
    error: null,
    stats: {
      total: 0,
      inProgress: 0,
      completed: 0,
      pending: 0,
      totalTimeSpent: 0
    },
    workLogStats: {
      totalHours: 0,
      totalEntries: 0,
      byDate: {},
      byProject: {}
    }
  },
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },
    calculateStats: (state) => {
      state.stats = {
        total: state.userTasks.length,
        inProgress: state.userTasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'ONGOING').length,
        completed: state.userTasks.filter(t => t.status === 'COMPLETED').length,
        pending: state.userTasks.filter(t => t.status === 'PENDING').length,
        totalTimeSpent: state.userTasks.reduce((sum, t) => sum + (t.total_time_spent || 0), 0)
      };
    },
    calculateWorkLogStats: (state) => {
      const totalHours = state.userWorkLogs.reduce((sum, log) => {
        if (log.duration) {
          const hours = typeof log.duration === 'number' ? log.duration / 3600 : 0;
          return sum + hours;
        }
        return sum;
      }, 0);
      
      const byDate = {};
      const byProject = {};
      
      state.userWorkLogs.forEach(log => {
        const date = log.date;
        if (date) {
          byDate[date] = (byDate[date] || 0) + (log.duration ? (typeof log.duration === 'number' ? log.duration / 3600 : 0) : 0);
        }
        
        const projectName = log.project_name;
        if (projectName) {
          byProject[projectName] = (byProject[projectName] || 0) + 1;
        }
      });
      
      state.workLogStats = {
        totalHours: parseFloat(totalHours.toFixed(2)),
        totalEntries: state.userWorkLogs.length,
        byDate,
        byProject
      };
    },
    updateTaskLocally: (state, action) => {
      const { taskId, updates } = action.payload;
      const index = state.userTasks.findIndex(t => t.id === taskId);
      if (index !== -1) {
        state.userTasks[index] = { ...state.userTasks[index], ...updates };
        state.stats = {
          total: state.userTasks.length,
          inProgress: state.userTasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'ONGOING').length,
          completed: state.userTasks.filter(t => t.status === 'COMPLETED').length,
          pending: state.userTasks.filter(t => t.status === 'PENDING').length,
          totalTimeSpent: state.userTasks.reduce((sum, t) => sum + (t.total_time_spent || 0), 0)
        };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user work logs
      .addCase(fetchUserWorkLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserWorkLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.userWorkLogs = action.payload || [];
        const totalHours = state.userWorkLogs.reduce((sum, log) => {
          if (log.duration) {
            const hours = typeof log.duration === 'number' ? log.duration / 3600 : 0;
            return sum + hours;
          }
          return sum;
        }, 0);
        state.workLogStats.totalHours = parseFloat(totalHours.toFixed(2));
        state.workLogStats.totalEntries = state.userWorkLogs.length;
      })
      .addCase(fetchUserWorkLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
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
          inProgress: state.userTasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'ONGOING').length,
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
      .addCase(pickTask.fulfilled, (state, action) => {
        state.loading = false;
        const exists = state.userTasks.some(t => t.id === action.payload.id);
        if (!exists) {
          const newTask = {
            id: action.payload.id,
            subactivity_id: action.payload.id,
            subactivity_name: action.payload.subactivity_name,
            activity_name: action.payload.activity_name,
            activity_id: action.payload.activity_id,
            project_id: action.payload.project_id,
            project_name: action.payload.project_name,
            project_code: action.payload.project_code,
            unit: action.payload.unit,
            total_quantity: action.payload.total_quantity,
            completed_quantity: 0,
            progress: 0,
            status: 'PENDING',
            picked_at: action.payload.picked_at,
            end_date: action.payload.end_date,
            start_date: action.payload.start_date,
            total_time_spent: 0,
            work_logs: []
          };
          state.userTasks.push(newTask);
          state.stats = {
            total: state.userTasks.length,
            inProgress: state.userTasks.filter(t => t.status === 'IN_PROGRESS').length,
            completed: state.userTasks.filter(t => t.status === 'COMPLETED').length,
            pending: state.userTasks.filter(t => t.status === 'PENDING').length,
            totalTimeSpent: state.userTasks.reduce((sum, t) => sum + (t.total_time_spent || 0), 0)
          };
        }
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
        const index = state.userTasks.findIndex(t => t.id === action.payload.id);
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
        const index = state.userTasks.findIndex(t => t.id === action.payload.id);
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

export const { clearTaskError, calculateStats, calculateWorkLogStats, updateTaskLocally } = taskSlice.actions;
export default taskSlice.reducer;