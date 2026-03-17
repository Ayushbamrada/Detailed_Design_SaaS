import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { companyService } from '../../services/companyService';
import { subCompanyService } from '../../services/subCompanyService';
import { sectorService } from '../../services/sectorService';
import { clientService } from '../../services/clientService';
import { activityService } from '../../services/activityService';
import { subActivityService } from '../../services/subActivityService';
import { projectService } from '../../services/projectService';

// Initial state
const initialState = {
  companies: [],
  subCompanies: [],
  sectors: [],
  clients: [],
  activities: [],
  subActivities: [],
  projects: [],
  loading: false,
  error: null,
};

// Async thunks for companies
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

// Async thunks for sub companies
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

// Async thunks for sectors
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

// Async thunks for clients
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

// Async thunks for activities
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

// Async thunks for sub activities
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

// Async thunks for projects
export const fetchProjects = createAsyncThunk(
  'api/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await projectService.getProjects();
      // Ensure we always have an array
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
  },
  extraReducers: (builder) => {
    builder
      // Companies
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
        state.companies.push(action.payload);
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        const index = state.companies.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.companies = state.companies.filter(c => c.id !== action.payload);
      })

      // Sub Companies
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
        state.subCompanies.push(action.payload);
      })

      // Sectors
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
        state.sectors.push(action.payload);
      })

      // Clients
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
        state.clients.push(action.payload);
      })

      // Activities
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
        state.activities.push(action.payload);
      })

      // Sub Activities
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
        state.subActivities.push(action.payload);
      })

      // Projects
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
        if (action.payload) {
          state.projects.push(action.payload);
        }
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(p => p.id !== action.payload);
      });
  },
});

export const { clearError, clearProjects } = apiSlice.actions;
export default apiSlice.reducer;