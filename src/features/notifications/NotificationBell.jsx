import { Bell, X, AlertCircle, CheckCircle, Clock, Calendar } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { hideSnackbar } from "./notificationSlice";
import { useNavigate } from "react-router-dom";

// Helper function to calculate days until deadline
const getDaysUntilDeadline = (deadline) => {
  if (!deadline) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);
  
  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Get deadline status
const getDeadlineStatus = (deadline) => {
  const days = getDaysUntilDeadline(deadline);
  if (days === null) return "UNKNOWN";
  if (days < 0) return "OVERDUE";
  if (days === 0) return "TODAY";
  if (days <= 2) return "CRITICAL";
  if (days <= 7) return "WARNING";
  if (days <= 14) return "UPCOMING";
  return "SAFE";
};

const NotificationBell = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const projects = useSelector(state => state.projects.projects);
  const snackbar = useSelector(state => state.notification);

  // Generate notifications based on deadlines
  useEffect(() => {
    const newNotifications = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    projects.forEach(project => {
      // Project level notifications
      const projectDeadlineStatus = getDeadlineStatus(project.completionDate);
      const daysToProjectDeadline = getDaysUntilDeadline(project.completionDate);

      // Critical deadlines (0-2 days)
      if ((projectDeadlineStatus === "TODAY" || projectDeadlineStatus === "CRITICAL") && project.progress < 100) {
        newNotifications.push({
          id: `project-critical-${project.id}`,
          type: 'error',
          title: daysToProjectDeadline === 0 ? 'Project Deadline TODAY!' : `Project Deadline in ${daysToProjectDeadline} days`,
          message: `${project.name} - ${project.progress}% complete`,
          projectId: project.id,
          date: new Date().toISOString(),
          priority: 1
        });
      }
      // Warning deadlines (3-7 days)
      else if (projectDeadlineStatus === "WARNING" && project.progress < 100) {
        newNotifications.push({
          id: `project-warning-${project.id}`,
          type: 'warning',
          title: `Project Deadline in ${daysToProjectDeadline} days`,
          message: `${project.name} - ${project.progress}% complete`,
          projectId: project.id,
          date: new Date().toISOString(),
          priority: 2
        });
      }
      // Upcoming deadlines (8-14 days)
      else if (projectDeadlineStatus === "UPCOMING" && project.progress < 100) {
        newNotifications.push({
          id: `project-upcoming-${project.id}`,
          type: 'info',
          title: `Project Deadline in ${daysToProjectDeadline} days`,
          message: `${project.name} - ${project.progress}% complete`,
          projectId: project.id,
          date: new Date().toISOString(),
          priority: 3
        });
      }

      // Activity level notifications
      project.activities?.forEach(activity => {
        const activityDeadlineStatus = getDeadlineStatus(activity.endDate);
        const daysToActivityDeadline = getDaysUntilDeadline(activity.endDate);

        if (activityDeadlineStatus === "TODAY" && activity.progress < 100) {
          newNotifications.push({
            id: `activity-today-${activity.id}`,
            type: 'error',
            title: 'Activity Due TODAY!',
            message: `${activity.name} in ${project.name}`,
            projectId: project.id,
            date: new Date().toISOString(),
            priority: 1
          });
        } else if (activityDeadlineStatus === "CRITICAL" && activity.progress < 100) {
          newNotifications.push({
            id: `activity-critical-${activity.id}`,
            type: 'warning',
            title: `Activity Due in ${daysToActivityDeadline} days`,
            message: `${activity.name} in ${project.name}`,
            projectId: project.id,
            date: new Date().toISOString(),
            priority: 2
          });
        }

        // Sub-activity level notifications
        activity.subActivities?.forEach(sub => {
          const subDeadlineStatus = getDeadlineStatus(sub.endDate);
          const daysToSubDeadline = getDaysUntilDeadline(sub.endDate);

          if (subDeadlineStatus === "TODAY" && sub.progress < 100) {
            newNotifications.push({
              id: `sub-today-${sub.id}`,
              type: 'error',
              title: 'Task Due TODAY!',
              message: `${sub.name} in ${activity.name}`,
              projectId: project.id,
              date: new Date().toISOString(),
              priority: 1
            });
          } else if (subDeadlineStatus === "CRITICAL" && sub.progress < 100) {
            newNotifications.push({
              id: `sub-critical-${sub.id}`,
              type: 'warning',
              title: `Task Due in ${daysToSubDeadline} days`,
              message: `${sub.name} in ${activity.name}`,
              projectId: project.id,
              date: new Date().toISOString(),
              priority: 2
            });
          }
        });
      });

      // Delayed projects
      if (project.status === "DELAYED") {
        newNotifications.push({
          id: `delayed-${project.id}`,
          type: 'error',
          title: 'Project Delayed',
          message: `${project.name} is behind schedule`,
          projectId: project.id,
          date: new Date().toISOString(),
          priority: 1
        });
      }
    });

    // Sort by priority (1 = highest)
    const sortedNotifications = newNotifications.sort((a, b) => a.priority - b.priority);
    setNotifications(sortedNotifications.slice(0, 10)); // Show 10 most important
  }, [projects]);

  // Handle snackbar from Redux
  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => {
        dispatch(hideSnackbar());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [snackbar, dispatch]);

  const getIcon = (type) => {
    switch(type) {
      case 'error': return <AlertCircle className="text-red-500" size={20} />;
      case 'warning': return <AlertCircle className="text-yellow-500" size={20} />;
      case 'info': return <Calendar className="text-blue-500" size={20} />;
      case 'success': return <CheckCircle className="text-green-500" size={20} />;
      default: return <Bell className="text-gray-500" size={20} />;
    }
  };

  const getBgColor = (type) => {
    switch(type) {
      case 'error': return 'bg-red-50 border-red-200 hover:bg-red-100';
      case 'warning': return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
      case 'info': return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'success': return 'bg-green-50 border-green-200 hover:bg-green-100';
      default: return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  return (
    <>
      {/* Top Center Snackbar */}
      <AnimatePresence>
        {snackbar.open && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className={`px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 min-w-[300px] max-w-md ${
              snackbar.type === 'error' ? 'bg-red-50 border-red-200' :
              snackbar.type === 'success' ? 'bg-green-50 border-green-200' :
              snackbar.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
              'bg-blue-50 border-blue-200'
            }`}>
              {snackbar.type === 'error' && <AlertCircle className="text-red-500" size={24} />}
              {snackbar.type === 'success' && <CheckCircle className="text-green-500" size={24} />}
              {snackbar.type === 'warning' && <AlertCircle className="text-yellow-500" size={24} />}
              {snackbar.type === 'info' && <Bell className="text-blue-500" size={24} />}
              <p className="flex-1 text-sm font-medium text-gray-800">{snackbar.message}</p>
              <button
                onClick={() => dispatch(hideSnackbar())}
                className="p-1 hover:bg-white/50 rounded-lg transition-colors"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Bell */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <Bell size={22} className="text-gray-600" />
          
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {notifications.length}
            </span>
          )}
        </button>

        {/* Notifications Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-96 bg-white shadow-2xl rounded-2xl overflow-hidden z-50 border border-gray-100"
            >
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Bell size={18} />
                    Notifications
                  </h4>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {notifications.length} new
                  </span>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => {
                        if (notification.projectId) {
                          navigate(`/projects/${notification.projectId}`);
                          setOpen(false);
                        }
                      }}
                      className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${getBgColor(notification.type)}`}
                    >
                      <div className="flex gap-3">
                        {getIcon(notification.type)}
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">{notification.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notification.date).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <Bell size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No new notifications</p>
                  </div>
                )}
              </div>

              <div className="p-3 bg-gray-50 text-center">
                <button 
                  onClick={() => setOpen(false)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default NotificationBell;