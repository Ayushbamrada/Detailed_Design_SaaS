// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../../services/api";
// import { showSuccess, showError } from "../../utils/toast";


// const getUserUUID = () => {
//   return localStorage.getItem('user_uuid') ||
//     sessionStorage.getItem('user_uuid') ||
//     null;
// };


// const getEmpCode = () => {
//   return localStorage.getItem('emp_code') ||
//     sessionStorage.getItem('emp_code') ||
//     null;
// };


// const buildActivityProjectMap = (projects, activities) => {
//   const map = new Map();



//   projects.forEach(project => {
//     const projectId = project.id;
//     const projectName = project.project_name;
//     const projectCode = project.project_code;


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


//   activities.forEach(activity => {
//     if (activity.id && !map.has(activity.id)) {

//       if (activity.project) {
//         const project = projects.find(p => p.id === activity.project);
//         if (project) {
//           map.set(activity.id, {
//             project_id: project.id,
//             project_name: project.project_name,
//             project_code: project.project_code,
//             activity_name: activity.activity_name
//           });
//         }
//       }
//     }
//   });

//   return map;
// };


// export const fetchUserWorkLogs = createAsyncThunk(
//   'tasks/fetchUserWorkLogs',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const userUUID = getUserUUID();
//       if (!userUUID) {
//         return [];
//       }



//       const response = await api.get(`/employee-timelog/?user=${userUUID}`);
//       const logs = response.data.results || response.data;


//       const transformedLogs = logs.map(log => ({
//         id: log.id,
//         project_id: log.project,
//         project_name: log.project_detail?.project_name || 'Unknown Project',
//         project_code: log.project_detail?.project_code || 'N/A',
//         activity_id: log.activity,
//         activity_name: log.activity_detail?.activity_name || 'Unknown Activity',
//         subactivity_id: log.subactivity,
//         subactivity_name: log.subactivity_detail?.subactivity_name || 'Unknown Task',
//         entry_type: log.entry_type,
//         status: log.status,
//         start_time: log.start_time,
//         end_time: log.end_time,
//         duration: log.duration,
//         note: log.note,
//         created_at: log.created_at,
//         date: log.start_time?.split('T')[0] || new Date().toISOString().split('T')[0]
//       }));

//       return transformedLogs;
//     } catch (error) {
//       console.error('Error fetching user work logs:', error);
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// // Fetch user's picked tasks from subactivities
// export const fetchUserTasks = createAsyncThunk(
//   'tasks/fetchUserTasks',
//   async (empCode, { getState, rejectWithValue }) => {
//     try {
//       const state = getState();
//       const projects = state.api.projects || [];
//       const activities = state.api.activities || [];

//       const activityProjectMap = buildActivityProjectMap(projects, activities);

//       const response = await api.get('/subactivity/');
//       const allSubActivities = response.data;

//       const userPickedSubs = allSubActivities.filter(sub => {
//         const picks = sub.picked_at || [];
//         return picks.some(pick => pick.emp_code === empCode);
//       });


//       const userTasks = [];

//       for (const sub of userPickedSubs) {
//         const userPick = (sub.picked_at || []).find(pick => pick.emp_code === empCode);
//         const activityId = sub.activity;

//         // Get project info from our map
//         let projectInfo = activityProjectMap.get(activityId);

//         // If still not found, try to find by activity name in projects
//         if (!projectInfo && sub.activity_detail) {
//           const activityName = sub.activity_detail.activity_name;
//           // Search through projects for this activity name
//           for (const project of projects) {
//             if (project.activities_detail) {
//               const foundActivity = project.activities_detail.find(a => a.activity_name === activityName);
//               if (foundActivity && foundActivity.id === activityId) {
//                 projectInfo = {
//                   project_id: project.id,
//                   project_name: project.project_name,
//                   project_code: project.project_code
//                 };
//                 break;
//               }
//             }
//           }
//         }

//         // Get activity name
//         let activityName = 'Unknown Activity';
//         const activity = activities.find(a => a.id === activityId);
//         if (activity) {
//           activityName = activity.activity_name;
//         } else if (sub.activity_detail) {
//           activityName = sub.activity_detail.activity_name;
//         }

//         const totalQty = sub.total_quantity || 0;
//         const completedQty = userPick?.completed_quantity || sub.completed_quantity || 0;
//         const progress = totalQty > 0 ? Math.round((completedQty / totalQty) * 100) : (sub.progress || 0);

//         userTasks.push({
//           id: sub.id,
//           subactivity_id: sub.id,
//           subactivity_name: sub.subactivity_name,
//           activity_name: activityName,
//           activity_id: activityId,
//           project_id: projectInfo?.project_id || 'unknown',
//           project_name: projectInfo?.project_name || 'Unknown Project',
//           project_code: projectInfo?.project_code || 'N/A',
//           unit: sub.unit,
//           unit_display: sub.unit === 'Kilometer' ? 'Km' :
//             sub.unit === 'Numbers' ? 'Nos.' :
//               sub.unit === 'Percentage' ? '%' : 'status',
//           total_quantity: totalQty,
//           completed_quantity: completedQty,
//           progress: progress,
//           status: userPick?.status || (progress === 100 ? 'COMPLETED' : progress > 0 ? 'IN_PROGRESS' : 'PENDING'),
//           picked_at: userPick?.picked_at,
//           started_at: userPick?.started_at,
//           completed_at: userPick?.completed_at,
//           total_time_spent: userPick?.total_time_spent || 0,
//           end_date: sub.end_date,
//           start_date: sub.start_date,
//           is_completed: sub.is_completed || progress === 100,
//           work_logs: userPick?.work_logs || []
//         });
//       }


//       const groupedByProject = userTasks.reduce((acc, task) => {
//         const projectKey = task.project_id;
//         if (!acc[projectKey]) {
//           acc[projectKey] = [];
//         }
//         acc[projectKey].push(task);
//         return acc;
//       }, {});

//       Object.entries(groupedByProject).forEach(([projectId, tasks]) => {
//         console.log(`  - ${tasks[0]?.project_name} (${projectId}): ${tasks.length} tasks`);
//       });

//       return userTasks;
//     } catch (error) {
//       console.error('Error fetching user tasks:', error);
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );


// export const pickTask = createAsyncThunk(
//   'tasks/pickTask',
//   async ({ subActivityId, empCode, empName }, { getState, rejectWithValue }) => {
//     try {
//       const state = getState();
//       const projects = state.api.projects || [];
//       const activities = state.api.activities || [];
//       const activityProjectMap = buildActivityProjectMap(projects, activities);

//       // Get all subactivities and find the specific one
//       const allResponse = await api.get('/subactivity/');
//       const subActivity = allResponse.data.find(s => s.id === subActivityId);

//       if (!subActivity) throw new Error('Sub-activity not found');

//       const activityId = subActivity.activity;
//       let projectInfo = activityProjectMap.get(activityId);

//       // If still not found, try to find by activity name
//       if (!projectInfo && subActivity.activity_detail) {
//         const activityName = subActivity.activity_detail.activity_name;
//         for (const project of projects) {
//           if (project.activities_detail) {
//             const foundActivity = project.activities_detail.find(a => a.activity_name === activityName);
//             if (foundActivity && foundActivity.id === activityId) {
//               projectInfo = {
//                 project_id: project.id,
//                 project_name: project.project_name,
//                 project_code: project.project_code
//               };
//               break;
//             }
//           }
//         }
//       }

//       let activityName = 'Unknown Activity';
//       const activity = activities.find(a => a.id === activityId);
//       if (activity) {
//         activityName = activity.activity_name;
//       } else if (subActivity.activity_detail) {
//         activityName = subActivity.activity_detail.activity_name;
//       }

//       const currentPicks = subActivity.picked_at || [];

//       const alreadyPickedByOther = currentPicks.some(pick => pick.emp_code !== empCode);
//       if (alreadyPickedByOther) {
//         const pickerName = currentPicks.find(pick => pick.emp_code !== empCode)?.emp_name;
//         throw new Error(`This task is already picked by ${pickerName}`);
//       }

//       const alreadyPicked = currentPicks.some(pick => pick.emp_code === empCode);
//       if (alreadyPicked) {
//         throw new Error('You have already picked this task');
//       }

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

// // Save daily work log with proper UUID handling
// export const
//   saveDailyWorkLog = createAsyncThunk(
//     'tasks/saveDailyWorkLog',
//     async ({ projectbyId, subActivityId, date, startTime, endTime, note, status }, { getState, rejectWithValue }) => {

//       try {
//         const state = getState();
//         const empCode = getEmpCode();
//         const userUUID = getUserUUID();

//         if (!empCode) throw new Error('User not authenticated');
//         if (!userUUID) throw new Error('User UUID not found');

//         const existingTask = state.tasks.userTasks.find(t => t.id === subActivityId);

//         // Get ALL subactivities and find the specific one
//         const allResponse = await api.get('/subactivity/');
//         const subActivity = allResponse.data.find(s => s.id === subActivityId);

//         if (!subActivity) throw new Error('Sub-activity not found');



//         let hoursWorked = 0;
//         let workLogEntry = {};

//         if (status === 'WORKED') {
//           if (!startTime || !endTime) {
//             throw new Error('Please enter both start and end time');
//           }

//           const start = new Date(`${date}T${startTime}`);
//           const end = new Date(`${date}T${endTime}`);

//           if (start >= end) {
//             throw new Error('End time must be after start time');
//           }

//           hoursWorked = (end - start) / (1000 * 60 * 60);

//           workLogEntry = {
//             date: date,
//             start_time: `${date}T${startTime}`,
//             end_time: `${date}T${endTime}`,
//             hours_worked: parseFloat(hoursWorked.toFixed(2)),
//             note: note || '',
//             status: 'WORKED',
//             completed_quantity: 0
//           };
//         } else {
//           if (!note || !note.trim()) {
//             throw new Error('Please provide a reason for not working');
//           }

//           workLogEntry = {
//             date: date,
//             note: note.trim(),
//             status: 'NOT_WORKED',
//             hours_worked: 0
//           };
//         }

//         // const workLogs = [...(userPick.work_logs || []), workLogEntry];
//         // const totalTimeSpent = (userPick.total_time_spent || 0) + hoursWorked;

//         // const updatedPicks = currentPicks.map(pick => {
//         //   if (pick.emp_code === empCode) {
//         //     return {
//         //       ...pick,
//         //       total_time_spent: totalTimeSpent,
//         //       work_logs: workLogs,
//         //       status: pick.status === 'IN_PROGRESS' ? 'PENDING' : pick.status
//         //     };
//         //   }
//         //   return pick;
//         // });

//         // const updateData = {
//         //   ...subActivity,
//         //   picked_at: updatedPicks
//         // };

//         // await api.put(`/subactivity/${subActivityId}/`, updateData);

//         // Get project details
//         const activityId = subActivity.activity;
//         let projectId = projectbyId;

//         // Try to get project info from existing task
//         if (existingTask?.project_id && existingTask?.project_id !== 'unknown') {
//           projectId = existingTask.project_id;
//         } else {
//           // Try to find from activities and projects
//           const projects = state.api.projects || [];
//           const activities = state.api.activities || [];
//           const activity = activities.find(a => a.id === activityId);

//           if (activity && activity.project) {
//             projectId = activity.project;
//           } else {
//             // Try to find by activity name in projects
//             const activityName = subActivity.activity_detail?.activity_name;
//             if (activityName) {
//               for (const project of projects) {
//                 if (project.activities_detail) {
//                   const found = project.activities_detail.find(a => a.activity_name === activityName);
//                   if (found) {
//                     projectId = project.id;
//                     break;
//                   }
//                 }
//               }
//             }
//           }
//         }

//         // Save to ActivityTimeLog
//         if (projectId && userUUID) {
//           try {
//             if (status === 'WORKED') {
//               const durationSeconds = Math.round(hoursWorked * 3600);
//               const startDateTime = `${date}T${startTime}:00`;
//               const endDateTime = `${date}T${endTime}:00`;

//               const timeLogData = {
//                 project: projectId,
//                 user: userUUID,
//                 subactivity: subActivityId,
//                 entry_type: 'WORK_LOG',
//                 status: 'IN_PROGRESS',
//                 start_time: startDateTime,
//                 end_time: endDateTime,
//                 duration: durationSeconds,
//                 note: note || `Worked on ${subActivity.subactivity_name} for ${hoursWorked.toFixed(2)} hours`
//               };

//               await api.post('/employee-timelog/', timeLogData);
//             } else {
//               const startDateTime = `${date}T00:00:00`;
//               const endDateTime = `${date}T23:59:59`;

//               const timeLogData = {
//                 project: projectId,
//                 user: userUUID,
//                 subactivity: subActivityId,
//                 entry_type: 'LEAVE',
//                 status: 'ABSENT',
//                 start_time: startDateTime,
//                 end_time: endDateTime,
//                 duration: 86400,
//                 note: note || 'No work done'
//               };

//               await api.post('/employee-timelog/', timeLogData);
//             }
//           } catch (logError) {
//             console.error('Time log save failed:', logError.response?.data || logError.message);
//           }
//         }

//         showSuccess(status === 'WORKED' ? `Work logged! ${hoursWorked.toFixed(2)} hours recorded` : 'Leave record saved');

//         return {
//           id: subActivityId,
//           project_name: existingTask?.project_name,
//           project_code: existingTask?.project_code,
//           project_id: existingTask?.project_id,
//           activity_name: existingTask?.activity_name,
//           subactivity_name: existingTask?.subactivity_name,
//           // total_time_spent: totalTimeSpent,
//           // work_logs: workLogs
//         };
//       } catch (error) {
//         console.error('Error saving work log:', error);
//         showError(error.message || 'Failed to save record');
//         return rejectWithValue(error.message);
//       }
//     }
//   );


// export const updateTaskProgress = createAsyncThunk(
//   'tasks/updateTaskProgress',
//   async ({ subActivityId, completedQuantity }, { getState, rejectWithValue }) => {
//     try {
//       const state = getState();
//       const empCode = getEmpCode();
//       const existingTask = state.tasks.userTasks.find(t => t.id === subActivityId);

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
//     userWorkLogs: [],
//     loading: false,
//     updating: false,
//     error: null,
//     stats: {
//       total: 0,
//       inProgress: 0,
//       completed: 0,
//       pending: 0,
//       totalTimeSpent: 0
//     },
//     workLogStats: {
//       totalHours: 0,
//       totalEntries: 0,
//       byDate: {},
//       byProject: {}
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
//     calculateWorkLogStats: (state) => {
//       const totalHours = state.userWorkLogs.reduce((sum, log) => {
//         if (log.duration) {
//           const hours = typeof log.duration === 'number' ? log.duration / 3600 : 0;
//           return sum + hours;
//         }
//         return sum;
//       }, 0);

//       const byDate = {};
//       const byProject = {};

//       state.userWorkLogs.forEach(log => {
//         const date = log.date;
//         if (date) {
//           byDate[date] = (byDate[date] || 0) + (log.duration ? (typeof log.duration === 'number' ? log.duration / 3600 : 0) : 0);
//         }

//         const projectName = log.project_name;
//         if (projectName) {
//           byProject[projectName] = (byProject[projectName] || 0) + 1;
//         }
//       });

//       state.workLogStats = {
//         totalHours: parseFloat(totalHours.toFixed(2)),
//         totalEntries: state.userWorkLogs.length,
//         byDate,
//         byProject
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

//       .addCase(fetchUserWorkLogs.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserWorkLogs.fulfilled, (state, action) => {
//         state.loading = false;
//         state.userWorkLogs = action.payload || [];
//         const totalHours = state.userWorkLogs.reduce((sum, log) => {
//           if (log.duration) {
//             const hours = typeof log.duration === 'number' ? log.duration / 3600 : 0;
//             return sum + hours;
//           }
//           return sum;
//         }, 0);
//         state.workLogStats.totalHours = parseFloat(totalHours.toFixed(2));
//         state.workLogStats.totalEntries = state.userWorkLogs.length;
//       })
//       .addCase(fetchUserWorkLogs.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })


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

// export const { clearTaskError, calculateStats, calculateWorkLogStats, updateTaskLocally } = taskSlice.actions;
// export default taskSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { showSuccess, showError } from "../../utils/toast";

const getUserUUID = () => {
  return localStorage.getItem('user_uuid') ||
    sessionStorage.getItem('user_uuid') ||
    null;
};

const getEmpCode = () => {
  return localStorage.getItem('emp_code') ||
    sessionStorage.getItem('emp_code') ||
    null;
};

// Fetch user work logs from ActivityTimeLog API
export const fetchUserWorkLogs = createAsyncThunk(
  'tasks/fetchUserWorkLogs',
  async (_, { rejectWithValue }) => {
    try {
      const userUUID = getUserUUID();
      if (!userUUID) {
        return [];
      }

      const response = await api.get(`/employee-timelog/?user=${userUUID}`);
      const logs = response.data.results || response.data;

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

      return transformedLogs;
    } catch (error) {
      console.error('Error fetching user work logs:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch user work summary from API
export const fetchUserWorkSummary = createAsyncThunk(
  'tasks/fetchUserWorkSummary',
  async (empCode, { rejectWithValue }) => {
    try {
      const response = await api.get(`/userworksummary/${empCode}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user work summary:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Save daily work log directly (no picking required)
export const saveDailyWorkLog = createAsyncThunk(
  'tasks/saveDailyWorkLog',
  async ({ projectId, subActivityId, date, startTime, endTime, note, status }, { getState, rejectWithValue }) => {
    try {
      const userUUID = getUserUUID();

      if (!userUUID) throw new Error('User not authenticated');

      let durationSeconds = 0;
      let startDateTime = null;
      let endDateTime = null;

      if (status === 'WORKED') {
        if (!startTime || !endTime) {
          throw new Error('Please enter both start and end time');
        }

        startDateTime = `${date}T${startTime}:00`;
        endDateTime = `${date}T${endTime}:00`;

        const start = new Date(startDateTime);
        const end = new Date(endDateTime);

        if (start >= end) {
          throw new Error('End time must be after start time');
        }

        durationSeconds = Math.round((end - start) / 1000);
      } else {
        startDateTime = `${date}T00:00:00`;
        endDateTime = `${date}T23:59:59`;
        durationSeconds = 86400; // 24 hours
      }

      const timeLogData = {
        project: projectId,
        user: userUUID,
        subactivity: subActivityId,
        entry_type: status === 'WORKED' ? 'WORK_LOG' : 'LEAVE',
        status: status === 'WORKED' ? 'COMPLETED' : 'ABSENT',
        start_time: startDateTime,
        end_time: endDateTime,
        duration: durationSeconds,
        note: note || (status === 'WORKED' ? `Worked on task` : `No work done`)
      };

      const response = await api.post('/employee-timelog/', timeLogData);

      showSuccess(status === 'WORKED' ?
        `Work logged! ${(durationSeconds / 3600).toFixed(2)} hours recorded` :
        'Leave record saved successfully'
      );

      return {
        ...response.data,
        project_id: projectId,
        subactivity_id: subActivityId,
        date: date,
        duration: durationSeconds,
        hours: durationSeconds / 3600
      };
    } catch (error) {
      console.error('Error saving work log:', error);
      showError(error.message || 'Failed to save record');
      return rejectWithValue(error.message);
    }
  }
);

// DEPRECATED: Kept for backward compatibility with TaskPicker components
// This functionality is no longer used as users can directly log time
export const pickTask = createAsyncThunk(
  'tasks/pickTask',
  async (taskData, { rejectWithValue }) => {
    // This function is deprecated and will not actually pick tasks
    // It's only here to prevent import errors in existing components
    console.warn('pickTask is deprecated. Users can now log time directly without picking tasks.');

    // Return a mock response for backward compatibility
    return {
      id: taskData.subActivityId,
      subactivity_id: taskData.subActivityId,
      subactivity_name: taskData.subActivityName,
      activity_name: taskData.activityName,
      activity_id: taskData.activityId,
      project_id: taskData.projectId,
      project_name: taskData.projectName,
      project_code: taskData.projectCode,
      unit: taskData.unit,
      total_quantity: taskData.totalQuantity,
      completed_quantity: 0,
      progress: 0,
      status: 'PENDING',
      picked_at: new Date().toISOString(),
      total_time_spent: 0,
      work_logs: []
    };
  }
);

// DEPRECATED: Kept for backward compatibility
export const fetchUserTasks = createAsyncThunk(
  'tasks/fetchUserTasks',
  async (_, { rejectWithValue }) => {
    console.warn('fetchUserTasks is deprecated. Use fetchUserWorkSummary instead.');
    return [];
  }
);

// DEPRECATED: Kept for backward compatibility
export const updateTaskProgress = createAsyncThunk(
  'tasks/updateTaskProgress',
  async (_, { rejectWithValue }) => {
    console.warn('updateTaskProgress is deprecated. Progress updates are handled automatically.');
    return {};
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    userTasks: [],
    userWorkLogs: [],
    userWorkSummary: null,
    loading: false,
    updating: false,
    error: null,
    stats: {
      total: 0,
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

      state.stats = {
        total: state.userWorkLogs.length,
        totalHours: parseFloat(totalHours.toFixed(2)),
        totalEntries: state.userWorkLogs.length,
        byDate,
        byProject
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Work Logs
      .addCase(fetchUserWorkLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserWorkLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.userWorkLogs = action.payload || [];
      })
      .addCase(fetchUserWorkLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch User Work Summary
      .addCase(fetchUserWorkSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserWorkSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.userWorkSummary = action.payload;
      })
      .addCase(fetchUserWorkSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Save Daily Work Log
      .addCase(saveDailyWorkLog.pending, (state) => {
        state.updating = true;
      })
      .addCase(saveDailyWorkLog.fulfilled, (state, action) => {
        state.updating = false;
        state.userWorkLogs.unshift(action.payload);
      })
      .addCase(saveDailyWorkLog.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  }
});

export const { clearTaskError, calculateWorkLogStats } = taskSlice.actions;
export default taskSlice.reducer;