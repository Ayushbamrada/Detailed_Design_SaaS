import { Bell, X, AlertCircle, CheckCircle, Clock, Calendar } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { hideSnackbar } from "./notificationSlice";

const NotificationBell = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const projects = useSelector(state => state.projects.projects);
  const snackbar = useSelector(state => state.notification);

  // Generate notifications based on deadlines
  useEffect(() => {
    const newNotifications = [];
    const today = new Date();
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);

    projects.forEach(project => {
      // Project level notifications
      const projectDeadline = new Date(project.completionDate);
      const daysToProjectDeadline = Math.ceil((projectDeadline - today) / (1000 * 60 * 60 * 24));

      if (daysToProjectDeadline <= 3 && daysToProjectDeadline > 0 && project.progress < 100) {
        newNotifications.push({
          id: `project-${project.id}`,
          type: 'warning',
          title: 'Project Deadline Approaching',
          message: `${project.name} deadline in ${daysToProjectDeadline} days`,
          projectId: project.id,
          date: new Date().toISOString()
        });
      }

      // Activity level notifications
      project.activities?.forEach(activity => {
        const activityDeadline = new Date(activity.endDate);
        const daysToActivityDeadline = Math.ceil((activityDeadline - today) / (1000 * 60 * 60 * 24));

        if (daysToActivityDeadline <= 2 && daysToActivityDeadline > 0 && activity.progress < 100) {
          newNotifications.push({
            id: `activity-${activity.id}`,
            type: 'info',
            title: 'Activity Deadline Near',
            message: `${activity.name} due in ${daysToActivityDeadline} days`,
            projectId: project.id,
            date: new Date().toISOString()
          });
        }

        // Sub-activity level notifications
        activity.subActivities?.forEach(sub => {
          const subDeadline = new Date(sub.endDate);
          const daysToSubDeadline = Math.ceil((subDeadline - today) / (1000 * 60 * 60 * 24));

          if (daysToSubDeadline <= 1 && daysToSubDeadline > 0 && sub.progress < 100) {
            newNotifications.push({
              id: `sub-${sub.id}`,
              type: 'urgent',
              title: 'Task Due Tomorrow',
              message: `${sub.name} due tomorrow`,
              projectId: project.id,
              date: new Date().toISOString()
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
          date: new Date().toISOString()
        });
      }
    });

    setNotifications(newNotifications.slice(0, 5)); // Show only 5 most recent
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
      case 'urgent': return <Clock className="text-orange-500" size={20} />;
      case 'success': return <CheckCircle className="text-green-500" size={20} />;
      default: return <Calendar className="text-blue-500" size={20} />;
    }
  };

  const getBgColor = (type) => {
    switch(type) {
      case 'error': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'urgent': return 'bg-orange-50 border-orange-200';
      case 'success': return 'bg-green-50 border-green-200';
      default: return 'bg-blue-50 border-blue-200';
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
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${getBgColor(notification.type)}`}
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
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  View all notifications
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