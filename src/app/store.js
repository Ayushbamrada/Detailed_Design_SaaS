import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "../features/ui/uiSlice";
import authReducer from "../features/auth/authSlice";
import notificationReducer from "../features/notifications/notificationSlice";
import projectReducer from "../features/projects/projectSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    notification: notificationReducer,
    projects: projectReducer
  },
});