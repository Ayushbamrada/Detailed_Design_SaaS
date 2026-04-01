import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { hideSnackbar } from "./notificationSlice";
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Info,
  Bell,
  Clock,
  Calendar
} from "lucide-react";
import { useEffect } from "react";

const Snackbar = () => {
  const dispatch = useDispatch();
  const { open, message, type, duration = 5000 } = useSelector((state) => state.notification);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        dispatch(hideSnackbar());
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [open, duration, dispatch]);

  const getIcon = () => {
    switch(type) {
      case "success":
        return <CheckCircle className="text-green-500" size={24} />;
      case "error":
        return <XCircle className="text-red-500" size={24} />;
      case "warning":
        return <AlertCircle className="text-yellow-500" size={24} />;
      case "info":
        return <Info className="text-blue-500" size={24} />;
      default:
        return <Bell className="text-gray-500" size={24} />;
    }
  };

  const getGradient = () => {
    switch(type) {
      case "success":
        return "from-green-500 to-green-600";
      case "error":
        return "from-red-500 to-red-600";
      case "warning":
        return "from-yellow-500 to-yellow-600";
      case "info":
        return "from-blue-500 to-blue-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getBgColor = () => {
    switch(type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed top-5 left-1/2 transform -translate-x-1/2 z-[9999]"
        >
          <div className={`
            relative overflow-hidden rounded-2xl shadow-2xl border
            ${getBgColor()}
            backdrop-blur-sm bg-opacity-95
            min-w-[320px] max-w-md
          `}>
            {/* Progress bar animation */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${getGradient()}`}
            />
            
            <div className="p-4 flex items-center gap-3">
              <div className={`
                p-2 rounded-full bg-white shadow-lg
                ${type === 'error' ? 'text-red-500' : 
                  type === 'success' ? 'text-green-500' : 
                  type === 'warning' ? 'text-yellow-500' : 
                  'text-blue-500'}
              `}>
                {getIcon()}
              </div>
              
              <p className="flex-1 text-sm font-medium text-gray-800">
                {message}
              </p>
              
              <button
                onClick={() => dispatch(hideSnackbar())}
                className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <XCircle size={18} className="text-gray-500" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Snackbar;