// import { createSlice } from "@reduxjs/toolkit";

// const notificationSlice = createSlice({
//   name: "notification",
//   initialState: {
//     message: null,
//   },
//   reducers: {
//     showNotification: (state, action) => {
//       state.message = action.payload;
//     },
//     clearNotification: (state) => {
//       state.message = null;
//     },
//   },
// });

// export const { showNotification, clearNotification } =
//   notificationSlice.actions;
// export default notificationSlice.reducer;

// import { createSlice } from "@reduxjs/toolkit";

// const notificationSlice = createSlice({
//   name: "notification",
//   initialState: {
//     open: false,
//     message: "",
//     type: "info", // info | success | warning | error
//   },
//   reducers: {
//     showSnackbar: (state, action) => {
//       state.open = true;
//       state.message = action.payload.message;
//       state.type = action.payload.type || "info";
//     },
//     hideSnackbar: (state) => {
//       state.open = false;
//       state.message = "";
//     },
//   },
// });

// export const { showSnackbar, hideSnackbar } = notificationSlice.actions;
// export default notificationSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    open: false,
    message: "",
    type: "info", // info | success | warning | error
    duration: 5000,
  },
  reducers: {
    showSnackbar: (state, action) => {
      state.open = true;
      state.message = action.payload.message;
      state.type = action.payload.type || "info";
      state.duration = action.payload.duration || 5000;
    },
    hideSnackbar: (state) => {
      state.open = false;
      state.message = "";
    },
  },
});

export const { showSnackbar, hideSnackbar } = notificationSlice.actions;
export default notificationSlice.reducer;