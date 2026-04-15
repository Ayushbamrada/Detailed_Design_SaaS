

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
  
  
  const shownNotifications = useRef(new Set());
  const hasShownInitialNotifications = useRef(false);

  useEffect(() => {
    
    const isLoginPage = location.pathname === '/' || location.pathname === '/login';
    
    if (isLoginPage || !isAuthenticated || !user) {
      return;
    }

    
    if (hasShownInitialNotifications.current) {
      return;
    }

    
    if (!projects || projects.length === 0) {
      return;
    }

    const showNotification = (message, type, duration, key) => {
      if (!shownNotifications.current.has(key)) {
        dispatch(showSnackbar({ message, type, duration }));
        shownNotifications.current.add(key);
      }
    };

    
    const checkDeadlines = () => {
      projects.forEach(project => {
        
        if (project.status === "COMPLETED") return;
        
        const daysLeft = getDaysUntilDeadline(project.completionDate);
        const status = getDeadlineStatus(project.completionDate);
        
        const projectKey = `project-${project.id}`;
        
      
        if (status === "OVERDUE" && project.status !== "DELAYED") {
          showNotification(
            `🚨 ${project.name} is OVERDUE!`,
            "error",
            8000,
            `${projectKey}-overdue`
          );
        }
        
        
        if (status === "TODAY" && project.progress < 100) {
          showNotification(
            `⏰ ${project.name} is due TODAY!`,
            "warning",
            6000,
            `${projectKey}-today`
          );
        }
        
      
        if (status === "CRITICAL" && daysLeft > 0 && daysLeft <= 2 && project.progress < 100) {
          showNotification(
            `⚡ ${project.name} deadline in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}!`,
            "warning",
            5000,
            `${projectKey}-critical`
          );
        }
        
      
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
    
    
    checkDeadlines();
    hasShownInitialNotifications.current = true;
    
    
    
  }, [isAuthenticated, user, projects, dispatch, location.pathname]); 
  
  return null;
};

export default NotificationManager;