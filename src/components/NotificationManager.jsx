// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { showSnackbar } from "../features/notifications/notificationSlice";
// import { getDaysUntilDeadline, getDeadlineStatus } from "../utils/deadlineUtils";

// const NotificationManager = () => {
//   const dispatch = useDispatch();
//   const projects = useSelector(state => state.projects.projects);
  
//   useEffect(() => {
//     // Check projects every minute for deadline updates
//     const checkDeadlines = () => {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
      
//       projects.forEach(project => {
//         // Skip completed projects
//         if (project.status === "COMPLETED") return;
        
//         const daysLeft = getDaysUntilDeadline(project.completionDate);
//         const status = getDeadlineStatus(project.completionDate);
        
//         // Check for overdue projects
//         if (status === "OVERDUE" && project.status !== "DELAYED") {
//           dispatch(showSnackbar({
//             message: `🚨 ${project.name} is OVERDUE!`,
//             type: "error",
//             duration: 8000
//           }));
//         }
        
//         // Check for due today
//         if (status === "TODAY" && project.progress < 100) {
//           dispatch(showSnackbar({
//             message: `⏰ ${project.name} is due TODAY!`,
//             type: "warning",
//             duration: 6000
//           }));
//         }
        
//         // Check for critical deadlines (1-2 days)
//         if (status === "CRITICAL" && daysLeft > 0 && project.progress < 100) {
//           dispatch(showSnackbar({
//             message: `⚡ ${project.name} deadline in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}!`,
//             type: "warning",
//             duration: 5000
//           }));
//         }
        
//         // Check for delayed projects
//         if (project.status === "DELAYED") {
//           dispatch(showSnackbar({
//             message: `⚠️ ${project.name} is delayed!`,
//             type: "error",
//             duration: 5000
//           }));
//         }
//       });
//     };
    
//     // Run immediately
//     checkDeadlines();
    
//     // Set up interval to check every minute
//     const interval = setInterval(checkDeadlines, 60000);
    
//     return () => clearInterval(interval);
//   }, [projects, dispatch]);
  
//   return null; // This component doesn't render anything
// };

// export default NotificationManager;

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showSnackbar } from "../features/notifications/notificationSlice";
import { getDaysUntilDeadline, getDeadlineStatus } from "../utils/deadlineUtils";
import { useLocation } from "react-router-dom";

const NotificationManager = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const projects = useSelector(state => state.projects.projects);
  
  // Use refs to track which notifications have been shown in this session
  const shownNotifications = useRef(new Set());
  const hasShownInitialNotifications = useRef(false);

  useEffect(() => {
    // Don't show notifications on login page
    const isLoginPage = location.pathname === '/' || location.pathname === '/login';
    
    if (isLoginPage || !isAuthenticated || !user) {
      return;
    }

    // Only show notifications once per session
    if (hasShownInitialNotifications.current) {
      return;
    }

    // Only proceed if we have projects
    if (!projects || projects.length === 0) {
      return;
    }

    console.log("Showing initial notifications for this session");

    // Function to show notification
    const showNotification = (message, type, duration, key) => {
      if (!shownNotifications.current.has(key)) {
        dispatch(showSnackbar({ message, type, duration }));
        shownNotifications.current.add(key);
      }
    };

    // Check deadlines once
    const checkDeadlines = () => {
      projects.forEach(project => {
        // Skip completed projects
        if (project.status === "COMPLETED") return;
        
        const daysLeft = getDaysUntilDeadline(project.completionDate);
        const status = getDeadlineStatus(project.completionDate);
        
        const projectKey = `project-${project.id}`;
        
        // Check for overdue projects
        if (status === "OVERDUE" && project.status !== "DELAYED") {
          showNotification(
            `🚨 ${project.name} is OVERDUE!`,
            "error",
            8000,
            `${projectKey}-overdue`
          );
        }
        
        // Check for due today
        if (status === "TODAY" && project.progress < 100) {
          showNotification(
            `⏰ ${project.name} is due TODAY!`,
            "warning",
            6000,
            `${projectKey}-today`
          );
        }
        
        // Check for critical deadlines (1-2 days)
        if (status === "CRITICAL" && daysLeft > 0 && daysLeft <= 2 && project.progress < 100) {
          showNotification(
            `⚡ ${project.name} deadline in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}!`,
            "warning",
            5000,
            `${projectKey}-critical`
          );
        }
        
        // Check for delayed projects
        if (project.status === "DELAYED") {
          showNotification(
            `⚠️ ${project.name} is delayed!`,
            "error",
            5000,
            `${projectKey}-delayed`
          );
        }
      });
    };
    
    // Show notifications once
    checkDeadlines();
    hasShownInitialNotifications.current = true;
    
    // NO INTERVAL - we only show notifications once per session
    
  }, [isAuthenticated, user, projects, dispatch, location.pathname]); // Add dependencies
  
  return null;
};

export default NotificationManager;