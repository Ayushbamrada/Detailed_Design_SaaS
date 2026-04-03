import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { companyService } from '../../services/companyService';
import { subCompanyService } from '../../services/subCompanyService';
import { sectorService } from '../../services/sectorService';
import { clientService } from '../../services/clientService';
import { tlService } from '../../services/tlservices';
import { activityService } from '../../services/activityService';
import { subActivityService } from '../../services/subActivityService';
import { projectService } from '../../services/projectService';
import { projectWorkSummaryService } from '../../services/projectWorkSummaryService';


const initialState = {
  companies: [],
  subCompanies: [],
  sectors: [],
  clients: [],
  tls: [],
  activities: [],
  subActivities: [],
  projectWorkSummary: null,
  projects: [],
  loading: false,
  error: null,
};


export const fetchProjectWorkSummary = createAsyncThunk(
  'api/fetchProjectWorkSummary',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await projectWorkSummaryService.getProjectWorkSummary(projectId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ============ COMPANY THUNKS ============
export const fetchCompanies = createAsyncThunk(
  'api/fetchCompanies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await companyService.getCompanies();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createCompany = createAsyncThunk(
  'api/createCompany',
  async (companyData, { rejectWithValue }) => {
    try {
      const response = await companyService.createCompany(companyData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCompany = createAsyncThunk(
  'api/updateCompany',
  async ({ companyId, companyData }, { rejectWithValue }) => {
    try {
      const response = await companyService.updateCompany(companyId, companyData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCompany = createAsyncThunk(
  'api/deleteCompany',
  async (companyId, { rejectWithValue }) => {
    try {
      await companyService.deleteCompany(companyId);
      return companyId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ============ SUB COMPANY THUNKS ============
export const fetchSubCompanies = createAsyncThunk(
  'api/fetchSubCompanies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subCompanyService.getSubCompanies();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createSubCompany = createAsyncThunk(
  'api/createSubCompany',
  async (subCompanyData, { rejectWithValue }) => {
    try {
      const response = await subCompanyService.createSubCompany(subCompanyData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ============ SECTOR THUNKS ============
export const fetchSectors = createAsyncThunk(
  'api/fetchSectors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await sectorService.getSectors();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createSector = createAsyncThunk(
  'api/createSector',
  async (sectorData, { rejectWithValue }) => {
    try {
      const response = await sectorService.createSector(sectorData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ============ CLIENT THUNKS ============
export const fetchClients = createAsyncThunk(
  'api/fetchClients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await clientService.getClients();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createClient = createAsyncThunk(
  'api/createClient',
  async (clientData, { rejectWithValue }) => {
    try {
      const response = await clientService.createClient(clientData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ============ ACTIVITY THUNKS ============
export const fetchActivities = createAsyncThunk(
  'api/fetchActivities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await activityService.getActivities();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createActivity = createAsyncThunk(
  'api/createActivity',
  async (activityData, { rejectWithValue }) => {
    try {
      const response = await activityService.createActivity(activityData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createActivitiesBulk = createAsyncThunk(
  'api/createActivitiesBulk',
  async (activitiesData, { rejectWithValue }) => {
    try {
      const response = await activityService.createActivitiesBulk(activitiesData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateActivityProgress = createAsyncThunk(
  'api/updateActivityProgress',
  async ({ activityId, progressData }, { rejectWithValue }) => {
    try {
      const response = await activityService.updateActivityProgress(activityId, progressData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// Tls thunks 
export const fetchTls = createAsyncThunk(
  'wfm/ourcompanyuserlessdetail/null/null/',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tlService.getTls();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ============ SUB-ACTIVITY THUNKS ============
export const fetchSubActivities = createAsyncThunk(
  'api/fetchSubActivities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subActivityService.getSubActivities();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createSubActivity = createAsyncThunk(
  'api/createSubActivity',
  async (subActivityData, { rejectWithValue }) => {
    try {
      const response = await subActivityService.createSubActivity(subActivityData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createSubActivitiesBulk = createAsyncThunk(
  'api/createSubActivitiesBulk',
  async (subActivitiesData, { rejectWithValue }) => {
    try {
      const response = await subActivityService.createSubActivitiesBulk(subActivitiesData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateSubActivityProgress = createAsyncThunk(
  'api/updateSubActivityProgress',
  async ({ subActivityId, progressData }, { rejectWithValue }) => {
    try {
      const response = await subActivityService.updateSubActivityProgress(subActivityId, progressData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateSubActivityStatus = createAsyncThunk(
  'api/updateSubActivityStatus',
  async ({ subActivityId, statusData }, { rejectWithValue }) => {
    try {
      const response = await subActivityService.updateSubActivityStatus(subActivityId, statusData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ============ PROJECT THUNKS ============
export const fetchProjects = createAsyncThunk(
  'api/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await projectService.getProjects();
      return Array.isArray(response) ? response : [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createProject = createAsyncThunk(
  'api/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await projectService.createProject(projectData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProject = createAsyncThunk(
  'api/updateProject',
  async ({ projectId, projectData }, { rejectWithValue }) => {
    try {
      const response = await projectService.updateProject(projectId, projectData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProjectProgress = createAsyncThunk(
  'api/updateProjectProgress',
  async ({ projectId, progressData }, { rejectWithValue }) => {
    try {
      const response = await projectService.updateProjectProgress(projectId, progressData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteProject = createAsyncThunk(
  'api/deleteProject',
  async (projectId, { rejectWithValue }) => {
    try {
      await projectService.deleteProject(projectId);
      return projectId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Helper function to add unique items to array
const addUniqueItems = (state, newItems, key = 'id') => {
  if (!newItems) return;

  const itemsToAdd = Array.isArray(newItems) ? newItems : [newItems];

  itemsToAdd.forEach(newItem => {
    if (!newItem || !newItem[key]) return;

    const exists = state.some(existingItem => existingItem[key] === newItem[key]);
    if (!exists) {
      state.push(newItem);
    }
  });
};

// Helper function to update item in array
const updateItemInArray = (array, updatedItem, key = 'id') => {
  const index = array.findIndex(item => item[key] === updatedItem[key]);
  if (index !== -1) {
    array[index] = updatedItem;
  }
};

// Create the slice
const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProjects: (state) => {
      state.projects = [];
    },
    clearActivities: (state) => {
      state.activities = [];
    },
    clearSubActivities: (state) => {
      state.subActivities = [];
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchProjectWorkSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectWorkSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.projectWorkSummary = action.payload; // Add this to initialState
      })
      .addCase(fetchProjectWorkSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ============ COMPANIES ============
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        addUniqueItems(state.companies, action.payload);
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        updateItemInArray(state.companies, action.payload);
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.companies = state.companies.filter(c => c.id !== action.payload);
      })

      // ============ SUB COMPANIES ============
      .addCase(fetchSubCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.subCompanies = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSubCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSubCompany.fulfilled, (state, action) => {
        addUniqueItems(state.subCompanies, action.payload);
      })

      // ============ SECTORS ============
      .addCase(fetchSectors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSectors.fulfilled, (state, action) => {
        state.loading = false;
        state.sectors = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSectors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSector.fulfilled, (state, action) => {
        addUniqueItems(state.sectors, action.payload);
      })

      // ============ CLIENTS ============
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        addUniqueItems(state.clients, action.payload);
      })

      // Tls

      .addCase(fetchTls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTls.fulfilled, (state, action) => {
        state.loading = false;
        state.tls = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // ============ ACTIVITIES ============
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        addUniqueItems(state.activities, action.payload);
      })
      .addCase(createActivitiesBulk.fulfilled, (state, action) => {
        addUniqueItems(state.activities, action.payload);
      })
      .addCase(updateActivityProgress.fulfilled, (state, action) => {
        updateItemInArray(state.activities, action.payload);
      })

      // ============ SUB ACTIVITIES ============
      .addCase(fetchSubActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.subActivities = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSubActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSubActivity.fulfilled, (state, action) => {
        addUniqueItems(state.subActivities, action.payload);
      })
      .addCase(createSubActivitiesBulk.fulfilled, (state, action) => {
        addUniqueItems(state.subActivities, action.payload);
      })
      .addCase(updateSubActivityProgress.fulfilled, (state, action) => {
        updateItemInArray(state.subActivities, action.payload);
      })
      .addCase(updateSubActivityStatus.fulfilled, (state, action) => {
        updateItemInArray(state.subActivities, action.payload);
      })

      // ============ PROJECTS ============
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        addUniqueItems(state.projects, action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        updateItemInArray(state.projects, action.payload);
      })
      .addCase(updateProjectProgress.fulfilled, (state, action) => {
        updateItemInArray(state.projects, action.payload);
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(p => p.id !== action.payload);
      });
  },
});

export const { clearError, clearProjects, clearActivities, clearSubActivities } = apiSlice.actions;
export default apiSlice.reducer;