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

const NotificationManager = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const projects = useSelector(state => state.projects.projects);
  
  // Use refs to track which notifications have been shown
  const shownNotifications = useRef(new Set());
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Debug logs
    console.log("NotificationManager - Auth State:", { user, isAuthenticated });
    console.log("NotificationManager - Projects:", projects);

    // Only run if user is authenticated
    if (!isAuthenticated || !user) {
      console.log("NotificationManager: Not authenticated, skipping");
      shownNotifications.current.clear();
      hasInitialized.current = false;
      return;
    }

    // Function to show notification if not shown before
    const showNotificationOnce = (message, type, duration, key) => {
      if (!shownNotifications.current.has(key)) {
        console.log(`Showing notification: ${key}`);
        dispatch(showSnackbar({ message, type, duration }));
        shownNotifications.current.add(key);
      }
    };

    // Check deadlines
    const checkDeadlines = () => {
      console.log("Checking deadlines for projects:", projects.length);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      projects.forEach(project => {
        // Skip completed projects
        if (project.status === "COMPLETED") return;
        
        const daysLeft = getDaysUntilDeadline(project.completionDate);
        const status = getDeadlineStatus(project.completionDate);
        
        console.log(`Project ${project.name}:`, { daysLeft, status });
        
        // Create unique keys for each notification type per project
        const projectKey = `project-${project.id}`;
        
        // Check for overdue projects
        if (status === "OVERDUE" && project.status !== "DELAYED") {
          showNotificationOnce(
            `🚨 ${project.name} is OVERDUE!`,
            "error",
            8000,
            `${projectKey}-overdue`
          );
        }
        
        // Check for due today
        if (status === "TODAY" && project.progress < 100) {
          showNotificationOnce(
            `⏰ ${project.name} is due TODAY!`,
            "warning",
            6000,
            `${projectKey}-today`
          );
        }
        
        // Check for critical deadlines (1-2 days)
        if (status === "CRITICAL" && daysLeft > 0 && daysLeft <= 2 && project.progress < 100) {
          showNotificationOnce(
            `⚡ ${project.name} deadline in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}!`,
            "warning",
            5000,
            `${projectKey}-critical-${daysLeft}`
          );
        }
        
        // Check for delayed projects
        if (project.status === "DELAYED") {
          showNotificationOnce(
            `⚠️ ${project.name} is delayed!`,
            "error",
            5000,
            `${projectKey}-delayed`
          );
        }
      });
    };
    
    // Run once immediately when authenticated
    if (!hasInitialized.current) {
      console.log("First run - checking deadlines");
      checkDeadlines();
      hasInitialized.current = true;
    }
    
    // Set up interval to check every minute
    const interval = setInterval(() => {
      console.log("Interval check - running");
      checkDeadlines();
    }, 60000);
    
    return () => {
      console.log("Cleaning up notification manager");
      clearInterval(interval);
    };
  }, [isAuthenticated, user, projects, dispatch]); // Add proper dependencies
  
  return null;
};

export default NotificationManager;