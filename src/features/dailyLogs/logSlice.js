

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { logService } from '../../services/logService';

// const EVENT_TYPE_MAP = {
//   'Project Created': 'PROJECT_CREATED',
//   'Project Updated': 'PROJECT_UPDATED',
//   'Activity Created': 'ACTIVITY_CREATED',
//   'Activity Updated': 'ACTIVITY_UPDATED',
//   'SubActivity Created': 'SUBACTIVITY_CREATED',
//   'SubActivity Updated': 'SUBACTIVITY_UPDATED',
//   'Progress Changed': 'PROGRESS_CHANGED',
//   'Extension Requested': 'EXTENSION_REQUESTED',
//   'Extension Approved': 'EXTENSION_APPROVED',
//   'Extension Rejected': 'EXTENSION_REJECTED',
//   'MANUAL_LOG': 'MANUAL_LOG',
//   'STATUS_UPDATE': 'STATUS_UPDATE'
// };

// // Reverse map for displaying backend values
// const REVERSE_EVENT_TYPE_MAP = {
//   'PROJECT_CREATED': 'Project Created',
//   'PROJECT_UPDATED': 'Project Updated',
//   'ACTIVITY_CREATED': 'Activity Created',
//   'ACTIVITY_UPDATED': 'Activity Updated',
//   'SUBACTIVITY_CREATED': 'SubActivity Created',
//   'SUBACTIVITY_UPDATED': 'SubActivity Updated',
//   'PROGRESS_CHANGED': 'Progress Changed',
//   'EXTENSION_REQUESTED': 'Extension Requested',
//   'EXTENSION_APPROVED': 'Extension Approved',
//   'EXTENSION_REJECTED': 'Extension Rejected',
//   'MANUAL_LOG': 'MANUAL_LOG',
//   'STATUS_UPDATE': 'STATUS_UPDATE'
// };

// // Helper function to transform backend log format to frontend format
// const transformLog = (log) => {
//   // Parse old and new values if they're strings
//   let oldValue = log.old_value;
//   let newValue = log.new_value;
  
//   try {
//     if (typeof oldValue === 'string') oldValue = JSON.parse(oldValue);
//     if (typeof newValue === 'string') newValue = JSON.parse(newValue);
//   } catch (e) {
//     // Ignore parsing errors
//   }

//   // Map the event type from backend to display format
//   const displayEventType = REVERSE_EVENT_TYPE_MAP[log.event_type] || log.event_type;

//   // Determine project details from various sources
//   let projectId = log.project;
//   let projectDetail = log.project_detail;
//   let projectName = 'Unknown Project';
//   let projectCode = null;

//   // If we have project_detail, use it
//   if (projectDetail) {
//     projectName = projectDetail.project_name || 'Unknown Project';
//     projectCode = projectDetail.project_code;
//   } 
//   // If no project_detail but we have activity with project info
//   else if (log.activity_detail?.project_detail) {
//     projectName = log.activity_detail.project_detail.project_name || 'Unknown Project';
//     projectCode = log.activity_detail.project_detail.project_code;
//     projectId = log.activity_detail.project;
//   }
//   // If activity has project ID but no details
//   else if (log.activity) {
//     projectName = `Activity: ${log.activity_detail?.activity_name || 'Unknown'}`;
//   }
//   // If subactivity has info
//   else if (log.subactivity_detail) {
//     projectName = `SubActivity: ${log.subactivity_detail.subactivity_name}`;
//   }

//   return {
//     id: log.id,
//     event_type: displayEventType,
//     original_event_type: log.event_type, // Keep original for debugging
//     message: log.message,
//     old_value: oldValue,
//     new_value: newValue,
//     created_at: log.created_at,
//     performed_by: log.performed_by,
//     performed_by_detail: log.performed_by_detail,
//     project: projectId,
//     project_detail: projectDetail,
//     activity: log.activity,
//     activity_detail: log.activity_detail,
//     subactivity: log.subactivity,
//     subactivity_detail: log.subactivity_detail,
    
//     // Derived fields for easier display
//     log_type: displayEventType,
//     description: log.message,
//     date: log.created_at?.split('T')[0] || '',
//     time: log.created_at?.split('T')[1]?.substring(0, 5) || '',
//     user: log.performed_by_detail?.username || 'System',
//     user_role: log.performed_by_detail?.role || 'SYSTEM',
//     user_name: log.performed_by_detail?.username || 'System',
//     project_name: projectName,
//     project_code: projectCode,
//     company_name: projectDetail?.company_detail?.name || 
//                    log.activity_detail?.project_detail?.company_detail?.name,
//     sector_name: projectDetail?.sector_detail?.name || 
//                   log.activity_detail?.project_detail?.sector_detail?.name,
//     client_name: projectDetail?.client_detail?.name || 
//                   log.activity_detail?.project_detail?.client_detail?.name,
    
//     // Helper to identify log source
//     log_source: log.project ? 'project' : 
//                 log.activity ? 'activity' : 
//                 log.subactivity ? 'subactivity' : 'unknown',
    
//     // Raw data for debugging (only in development)
//     raw: process.env.NODE_ENV === 'development' ? log : null
//   };
// };

// const initialState = {
//   allLogs: [],
//   projectLogs: [],
//   pagination: {
//     currentPage: 1,
//     totalPages: 1,
//     totalItems: 0,
//     itemsPerPage: 10,
//     hasNext: false,
//     hasPrev: false,
//     nextPage: null,
//     prevPage: null
//   },
//   loading: false,
//   loadingMore: false,
//   error: null,
//   filters: {
//     date: new Date().toISOString().split('T')[0],
//     eventType: 'all',
//     projectId: 'all',
//     search: ''
//   },
//   stats: {
//     total: 0,
//     byType: {},
//     byProject: {},
//     byDate: {}
//   }
// };

// // Async thunks
// export const fetchAllLogs = createAsyncThunk(
//   'logs/fetchAll',
//   async ({ page = 1, pageSize = 10, append = false, filters = {} } = {}, { getState, rejectWithValue }) => {
//     try {
//       const state = getState();
//       const currentFilters = { ...state.logs.filters, ...filters };
      
//       console.log('Fetching all logs with filters:', {
//         date: currentFilters.date,
//         eventType: currentFilters.eventType,
//         projectId: currentFilters.projectId,
//         search: currentFilters.search,
//         page,
//         pageSize
//       });
      
//       const response = await logService.getAllLogs({
//         page,
//         pageSize,
//         date: currentFilters.date,
//         eventType: currentFilters.eventType,
//         projectId: currentFilters.projectId,
//         search: currentFilters.search
//       });
      
//       console.log('API Response:', {
//         totalResults: response.results?.length,
//         totalCount: response.count,
//         hasNext: !!response.next
//       });
      
//       const transformedLogs = response.results.map(transformLog);
      
//       // Log a sample to verify event type mapping
//       if (transformedLogs.length > 0) {
//         console.log('Sample transformed log:', {
//           original: transformedLogs[0].original_event_type,
//           display: transformedLogs[0].event_type
//         });
//       }
      
//       const paginationData = {
//         currentPage: response.current_page || page,
//         totalPages: response.total_pages || Math.ceil(response.count / pageSize),
//         totalItems: response.count || 0,
//         itemsPerPage: pageSize,
//         hasNext: !!response.next,
//         hasPrev: !!response.previous,
//         nextPage: response.next,
//         prevPage: response.previous
//       };
      
//       console.log(`Fetched ${transformedLogs.length} logs, total: ${paginationData.totalItems}`);
      
//       return {
//         logs: transformedLogs,
//         pagination: paginationData,
//         append
//       };
//     } catch (error) {
//       console.error('Error in fetchAllLogs:', error);
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const fetchProjectLogs = createAsyncThunk(
//   'logs/fetchProjectLogs',
//   async ({ projectId, page = 1, pageSize = 10, append = false, filters = {} } = {}, { getState, rejectWithValue }) => {
//     try {
//       const state = getState();
//       const currentFilters = { ...state.logs.filters, ...filters };
      
//       console.log(`Fetching logs for project: ${projectId} with filters:`, {
//         date: currentFilters.date,
//         eventType: currentFilters.eventType,
//         search: currentFilters.search,
//         page,
//         pageSize
//       });
      
//       const response = await logService.getProjectLogs(projectId, {
//         page,
//         pageSize,
//         date: currentFilters.date,
//         eventType: currentFilters.eventType,
//         search: currentFilters.search
//       });
      
//       console.log('API Response:', {
//         totalResults: response.results?.length,
//         totalCount: response.count,
//         hasNext: !!response.next
//       });
      
//       const transformedLogs = response.results.map(transformLog);
      
//       const paginationData = {
//         currentPage: response.current_page || page,
//         totalPages: response.total_pages || Math.ceil(response.count / pageSize),
//         totalItems: response.count || 0,
//         itemsPerPage: pageSize,
//         hasNext: !!response.next,
//         hasPrev: !!response.previous,
//         nextPage: response.next,
//         prevPage: response.previous
//       };
      
//       console.log(`Fetched ${transformedLogs.length} logs for project ${projectId}, total: ${paginationData.totalItems}`);
      
//       return {
//         logs: transformedLogs,
//         pagination: paginationData,
//         append,
//         projectId
//       };
//     } catch (error) {
//       console.error('Error in fetchProjectLogs:', error);
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const fetchAllLogsUnfiltered = createAsyncThunk(
//   'logs/fetchAllUnfiltered',
//   async ({ page = 1, pageSize = 50 } = {}, { rejectWithValue }) => {
//     try {
//       const response = await logService.getAllLogsUnfiltered({ page, pageSize });
      
//       const transformedLogs = response.results.map(transformLog);
      
//       console.log('Unfiltered logs count:', transformedLogs.length);
//       return transformedLogs;
//     } catch (error) {
//       console.error('Error in fetchAllLogsUnfiltered:', error);
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const fetchLogStats = createAsyncThunk(
//   'logs/fetchStats',
//   async (projectId = null, { rejectWithValue }) => {
//     try {
//       const response = await logService.getLogStats(projectId);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const createLog = createAsyncThunk(
//   'logs/create',
//   async (logData, { rejectWithValue }) => {
//     try {
//       const response = await logService.createLog(logData);
//       return transformLog(response);
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const deleteLog = createAsyncThunk(
//   'logs/delete',
//   async (logId, { rejectWithValue }) => {
//     try {
//       await logService.deleteLog(logId);
//       return logId;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// const logSlice = createSlice({
//   name: 'logs',
//   initialState,
//   reducers: {
//     setLogFilters: (state, action) => {
//       state.filters = { ...state.filters, ...action.payload };
//     },
//     resetFilters: (state) => {
//       state.filters = {
//         date: new Date().toISOString().split('T')[0],
//         eventType: 'all',
//         projectId: 'all',
//         search: ''
//       };
//     },
//     clearLogs: (state) => {
//       state.allLogs = [];
//       state.projectLogs = [];
//       state.pagination = initialState.pagination;
//       state.error = null;
//     },
//     resetPagination: (state) => {
//       state.pagination.currentPage = 1;
//     },
//     calculateStats: (state) => {
//       const logs = state.allLogs.length > 0 ? state.allLogs : state.projectLogs;
      
//       state.stats.total = logs.length;
      
//       const byType = {};
//       const byProject = {};
//       const byDate = {};
      
//       logs.forEach(log => {
//         const type = log.event_type || 'UNKNOWN';
//         byType[type] = (byType[type] || 0) + 1;
        
//         const projectName = log.project_name || 'Unknown';
//         byProject[projectName] = (byProject[projectName] || 0) + 1;
        
//         const date = log.date || 'unknown';
//         byDate[date] = (byDate[date] || 0) + 1;
//       });
      
//       state.stats.byType = byType;
//       state.stats.byProject = byProject;
//       state.stats.byDate = byDate;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch all logs
//       .addCase(fetchAllLogs.pending, (state) => {
//         if (state.pagination.currentPage === 1) {
//           state.loading = true;
//         } else {
//           state.loadingMore = true;
//         }
//         state.error = null;
//       })
//       .addCase(fetchAllLogs.fulfilled, (state, action) => {
//         state.loading = false;
//         state.loadingMore = false;
        
//         if (action.payload.append) {
//           state.allLogs = [...state.allLogs, ...action.payload.logs];
//         } else {
//           state.allLogs = action.payload.logs;
//         }
        
//         state.pagination = action.payload.pagination;
//       })
//       .addCase(fetchAllLogs.rejected, (state, action) => {
//         state.loading = false;
//         state.loadingMore = false;
//         state.error = action.payload;
//       })

//       // Fetch project logs
//       .addCase(fetchProjectLogs.pending, (state) => {
//         if (state.pagination.currentPage === 1) {
//           state.loading = true;
//         } else {
//           state.loadingMore = true;
//         }
//         state.error = null;
//       })
//       .addCase(fetchProjectLogs.fulfilled, (state, action) => {
//         state.loading = false;
//         state.loadingMore = false;
        
//         if (action.payload.append) {
//           state.projectLogs = [...state.projectLogs, ...action.payload.logs];
//         } else {
//           state.projectLogs = action.payload.logs;
//         }
        
//         state.pagination = action.payload.pagination;
//       })
//       .addCase(fetchProjectLogs.rejected, (state, action) => {
//         state.loading = false;
//         state.loadingMore = false;
//         state.error = action.payload;
//       })

//       // Fetch unfiltered logs (debug)
//       .addCase(fetchAllLogsUnfiltered.fulfilled, (state, action) => {
//         console.log('Unfiltered logs in state:', action.payload.length);
//       })

//       // Fetch stats
//       .addCase(fetchLogStats.fulfilled, (state, action) => {
//         state.stats = action.payload;
//       })

//       // Create log
//       .addCase(createLog.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(createLog.fulfilled, (state, action) => {
//         state.loading = false;
//         state.allLogs.unshift(action.payload);
//         state.projectLogs.unshift(action.payload);
//         state.pagination.totalItems += 1;
//       })
//       .addCase(createLog.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Delete log
//       .addCase(deleteLog.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(deleteLog.fulfilled, (state, action) => {
//         state.loading = false;
//         state.allLogs = state.allLogs.filter(l => l.id !== action.payload);
//         state.projectLogs = state.projectLogs.filter(l => l.id !== action.payload);
//         state.pagination.totalItems -= 1;
//       })
//       .addCase(deleteLog.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   }
// });

// export const { setLogFilters, resetFilters, clearLogs, resetPagination, calculateStats } = logSlice.actions;
// export default logSlice.reducer;



// // src/features/dailyLogs/logSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { logService } from '../../services/logService';

// // Map frontend display names to backend enum values
// const EVENT_TYPE_MAP = {
//   'Project Created': 'PROJECT_CREATED',
//   'Project Updated': 'PROJECT_UPDATED',
//   'Activity Created': 'ACTIVITY_CREATED',
//   'Activity Updated': 'ACTIVITY_UPDATED',
//   'SubActivity Created': 'SUBACTIVITY_CREATED',
//   'SubActivity Updated': 'SUBACTIVITY_UPDATED',
//   'Progress Changed': 'PROGRESS_CHANGED',
//   'Extension Requested': 'EXTENSION_REQUESTED',
//   'Extension Approved': 'EXTENSION_APPROVED',
//   'Extension Rejected': 'EXTENSION_REJECTED',
//   'MANUAL_LOG': 'MANUAL_LOG',
//   'STATUS_UPDATE': 'STATUS_UPDATE'
// };

// // Reverse map for displaying backend values
// const REVERSE_EVENT_TYPE_MAP = {
//   'PROJECT_CREATED': 'Project Created',
//   'PROJECT_UPDATED': 'Project Updated',
//   'ACTIVITY_CREATED': 'Activity Created',
//   'ACTIVITY_UPDATED': 'Activity Updated',
//   'SUBACTIVITY_CREATED': 'SubActivity Created',
//   'SUBACTIVITY_UPDATED': 'SubActivity Updated',
//   'PROGRESS_CHANGED': 'Progress Changed',
//   'EXTENSION_REQUESTED': 'Extension Requested',
//   'EXTENSION_APPROVED': 'Extension Approved',
//   'EXTENSION_REJECTED': 'Extension Rejected',
//   'MANUAL_LOG': 'MANUAL_LOG',
//   'STATUS_UPDATE': 'STATUS_UPDATE'
// };

// // Helper function to transform backend log format to frontend format
// const transformLog = (log) => {
//   // Parse old and new values if they're strings
//   let oldValue = log.old_value;
//   let newValue = log.new_value;
  
//   try {
//     if (typeof oldValue === 'string') oldValue = JSON.parse(oldValue);
//     if (typeof newValue === 'string') newValue = JSON.parse(newValue);
//   } catch (e) {
//     // Ignore parsing errors
//   }

//   // Map the event type from backend to display format
//   const displayEventType = REVERSE_EVENT_TYPE_MAP[log.event_type] || log.event_type;

//   // Determine project details from various sources
//   let projectId = log.project;
//   let projectDetail = log.project_detail;
//   let projectName = 'Unknown Project';
//   let projectCode = null;

//   // If we have project_detail, use it
//   if (projectDetail) {
//     projectName = projectDetail.project_name || 'Unknown Project';
//     projectCode = projectDetail.project_code;
//   } 
//   // If no project_detail but we have activity with project info
//   else if (log.activity_detail?.project_detail) {
//     projectName = log.activity_detail.project_detail.project_name || 'Unknown Project';
//     projectCode = log.activity_detail.project_detail.project_code;
//     projectId = log.activity_detail.project;
//   }
//   // If activity has project ID but no details
//   else if (log.activity) {
//     projectName = `Activity: ${log.activity_detail?.activity_name || 'Unknown'}`;
//   }
//   // If subactivity has info
//   else if (log.subactivity_detail) {
//     projectName = `SubActivity: ${log.subactivity_detail.subactivity_name}`;
//   }

//   return {
//     id: log.id,
//     event_type: displayEventType,
//     original_event_type: log.event_type,
//     message: log.message,
//     old_value: oldValue,
//     new_value: newValue,
//     created_at: log.created_at,
//     performed_by: log.performed_by,
//     performed_by_detail: log.performed_by_detail,
//     project: projectId,
//     project_detail: projectDetail,
//     activity: log.activity,
//     activity_detail: log.activity_detail,
//     subactivity: log.subactivity,
//     subactivity_detail: log.subactivity_detail,
    
//     // Derived fields for easier display
//     log_type: displayEventType,
//     description: log.message,
//     date: log.created_at?.split('T')[0] || '',
//     time: log.created_at?.split('T')[1]?.substring(0, 5) || '',
//     user: log.performed_by_detail?.username || 'System',
//     user_role: log.performed_by_detail?.role || 'SYSTEM',
//     user_name: log.performed_by_detail?.username || 'System',
//     project_name: projectName,
//     project_code: projectCode,
//     company_name: projectDetail?.company_detail?.name || 
//                    log.activity_detail?.project_detail?.company_detail?.name,
//     sector_name: projectDetail?.sector_detail?.name || 
//                   log.activity_detail?.project_detail?.sector_detail?.name,
//     client_name: projectDetail?.client_detail?.name || 
//                   log.activity_detail?.project_detail?.client_detail?.name,
    
//     // Helper to identify log source
//     log_source: log.project ? 'project' : 
//                 log.activity ? 'activity' : 
//                 log.subactivity ? 'subactivity' : 'unknown',
    
//     // Raw data for debugging (only in development)
//     raw: process.env.NODE_ENV === 'development' ? log : null
//   };
// };

// // Client-side filter function
// const filterLogsClientSide = (logs, filters) => {
//   return logs.filter(log => {
//     // Date filter
//     if (filters.date && log.date !== filters.date) {
//       return false;
//     }
    
//     // Event type filter
//     if (filters.eventType && filters.eventType !== 'all') {
//       const backendEventType = EVENT_TYPE_MAP[filters.eventType];
//       if (log.original_event_type !== backendEventType) {
//         return false;
//       }
//     }
    
//     // Project filter
//     if (filters.projectId && filters.projectId !== 'all') {
//       if (log.project !== filters.projectId && 
//           log.project_detail?.id !== filters.projectId) {
//         return false;
//       }
//     }
    
//     // Search filter
//     if (filters.search) {
//       const searchLower = filters.search.toLowerCase();
//       const matchesSearch = 
//         log.message?.toLowerCase().includes(searchLower) ||
//         log.project_name?.toLowerCase().includes(searchLower) ||
//         log.event_type?.toLowerCase().includes(searchLower) ||
//         log.user?.toLowerCase().includes(searchLower);
      
//       if (!matchesSearch) {
//         return false;
//       }
//     }
    
//     return true;
//   });
// };

// const initialState = {
//   allLogs: [],
//   filteredLogs: [], // Add this for client-side filtering
//   projectLogs: [],
//   pagination: {
//     currentPage: 1,
//     totalPages: 1,
//     totalItems: 0,
//     itemsPerPage: 10,
//     hasNext: false,
//     hasPrev: false,
//     nextPage: null,
//     prevPage: null
//   },
//   loading: false,
//   loadingMore: false,
//   error: null,
//   filters: {
//     date: new Date().toISOString().split('T')[0],
//     eventType: 'all',
//     projectId: 'all',
//     search: ''
//   },
//   stats: {
//     total: 0,
//     byType: {},
//     byProject: {},
//     byDate: {}
//   }
// };

// // Async thunks
// export const fetchAllLogs = createAsyncThunk(
//   'logs/fetchAll',
//   async ({ page = 1, pageSize = 10, append = false, filters = {} } = {}, { getState, rejectWithValue }) => {
//     try {
//       const state = getState();
//       const currentFilters = { ...state.logs.filters, ...filters };
      
//       console.log('Fetching all logs with filters:', {
//         date: currentFilters.date,
//         eventType: currentFilters.eventType,
//         projectId: currentFilters.projectId,
//         search: currentFilters.search,
//         page,
//         pageSize
//       });
      
//       // Always fetch a larger batch to allow client-side filtering
//       const response = await logService.getAllLogs({
//         page: 1,
//         pageSize: 100, // Fetch more logs at once for client-side filtering
//         date: currentFilters.date, // Still send date to API if it works
//         // Don't send event_type if API is ignoring it
//         projectId: currentFilters.projectId !== 'all' ? currentFilters.projectId : undefined,
//         search: currentFilters.search
//       });
      
//       console.log('API Response:', {
//         totalResults: response.results?.length,
//         totalCount: response.count,
//         hasNext: !!response.next
//       });
      
//       const transformedLogs = response.results.map(transformLog);
      
//       // Apply client-side filtering
//       const filteredLogs = filterLogsClientSide(transformedLogs, currentFilters);
      
//       // Paginate the filtered results
//       const start = (page - 1) * pageSize;
//       const end = start + pageSize;
//       const paginatedLogs = filteredLogs.slice(start, end);
      
//       const paginationData = {
//         currentPage: page,
//         totalPages: Math.ceil(filteredLogs.length / pageSize),
//         totalItems: filteredLogs.length,
//         itemsPerPage: pageSize,
//         hasNext: end < filteredLogs.length,
//         hasPrev: page > 1,
//         nextPage: end < filteredLogs.length ? `?page=${page + 1}` : null,
//         prevPage: page > 1 ? `?page=${page - 1}` : null
//       };
      
//       console.log(`Client-side filtered: ${filteredLogs.length} logs, showing page ${page} with ${paginatedLogs.length} logs`);
      
//       return {
//         logs: paginatedLogs,
//         allFilteredLogs: filteredLogs, // Store all filtered logs for stats
//         pagination: paginationData,
//         append
//       };
//     } catch (error) {
//       console.error('Error in fetchAllLogs:', error);
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const fetchProjectLogs = createAsyncThunk(
//   'logs/fetchProjectLogs',
//   async ({ projectId, page = 1, pageSize = 10, append = false, filters = {} } = {}, { getState, rejectWithValue }) => {
//     try {
//       const state = getState();
//       const currentFilters = { ...state.logs.filters, ...filters };
      
//       console.log(`Fetching logs for project: ${projectId} with filters:`, {
//         date: currentFilters.date,
//         eventType: currentFilters.eventType,
//         search: currentFilters.search,
//         page,
//         pageSize
//       });
      
//       // Fetch all logs for this project (without event_type filter)
//       const response = await logService.getProjectLogs(projectId, {
//         page: 1,
//         pageSize: 100, // Fetch more for client-side filtering
//         date: currentFilters.date,
//         // Don't send event_type
//         search: currentFilters.search
//       });
      
//       console.log('API Response:', {
//         totalResults: response.results?.length,
//         totalCount: response.count,
//         hasNext: !!response.next
//       });
      
//       const transformedLogs = response.results.map(transformLog);
      
//       // Apply client-side filtering
//       const filteredLogs = filterLogsClientSide(transformedLogs, currentFilters);
      
//       // Paginate the filtered results
//       const start = (page - 1) * pageSize;
//       const end = start + pageSize;
//       const paginatedLogs = filteredLogs.slice(start, end);
      
//       const paginationData = {
//         currentPage: page,
//         totalPages: Math.ceil(filteredLogs.length / pageSize),
//         totalItems: filteredLogs.length,
//         itemsPerPage: pageSize,
//         hasNext: end < filteredLogs.length,
//         hasPrev: page > 1,
//         nextPage: end < filteredLogs.length ? `?page=${page + 1}` : null,
//         prevPage: page > 1 ? `?page=${page - 1}` : null
//       };
      
//       console.log(`Client-side filtered: ${filteredLogs.length} logs for project ${projectId}, showing page ${page}`);
      
//       return {
//         logs: paginatedLogs,
//         allFilteredLogs: filteredLogs,
//         pagination: paginationData,
//         append,
//         projectId
//       };
//     } catch (error) {
//       console.error('Error in fetchProjectLogs:', error);
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const fetchAllLogsUnfiltered = createAsyncThunk(
//   'logs/fetchAllUnfiltered',
//   async ({ page = 1, pageSize = 50 } = {}, { rejectWithValue }) => {
//     try {
//       const response = await logService.getAllLogsUnfiltered({ page, pageSize });
      
//       const transformedLogs = response.results.map(transformLog);
      
//       console.log('Unfiltered logs count:', transformedLogs.length);
//       return transformedLogs;
//     } catch (error) {
//       console.error('Error in fetchAllLogsUnfiltered:', error);
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const fetchLogStats = createAsyncThunk(
//   'logs/fetchStats',
//   async (projectId = null, { rejectWithValue }) => {
//     try {
//       const response = await logService.getLogStats(projectId);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const createLog = createAsyncThunk(
//   'logs/create',
//   async (logData, { rejectWithValue }) => {
//     try {
//       const response = await logService.createLog(logData);
//       return transformLog(response);
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const deleteLog = createAsyncThunk(
//   'logs/delete',
//   async (logId, { rejectWithValue }) => {
//     try {
//       await logService.deleteLog(logId);
//       return logId;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// const logSlice = createSlice({
//   name: 'logs',
//   initialState,
//   reducers: {
//     setLogFilters: (state, action) => {
//       state.filters = { ...state.filters, ...action.payload };
//     },
//     resetFilters: (state) => {
//       state.filters = {
//         date: new Date().toISOString().split('T')[0],
//         eventType: 'all',
//         projectId: 'all',
//         search: ''
//       };
//     },
//     clearLogs: (state) => {
//       state.allLogs = [];
//       state.filteredLogs = [];
//       state.projectLogs = [];
//       state.pagination = initialState.pagination;
//       state.error = null;
//     },
//     resetPagination: (state) => {
//       state.pagination.currentPage = 1;
//     },
//     calculateStats: (state) => {
//       // Use filteredLogs for stats if available, otherwise use displayed logs
//       const logs = state.filteredLogs.length > 0 ? state.filteredLogs : 
//                   (state.allLogs.length > 0 ? state.allLogs : state.projectLogs);
      
//       state.stats.total = logs.length;
      
//       const byType = {};
//       const byProject = {};
//       const byDate = {};
      
//       logs.forEach(log => {
//         const type = log.event_type || 'UNKNOWN';
//         byType[type] = (byType[type] || 0) + 1;
        
//         const projectName = log.project_name || 'Unknown';
//         byProject[projectName] = (byProject[projectName] || 0) + 1;
        
//         const date = log.date || 'unknown';
//         byDate[date] = (byDate[date] || 0) + 1;
//       });
      
//       state.stats.byType = byType;
//       state.stats.byProject = byProject;
//       state.stats.byDate = byDate;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch all logs
//       .addCase(fetchAllLogs.pending, (state) => {
//         if (state.pagination.currentPage === 1) {
//           state.loading = true;
//         } else {
//           state.loadingMore = true;
//         }
//         state.error = null;
//       })
//       .addCase(fetchAllLogs.fulfilled, (state, action) => {
//         state.loading = false;
//         state.loadingMore = false;
        
//         if (action.payload.append) {
//           state.allLogs = [...state.allLogs, ...action.payload.logs];
//         } else {
//           state.allLogs = action.payload.logs;
//           state.filteredLogs = action.payload.allFilteredLogs || [];
//         }
        
//         state.pagination = action.payload.pagination;
//       })
//       .addCase(fetchAllLogs.rejected, (state, action) => {
//         state.loading = false;
//         state.loadingMore = false;
//         state.error = action.payload;
//       })

//       // Fetch project logs
//       .addCase(fetchProjectLogs.pending, (state) => {
//         if (state.pagination.currentPage === 1) {
//           state.loading = true;
//         } else {
//           state.loadingMore = true;
//         }
//         state.error = null;
//       })
//       .addCase(fetchProjectLogs.fulfilled, (state, action) => {
//         state.loading = false;
//         state.loadingMore = false;
        
//         if (action.payload.append) {
//           state.projectLogs = [...state.projectLogs, ...action.payload.logs];
//         } else {
//           state.projectLogs = action.payload.logs;
//           state.filteredLogs = action.payload.allFilteredLogs || [];
//         }
        
//         state.pagination = action.payload.pagination;
//       })
//       .addCase(fetchProjectLogs.rejected, (state, action) => {
//         state.loading = false;
//         state.loadingMore = false;
//         state.error = action.payload;
//       })

//       // Fetch unfiltered logs (debug)
//       .addCase(fetchAllLogsUnfiltered.fulfilled, (state, action) => {
//         console.log('Unfiltered logs in state:', action.payload.length);
//       })

//       // Fetch stats
//       .addCase(fetchLogStats.fulfilled, (state, action) => {
//         state.stats = action.payload;
//       })

//       // Create log
//       .addCase(createLog.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(createLog.fulfilled, (state, action) => {
//         state.loading = false;
//         state.allLogs.unshift(action.payload);
//         state.filteredLogs.unshift(action.payload);
//         state.projectLogs.unshift(action.payload);
//         state.pagination.totalItems += 1;
//       })
//       .addCase(createLog.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Delete log
//       .addCase(deleteLog.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(deleteLog.fulfilled, (state, action) => {
//         state.loading = false;
//         state.allLogs = state.allLogs.filter(l => l.id !== action.payload);
//         state.filteredLogs = state.filteredLogs.filter(l => l.id !== action.payload);
//         state.projectLogs = state.projectLogs.filter(l => l.id !== action.payload);
//         state.pagination.totalItems -= 1;
//       })
//       .addCase(deleteLog.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   }
// });

// export const { setLogFilters, resetFilters, clearLogs, resetPagination, calculateStats } = logSlice.actions;
// export default logSlice.reducer;



// src/features/dailyLogs/logSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { logService } from '../../services/logService';

// Reverse map for displaying backend values
const REVERSE_EVENT_TYPE_MAP = {
  'PROJECT_CREATED': 'Project Created',
  'PROJECT_UPDATED': 'Project Updated',
  'ACTIVITY_CREATED': 'Activity Created',
  'ACTIVITY_UPDATED': 'Activity Updated',
  'SUBACTIVITY_CREATED': 'SubActivity Created',
  'SUBACTIVITY_UPDATED': 'SubActivity Updated',
  'PROGRESS_CHANGED': 'Progress Changed',
  'EXTENSION_REQUESTED': 'Extension Requested',
  'EXTENSION_APPROVED': 'Extension Approved',
  'EXTENSION_REJECTED': 'Extension Rejected',
  'MANUAL_LOG': 'Manual Log',
  'STATUS_UPDATE': 'Status Update'
};

// Map frontend event type to backend for filtering
const EVENT_TYPE_TO_BACKEND = {
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
  'Manual Log': 'MANUAL_LOG',
  'Status Update': 'STATUS_UPDATE'
};

// Helper function to transform backend log format
const transformLog = (log) => {
  let oldValue = log.old_value;
  let newValue = log.new_value;
  
  try {
    if (typeof oldValue === 'string') oldValue = JSON.parse(oldValue);
    if (typeof newValue === 'string') newValue = JSON.parse(newValue);
  } catch (e) {
    // Ignore parsing errors
  }

  const displayEventType = REVERSE_EVENT_TYPE_MAP[log.event_type] || log.event_type;
  
  let projectId = log.project;
  let projectDetail = log.project_detail;
  let projectName = 'Unknown Project';
  let projectCode = null;

  if (projectDetail) {
    projectName = projectDetail.project_name || 'Unknown Project';
    projectCode = projectDetail.project_code;
  } else if (log.activity_detail?.project_detail) {
    projectName = log.activity_detail.project_detail.project_name || 'Unknown Project';
    projectCode = log.activity_detail.project_detail.project_code;
    projectId = log.activity_detail.project;
  }

  return {
    id: log.id,
    event_type: displayEventType,
    original_event_type: log.event_type,
    message: log.message,
    old_value: oldValue,
    new_value: newValue,
    created_at: log.created_at,
    performed_by: log.performed_by,
    performed_by_detail: log.performed_by_detail,
    project: projectId,
    project_detail: projectDetail,
    activity: log.activity,
    activity_detail: log.activity_detail,
    subactivity: log.subactivity,
    subactivity_detail: log.subactivity_detail,
    date: log.created_at?.split('T')[0] || '',
    time: log.created_at?.split('T')[1]?.substring(0, 5) || '',
    user: log.performed_by_detail?.username || 'System',
    project_name: projectName,
    project_code: projectCode
  };
};

// Client-side filter function
const filterLogs = (logs, filters) => {
  return logs.filter(log => {
    // Date filter
    if (filters.date && log.date !== filters.date) {
      return false;
    }
    
    // Event type filter
    if (filters.eventType && filters.eventType !== 'all') {
      const backendType = EVENT_TYPE_TO_BACKEND[filters.eventType];
      if (log.original_event_type !== backendType) {
        return false;
      }
    }
    
    // Project filter
    if (filters.projectId && filters.projectId !== 'all') {
      if (log.project !== filters.projectId && log.project_detail?.id !== filters.projectId) {
        return false;
      }
    }
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        log.message?.toLowerCase().includes(searchLower) ||
        log.project_name?.toLowerCase().includes(searchLower) ||
        log.event_type?.toLowerCase().includes(searchLower) ||
        log.user?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
};

const initialState = {
  allLogs: [], // All fetched logs (raw)
  filteredLogs: [], // Filtered logs for current view
  projectLogs: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNext: false,
    hasPrev: false
  },
  loading: false,
  loadingMore: false,
  error: null,
  filters: {
    date: new Date().toISOString().split('T')[0],
    eventType: 'all',
    projectId: 'all',
    search: ''
  },
  stats: {
    total: 0,
    byType: {},
    byProject: {},
    byDate: {}
  }
};

// Async thunks
export const fetchAllLogs = createAsyncThunk(
  'logs/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await logService.getAllLogs();
      const transformedLogs = response.results.map(transformLog);
      return transformedLogs;
    } catch (error) {
      console.error('Error in fetchAllLogs:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchProjectLogs = createAsyncThunk(
  'logs/fetchProjectLogs',
  async ({ projectId, date, eventType, search }, { rejectWithValue }) => {
    try {
      const response = await logService.getProjectLogs(projectId, {
        date,
        eventType,
        search
      });
      const transformedLogs = response.results.map(transformLog);
      return { logs: transformedLogs, projectId };
    } catch (error) {
      console.error('Error in fetchProjectLogs:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createLog = createAsyncThunk(
  'logs/create',
  async (logData, { rejectWithValue }) => {
    try {
      const response = await logService.createLog(logData);
      return transformLog(response);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteLog = createAsyncThunk(
  'logs/delete',
  async (logId, { rejectWithValue }) => {
    try {
      await logService.deleteLog(logId);
      return logId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const logSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    setLogFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      // Apply client-side filtering
      state.filteredLogs = filterLogs(state.allLogs, state.filters);
      // Reset pagination
      state.pagination.currentPage = 1;
      state.pagination.totalItems = state.filteredLogs.length;
      state.pagination.totalPages = Math.ceil(state.filteredLogs.length / state.pagination.itemsPerPage);
      state.pagination.hasNext = state.pagination.currentPage < state.pagination.totalPages;
      state.pagination.hasPrev = state.pagination.currentPage > 1;
    },
    resetFilters: (state) => {
      state.filters = {
        date: new Date().toISOString().split('T')[0],
        eventType: 'all',
        projectId: 'all',
        search: ''
      };
      state.filteredLogs = filterLogs(state.allLogs, state.filters);
      state.pagination.currentPage = 1;
      state.pagination.totalItems = state.filteredLogs.length;
      state.pagination.totalPages = Math.ceil(state.filteredLogs.length / state.pagination.itemsPerPage);
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
      state.pagination.hasNext = state.pagination.currentPage < state.pagination.totalPages;
      state.pagination.hasPrev = state.pagination.currentPage > 1;
    },
    nextPage: (state) => {
      if (state.pagination.currentPage < state.pagination.totalPages) {
        state.pagination.currentPage++;
        state.pagination.hasNext = state.pagination.currentPage < state.pagination.totalPages;
        state.pagination.hasPrev = true;
      }
    },
    prevPage: (state) => {
      if (state.pagination.currentPage > 1) {
        state.pagination.currentPage--;
        state.pagination.hasNext = state.pagination.currentPage < state.pagination.totalPages;
        state.pagination.hasPrev = state.pagination.currentPage > 1;
      }
    },
    clearLogs: (state) => {
      state.allLogs = [];
      state.filteredLogs = [];
      state.projectLogs = [];
      state.pagination = initialState.pagination;
      state.error = null;
    },
    calculateStats: (state) => {
      const logs = state.filteredLogs.length > 0 ? state.filteredLogs : state.allLogs;
      
      state.stats.total = logs.length;
      
      const byType = {};
      const byProject = {};
      const byDate = {};
      
      logs.forEach(log => {
        const type = log.event_type || 'UNKNOWN';
        byType[type] = (byType[type] || 0) + 1;
        
        const projectName = log.project_name || 'Unknown';
        byProject[projectName] = (byProject[projectName] || 0) + 1;
        
        const date = log.date || 'unknown';
        byDate[date] = (byDate[date] || 0) + 1;
      });
      
      state.stats.byType = byType;
      state.stats.byProject = byProject;
      state.stats.byDate = byDate;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.allLogs = action.payload;
        // Apply current filters
        state.filteredLogs = filterLogs(state.allLogs, state.filters);
        state.pagination.totalItems = state.filteredLogs.length;
        state.pagination.totalPages = Math.ceil(state.filteredLogs.length / state.pagination.itemsPerPage);
        state.pagination.currentPage = 1;
      })
      .addCase(fetchAllLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProjectLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.projectLogs = action.payload.logs;
        state.pagination.totalItems = action.payload.logs.length;
        state.pagination.totalPages = Math.ceil(action.payload.logs.length / state.pagination.itemsPerPage);
        state.pagination.currentPage = 1;
      })
      .addCase(fetchProjectLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createLog.fulfilled, (state, action) => {
        state.allLogs.unshift(action.payload);
        state.filteredLogs = filterLogs(state.allLogs, state.filters);
        state.pagination.totalItems = state.filteredLogs.length;
        state.pagination.totalPages = Math.ceil(state.filteredLogs.length / state.pagination.itemsPerPage);
      })
      .addCase(deleteLog.fulfilled, (state, action) => {
        state.allLogs = state.allLogs.filter(l => l.id !== action.payload);
        state.filteredLogs = filterLogs(state.allLogs, state.filters);
        state.pagination.totalItems = state.filteredLogs.length;
        state.pagination.totalPages = Math.ceil(state.filteredLogs.length / state.pagination.itemsPerPage);
      });
  }
});

export const { 
  setLogFilters, 
  resetFilters, 
  setPage, 
  nextPage, 
  prevPage, 
  clearLogs, 
  calculateStats 
} = logSlice.actions;

export default logSlice.reducer;