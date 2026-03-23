// import { createSlice } from "@reduxjs/toolkit";

// const savedUser = localStorage.getItem("user");

// const initialState = {
//   user: savedUser ? JSON.parse(savedUser) : null,
//   token: savedUser ? JSON.parse(savedUser).token : null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     loginSuccess: (state, action) => {
//       state.user = action.payload;
//       state.token = action.payload.token;
//       localStorage.setItem("user", JSON.stringify(action.payload));
//     },
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       localStorage.removeItem("user");
//     },
//   },
// });

// export const { loginSuccess, logout } = authSlice.actions;
// export default authSlice.reducer;
// src/features/auth/authSlice.js
// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";
import { showSuccess, showError, showLoading, dismissToast } from "../../utils/toast";

// Role mapping function - converts HRMS roles to app roles
const mapHRMSRoleToAppRole = (hrmsRole, additionalData = {}) => {
  console.log('mapHRMSRoleToAppRole called with:', { hrmsRole, additionalData });
  
  if (!hrmsRole) {
    console.log('No HRMS role provided, defaulting to USER');
    return 'USER';
  }
  
  const roleLower = hrmsRole.toLowerCase().trim();
  console.log('Role (lowercase):', roleLower);
  
  // Check for SUPER_ADMIN first (highest priority)
  if (roleLower.includes('super_admin') || 
      roleLower.includes('super admin') || 
      roleLower.includes('superadmin')) {
    console.log('Matched SUPER_ADMIN');
    return 'SUPER_ADMIN';
  }
  
  // Check for ADMIN
  if (roleLower.includes('admin') || 
      roleLower.includes('administrator')) {
    console.log('Matched ADMIN');
    return 'ADMIN';
  }
  
  // Check for USER/Employee
  if (roleLower.includes('user') || 
      roleLower.includes('employee') || 
      roleLower.includes('staff') ||
      roleLower === 'employee') {
    console.log('Matched USER');
    return 'USER';
  }
  
  // Also check site management role if provided
  if (additionalData.sitemanagement_role) {
    const siteRole = additionalData.sitemanagement_role.toLowerCase();
    console.log('Site role:', siteRole);
    if (siteRole.includes('super_admin')) return 'SUPER_ADMIN';
    if (siteRole.includes('admin')) return 'ADMIN';
  }
  
  console.log('No match found, defaulting to USER');
  return 'USER';
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    const loadingToast = showLoading('Logging in...');
    
    try {
      console.log('1. Attempting login with email:', email);
      const response = await authService.login(email, password);
      
      dismissToast(loadingToast);
      console.log('2. Login response received:', response);

      // Validate response
      if (!response || !response.access) {
        throw new Error('Invalid response from server');
      }

      // Extract data from response
      const { access, refresh, payload, employeecode, payload_a } = response;

      console.log('3. Extracted data:', {
        payload,
        employeecode,
        payload_a
      });

      // Map the role from HRMS to app role
      const appRole = mapHRMSRoleToAppRole(payload?.role, payload_a);
      
      console.log('4. Role mapping result:', {
        hrmsRole: payload?.role,
        appRole: appRole,
        siteRole: payload_a?.sitemanagement_role
      });

      // Store in localStorage (persistent)
      localStorage.setItem('authToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('userEmail', payload?.email || '');
      localStorage.setItem('userName', payload?.name || payload_a?.name || 'User');
      localStorage.setItem('userRole', appRole); // ← THIS IS CRITICAL
      
      // Store original HRMS role for reference
      if (payload?.role) {
        localStorage.setItem('hrmsOriginalRole', payload.role);
      }

      // Store session data in sessionStorage
      if (payload_a) {
        const sessionData = {
          emp_code: employeecode || payload_a?.emp_code || '',
          department: payload_a?.department_name || '',
          department_id: payload_a?.department || '',
          rh: payload_a?.rh_name || payload_a?.reporting_head || '',
          is_rh: payload_a?.is_reporthead || false,
          profilepic: payload_a?.profilepic || '',
          company: payload_a?.division_name || '',
          company_id: payload_a?.sub_company_id || '',
          designation: payload_a?.designation_name || '',
          hrms_role: payload?.role || '',
        };

        Object.entries(sessionData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            sessionStorage.setItem(key, String(value));
          }
        });
      }

      // Verify storage was set correctly
      console.log('5. localStorage after setting:', {
        userRole: localStorage.getItem('userRole'),
        userEmail: localStorage.getItem('userEmail'),
        userName: localStorage.getItem('userName')
      });

      showSuccess('Login successful! Redirecting to dashboard...');

      // Return formatted user data
      return {
        user: {
          id: employeecode || payload_a?.emp_code || '',
          email: payload?.email || '',
          name: payload?.name || payload_a?.name || 'User',
          role: appRole, // ← THIS MUST BE THE MAPPED ROLE
          originalRole: payload?.role || '',
          department: payload_a?.department_name || '',
          company: payload_a?.division_name || '',
          profilePic: payload_a?.profilepic || '',
          isReportingHead: payload_a?.is_reporthead || false,
          designation: payload_a?.designation_name || '',
        },
        token: access,
        refreshToken: refresh,
      };
    } catch (error) {
      dismissToast(loadingToast);
      
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.response) {
        errorMessage = error.response.data?.message || 
                      error.response.data?.detail || 
                      error.response.data?.error ||
                      `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your internet connection.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      console.error('Login error:', error);
      showError(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Check if user is already logged in (for page refresh)
const loadUserFromStorage = () => {
  try {
    const token = localStorage.getItem('authToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const email = localStorage.getItem('userEmail');
    const name = localStorage.getItem('userName');
    const role = localStorage.getItem('userRole'); // ← THIS SHOULD BE MAPPED ROLE
    const originalRole = localStorage.getItem('hrmsOriginalRole');
    
    console.log('loadUserFromStorage - retrieved:', {
      token: !!token,
      refreshToken: !!refreshToken,
      email,
      name,
      role,
      originalRole
    });
    
    // Get session data if available
    const empCode = sessionStorage.getItem('emp_code');
    const department = sessionStorage.getItem('department');
    const company = sessionStorage.getItem('company');
    const profilePic = sessionStorage.getItem('profilepic');
    const isReportingHead = sessionStorage.getItem('is_rh') === 'true';
    const designation = sessionStorage.getItem('designation');
    
    if (token && email) {
      return {
        user: {
          id: empCode || '',
          email: email || '',
          name: name || 'User',
          role: role || 'USER', // ← USE MAPPED ROLE
          originalRole: originalRole || '',
          department: department || '',
          company: company || '',
          profilePic: profilePic || '',
          isReportingHead: isReportingHead || false,
          designation: designation || '',
        },
        token: token,
        refreshToken: refreshToken,
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('Error loading user from storage:', error);
    localStorage.clear();
    sessionStorage.clear();
  }
  
  return null;
};

const initialState = loadUserFromStorage() || {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Log initial state
console.log('authSlice initialState:', initialState);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.clear();
      sessionStorage.clear();
      
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      
      console.log('User logged out, storage cleared');
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        
        if (action.payload.name) {
          localStorage.setItem('userName', action.payload.name);
        }
        if (action.payload.profilePic) {
          sessionStorage.setItem('profilepic', action.payload.profilePic);
        }
        if (action.payload.role) {
          localStorage.setItem('userRole', action.payload.role);
        }
      }
    },
    
    refreshTokenSuccess: (state, action) => {
      state.token = action.payload.token;
      localStorage.setItem('authToken', action.payload.token);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
        
        console.log('Login successful, user state updated:', state.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
        state.isAuthenticated = false;
      });
  },
});

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.user?.role;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectToken = (state) => state.auth.token;

export const { logout, clearError, updateUserProfile, refreshTokenSuccess } = authSlice.actions;
export default authSlice.reducer;