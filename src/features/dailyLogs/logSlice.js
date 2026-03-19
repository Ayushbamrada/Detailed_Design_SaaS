// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { logService } from '../../services/logService';

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

//   return {
//     id: log.id,
//     event_type: log.event_type,
//     message: log.message,
//     old_value: oldValue,
//     new_value: newValue,
//     created_at: log.created_at,
//     performed_by: log.performed_by,
//     performed_by_detail: log.performed_by_detail,
//     project: log.project,
//     project_detail: log.project_detail,
//     activity: log.activity,
//     activity_detail: log.activity_detail,
//     subactivity: log.subactivity,
//     subactivity_detail: log.subactivity_detail,
    
//     // Derived fields for easier display
//     log_type: log.event_type,
//     description: log.message,
//     date: log.created_at,
//     user: log.performed_by_detail?.username || 'System',
//     user_role: log.performed_by_detail?.role || 'SYSTEM',
//     project_name: log.project_detail?.project_name || 'Unknown Project',
//     project_code: log.project_detail?.project_code,
//     company_name: log.project_detail?.company_detail?.name,
//     sector_name: log.project_detail?.sector_detail?.name,
//     client_name: log.project_detail?.client_detail?.name
//   };
// };

// const initialState = {
//   allLogs: [],
//   projectLogs: [],
//   pagination: {
//     currentPage: 1,
//     totalPages: 1,
//     totalItems: 0,
//     itemsPerPage: 20,
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
//   async ({ page = 1, pageSize = 20, append = false, filters = {} } = {}, { getState, rejectWithValue }) => {
//     try {
//       const state = getState();
//       const currentFilters = { ...state.logs.filters, ...filters };
      
//       const response = await logService.getAllLogs({
//         page,
//         pageSize,
//         date: currentFilters.date,
//         eventType: currentFilters.eventType,
//         projectId: currentFilters.projectId,
//         search: currentFilters.search
//       });
      
//       // Handle response that might be paginated or direct array
//       let transformedLogs = [];
//       let paginationData = {
//         currentPage: page,
//         totalPages: 1,
//         totalItems: 0,
//         itemsPerPage: pageSize,
//         hasNext: false,
//         hasPrev: false,
//         nextPage: null,
//         prevPage: null
//       };
      
//       if (response.results) {
//         // Paginated response
//         transformedLogs = response.results.map(transformLog);
//         paginationData = {
//           currentPage: response.current_page || page,
//           totalPages: response.total_pages || 1,
//           totalItems: response.count || 0,
//           itemsPerPage: pageSize,
//           hasNext: !!response.next,
//           hasPrev: !!response.previous,
//           nextPage: response.next,
//           prevPage: response.previous
//         };
//       } else if (Array.isArray(response)) {
//         // Direct array response
//         transformedLogs = response.map(transformLog);
//         paginationData.totalItems = transformedLogs.length;
//       }
      
//       return {
//         logs: transformedLogs,
//         pagination: paginationData,
//         append
//       };
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const fetchProjectLogs = createAsyncThunk(
//   'logs/fetchProjectLogs',
//   async ({ projectId, page = 1, pageSize = 20, append = false, filters = {} } = {}, { getState, rejectWithValue }) => {
//     try {
//       const state = getState();
//       const currentFilters = { ...state.logs.filters, ...filters };
      
//       const response = await logService.getProjectLogs(projectId, {
//         page,
//         pageSize,
//         date: currentFilters.date,
//         eventType: currentFilters.eventType,
//         search: currentFilters.search
//       });
      
//       // Handle response that might be paginated or direct array
//       let transformedLogs = [];
//       let paginationData = {
//         currentPage: page,
//         totalPages: 1,
//         totalItems: 0,
//         itemsPerPage: pageSize,
//         hasNext: false,
//         hasPrev: false,
//         nextPage: null,
//         prevPage: null
//       };
      
//       if (response.results) {
//         // Paginated response
//         transformedLogs = response.results.map(transformLog);
//         paginationData = {
//           currentPage: response.current_page || page,
//           totalPages: response.total_pages || 1,
//           totalItems: response.count || 0,
//           itemsPerPage: pageSize,
//           hasNext: !!response.next,
//           hasPrev: !!response.previous,
//           nextPage: response.next,
//           prevPage: response.previous
//         };
//       } else if (Array.isArray(response)) {
//         // Direct array response
//         transformedLogs = response.map(transformLog);
//         paginationData.totalItems = transformedLogs.length;
//       }
      
//       return {
//         logs: transformedLogs,
//         pagination: paginationData,
//         append,
//         projectId
//       };
//     } catch (error) {
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
        
//         const projectName = log.project_detail?.project_name || 'Unknown';
//         byProject[projectName] = (byProject[projectName] || 0) + 1;
        
//         const date = log.created_at?.split('T')[0] || 'unknown';
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
//           // Append mode (infinite scroll)
//           state.allLogs = [...state.allLogs, ...action.payload.logs];
//         } else {
//           // Replace mode (new filters)
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

// src/features/dailyLogs/logSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { logService } from '../../services/logService';

// Helper function to transform backend log format to frontend format
const transformLog = (log) => {
  // Parse old and new values if they're strings
  let oldValue = log.old_value;
  let newValue = log.new_value;
  
  try {
    if (typeof oldValue === 'string') oldValue = JSON.parse(oldValue);
    if (typeof newValue === 'string') newValue = JSON.parse(newValue);
  } catch (e) {
    // Ignore parsing errors
  }

  // Determine project details from various sources
  let projectId = log.project;
  let projectDetail = log.project_detail;
  let projectName = 'Unknown Project';
  let projectCode = null;

  // If we have project_detail, use it
  if (projectDetail) {
    projectName = projectDetail.project_name || 'Unknown Project';
    projectCode = projectDetail.project_code;
  } 
  // If no project_detail but we have activity with project info
  else if (log.activity_detail?.project_detail) {
    projectName = log.activity_detail.project_detail.project_name || 'Unknown Project';
    projectCode = log.activity_detail.project_detail.project_code;
    projectId = log.activity_detail.project;
  }
  // If activity has project ID but no details
  else if (log.activity) {
    projectName = `Activity: ${log.activity_detail?.activity_name || 'Unknown'}`;
  }
  // If subactivity has info
  else if (log.subactivity_detail) {
    projectName = `SubActivity: ${log.subactivity_detail.subactivity_name}`;
  }

  return {
    id: log.id,
    event_type: log.event_type,
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
    
    // Derived fields for easier display
    log_type: log.event_type,
    description: log.message,
    date: log.created_at,
    user: log.performed_by_detail?.username || 'System',
    user_role: log.performed_by_detail?.role || 'SYSTEM',
    user_name: log.performed_by_detail?.username || 'System',
    project_name: projectName,
    project_code: projectCode,
    company_name: projectDetail?.company_detail?.name || 
                   log.activity_detail?.project_detail?.company_detail?.name,
    sector_name: projectDetail?.sector_detail?.name || 
                  log.activity_detail?.project_detail?.sector_detail?.name,
    client_name: projectDetail?.client_detail?.name || 
                  log.activity_detail?.project_detail?.client_detail?.name,
    
    // Helper to identify log source
    log_source: log.project ? 'project' : 
                log.activity ? 'activity' : 
                log.subactivity ? 'subactivity' : 'unknown',
    
    // Raw data for debugging
    raw: process.env.NODE_ENV === 'development' ? log : null
  };
};

const initialState = {
  allLogs: [],
  projectLogs: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
    hasNext: false,
    hasPrev: false,
    nextPage: null,
    prevPage: null
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
  async ({ page = 1, pageSize = 20, append = false, filters = {} } = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const currentFilters = { ...state.logs.filters, ...filters };
      
      const response = await logService.getAllLogs({
        page,
        pageSize,
        date: currentFilters.date,
        eventType: currentFilters.eventType,
        projectId: currentFilters.projectId,
        search: currentFilters.search
      });
      
      let transformedLogs = [];
      let paginationData = {
        currentPage: page,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: pageSize,
        hasNext: false,
        hasPrev: false,
        nextPage: null,
        prevPage: null
      };
      
      if (response.results) {
        // Paginated response
        transformedLogs = response.results.map(transformLog);
        paginationData = {
          currentPage: response.current_page || page,
          totalPages: response.total_pages || 1,
          totalItems: response.count || 0,
          itemsPerPage: pageSize,
          hasNext: !!response.next,
          hasPrev: !!response.previous,
          nextPage: response.next,
          prevPage: response.previous
        };
      } else if (Array.isArray(response)) {
        // Direct array response
        transformedLogs = response.map(transformLog);
        paginationData.totalItems = transformedLogs.length;
      }
      
      console.log(`Fetched ${transformedLogs.length} logs`);
      
      return {
        logs: transformedLogs,
        pagination: paginationData,
        append
      };
    } catch (error) {
      console.error('Error in fetchAllLogs:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchProjectLogs = createAsyncThunk(
  'logs/fetchProjectLogs',
  async ({ projectId, page = 1, pageSize = 20, append = false, filters = {} } = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const currentFilters = { ...state.logs.filters, ...filters };
      
      console.log(`Fetching logs for project: ${projectId} with filters:`, currentFilters);
      
      // First try with project filter
      const response = await logService.getProjectLogs(projectId, {
        page,
        pageSize,
        date: currentFilters.date,
        eventType: currentFilters.eventType,
        search: currentFilters.search
      });
      
      let transformedLogs = [];
      let paginationData = {
        currentPage: page,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: pageSize,
        hasNext: false,
        hasPrev: false,
        nextPage: null,
        prevPage: null
      };
      
      if (response.results) {
        transformedLogs = response.results.map(transformLog);
        paginationData = {
          currentPage: response.current_page || page,
          totalPages: response.total_pages || 1,
          totalItems: response.count || 0,
          itemsPerPage: pageSize,
          hasNext: !!response.next,
          hasPrev: !!response.previous,
          nextPage: response.next,
          prevPage: response.previous
        };
      } else if (Array.isArray(response)) {
        transformedLogs = response.map(transformLog);
        paginationData.totalItems = transformedLogs.length;
      }
      
      console.log(`Fetched ${transformedLogs.length} logs for project ${projectId}`);
      
      return {
        logs: transformedLogs,
        pagination: paginationData,
        append,
        projectId
      };
    } catch (error) {
      console.error('Error in fetchProjectLogs:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAllLogsUnfiltered = createAsyncThunk(
  'logs/fetchAllUnfiltered',
  async ({ page = 1, pageSize = 50 } = {}, { rejectWithValue }) => {
    try {
      const response = await logService.getAllLogsUnfiltered({ page, pageSize });
      
      let transformedLogs = [];
      if (response.results) {
        transformedLogs = response.results.map(transformLog);
      } else if (Array.isArray(response)) {
        transformedLogs = response.map(transformLog);
      }
      
      console.log('Unfiltered logs:', transformedLogs);
      return transformedLogs;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchLogStats = createAsyncThunk(
  'logs/fetchStats',
  async (projectId = null, { rejectWithValue }) => {
    try {
      const response = await logService.getLogStats(projectId);
      return response;
    } catch (error) {
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
    },
    resetFilters: (state) => {
      state.filters = {
        date: new Date().toISOString().split('T')[0],
        eventType: 'all',
        projectId: 'all',
        search: ''
      };
    },
    clearLogs: (state) => {
      state.allLogs = [];
      state.projectLogs = [];
      state.pagination = initialState.pagination;
      state.error = null;
    },
    resetPagination: (state) => {
      state.pagination.currentPage = 1;
    },
    calculateStats: (state) => {
      const logs = state.allLogs.length > 0 ? state.allLogs : state.projectLogs;
      
      state.stats.total = logs.length;
      
      const byType = {};
      const byProject = {};
      const byDate = {};
      
      logs.forEach(log => {
        const type = log.event_type || 'UNKNOWN';
        byType[type] = (byType[type] || 0) + 1;
        
        const projectName = log.project_name || 'Unknown';
        byProject[projectName] = (byProject[projectName] || 0) + 1;
        
        const date = log.created_at?.split('T')[0] || 'unknown';
        byDate[date] = (byDate[date] || 0) + 1;
      });
      
      state.stats.byType = byType;
      state.stats.byProject = byProject;
      state.stats.byDate = byDate;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all logs
      .addCase(fetchAllLogs.pending, (state) => {
        if (state.pagination.currentPage === 1) {
          state.loading = true;
        } else {
          state.loadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchAllLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        
        if (action.payload.append) {
          state.allLogs = [...state.allLogs, ...action.payload.logs];
        } else {
          state.allLogs = action.payload.logs;
        }
        
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllLogs.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload;
      })

      // Fetch project logs
      .addCase(fetchProjectLogs.pending, (state) => {
        if (state.pagination.currentPage === 1) {
          state.loading = true;
        } else {
          state.loadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchProjectLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        
        if (action.payload.append) {
          state.projectLogs = [...state.projectLogs, ...action.payload.logs];
        } else {
          state.projectLogs = action.payload.logs;
        }
        
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProjectLogs.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload;
      })

      // Fetch unfiltered logs (debug)
      .addCase(fetchAllLogsUnfiltered.fulfilled, (state, action) => {
        console.log('Unfiltered logs in state:', action.payload);
      })

      // Fetch stats
      .addCase(fetchLogStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })

      // Create log
      .addCase(createLog.pending, (state) => {
        state.loading = true;
      })
      .addCase(createLog.fulfilled, (state, action) => {
        state.loading = false;
        state.allLogs.unshift(action.payload);
        state.projectLogs.unshift(action.payload);
        state.pagination.totalItems += 1;
      })
      .addCase(createLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete log
      .addCase(deleteLog.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteLog.fulfilled, (state, action) => {
        state.loading = false;
        state.allLogs = state.allLogs.filter(l => l.id !== action.payload);
        state.projectLogs = state.projectLogs.filter(l => l.id !== action.payload);
        state.pagination.totalItems -= 1;
      })
      .addCase(deleteLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setLogFilters, resetFilters, clearLogs, resetPagination, calculateStats } = logSlice.actions;
export default logSlice.reducer;