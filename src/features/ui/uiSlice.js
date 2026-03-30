import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    sidebarOpen: false,
    desktopCollapsed:
      localStorage.getItem("desktopCollapsed") === "true",
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    closeSidebar: (state) => {
      state.sidebarOpen = false;
    },

    toggleDesktopCollapse: (state) => {
      state.desktopCollapsed = !state.desktopCollapsed;
      localStorage.setItem(
        "desktopCollapsed",
        state.desktopCollapsed
      );
    },
  },
});

export const {
  toggleSidebar,
  closeSidebar,
  toggleDesktopCollapse,
} = uiSlice.actions;

export default uiSlice.reducer;