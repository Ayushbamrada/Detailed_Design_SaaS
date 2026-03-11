import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showSnackbar } from "../features/notifications/notificationSlice";
import { getDaysUntilDeadline, getDeadlineStatus } from "../utils/deadlineUtils";

const NotificationManager = () => {
  const dispatch = useDispatch();
  const projects = useSelector(state => state.projects.projects);
  
  useEffect(() => {
    // Check projects every minute for deadline updates
    const checkDeadlines = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      projects.forEach(project => {
        // Skip completed projects
        if (project.status === "COMPLETED") return;
        
        const daysLeft = getDaysUntilDeadline(project.completionDate);
        const status = getDeadlineStatus(project.completionDate);
        
        // Check for overdue projects
        if (status === "OVERDUE" && project.status !== "DELAYED") {
          dispatch(showSnackbar({
            message: `🚨 ${project.name} is OVERDUE!`,
            type: "error",
            duration: 8000
          }));
        }
        
        // Check for due today
        if (status === "TODAY" && project.progress < 100) {
          dispatch(showSnackbar({
            message: `⏰ ${project.name} is due TODAY!`,
            type: "warning",
            duration: 6000
          }));
        }
        
        // Check for critical deadlines (1-2 days)
        if (status === "CRITICAL" && daysLeft > 0 && project.progress < 100) {
          dispatch(showSnackbar({
            message: `⚡ ${project.name} deadline in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}!`,
            type: "warning",
            duration: 5000
          }));
        }
        
        // Check for delayed projects
        if (project.status === "DELAYED") {
          dispatch(showSnackbar({
            message: `⚠️ ${project.name} is delayed!`,
            type: "error",
            duration: 5000
          }));
        }
      });
    };
    
    // Run immediately
    checkDeadlines();
    
    // Set up interval to check every minute
    const interval = setInterval(checkDeadlines, 60000);
    
    return () => clearInterval(interval);
  }, [projects, dispatch]);
  
  return null; // This component doesn't render anything
};

export default NotificationManager;