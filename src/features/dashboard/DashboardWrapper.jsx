// src/features/dashboard/DashboardWrapper.jsx
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import Dashboard from "./Dashboard";
import UserDashboard from "./UserDashboard";
import { showError } from "../../utils/toast";

// Loading component for better UX
const DashboardLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center gap-4"
    >
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-white rounded-full"></div>
        </div>
      </div>
      <p className="text-gray-600">Loading your dashboard...</p>
    </motion.div>
  </div>
);

// Error component for role issues
const RoleError = ({ role }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4"
  >
    <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-4xl">⚠️</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Invalid Role Configuration</h2>
      <p className="text-gray-600 mb-4">
        Your account has an unrecognized role: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{role}</span>
      </p>
      <p className="text-sm text-gray-500 mb-6">
        Please contact your administrator to resolve this issue.
      </p>
      <button
        onClick={() => window.location.href = '/'}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
      >
        Back to Login
      </button>
    </div>
  </motion.div>
);

const DashboardWrapper = () => {
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth);

  // Debug logging
  useEffect(() => {
    console.log('DashboardWrapper - Auth State:', {
      isAuthenticated,
      loading,
      user: user ? {
        name: user.name,
        role: user.role,
        originalRole: user.originalRole,
        email: user.email
      } : null
    });
  }, [user, loading, isAuthenticated]);

  // Show loading state
  if (loading) {
    return <DashboardLoading />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    console.log('DashboardWrapper - Not authenticated, redirecting to login');
    return <Navigate to="/" replace />;
  }

  // Handle different roles
  switch (user.role) {
    case 'USER':
      console.log('DashboardWrapper - Rendering UserDashboard for role:', user.role);
      return <UserDashboard />;
      
    case 'ADMIN':
    case 'SUPER_ADMIN':
      console.log('DashboardWrapper - Rendering Admin Dashboard for role:', user.role);
      return <Dashboard />;
      
    default:
      // If role is not recognized, show error
      console.error('DashboardWrapper - Unrecognized role:', user.role);
      return <RoleError role={user.role} />;
  }
};

// Export with memo to prevent unnecessary re-renders
export default DashboardWrapper;