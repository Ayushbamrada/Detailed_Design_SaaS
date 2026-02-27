import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    // Mobile sidebar (drawer)
    sidebarOpen: false,

    desktopCollapsed:
  localStorage.getItem("desktopCollapsed") === "true",
  },
  reducers: {
    // Mobile toggle
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    // Close mobile sidebar
    closeSidebar: (state) => {
      state.sidebarOpen = false;
    },

    // Desktop collapse toggle
    toggleDesktopCollapse: (state) => {
      state.desktopCollapsed = !state.desktopCollapsed;
    },
  },
});

export const {
  toggleSidebar,
  closeSidebar,
  toggleDesktopCollapse,
} = uiSlice.actions;

export default uiSlice.reducer;