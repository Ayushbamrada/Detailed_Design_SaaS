// src/features/auth/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
// import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  // Debug logging
  useEffect(() => {
    console.log('ProtectedRoute - Auth State:', {
      isAuthenticated,
      loading,
      user: user ? {
        role: user.role,
        email: user.email,
        name: user.name
      } : null,
      allowedRoles,
      currentPath: location.pathname
    });
  }, [isAuthenticated, loading, user, allowedRoles, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center gap-4"
        >
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role;
    console.log(userRole, 'userrole')
    if (!userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;