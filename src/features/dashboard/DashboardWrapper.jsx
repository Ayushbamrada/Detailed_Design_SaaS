import { useSelector } from "react-redux";
import Dashboard from "./Dashboard";
import UserDashboard from "./UserDashboard";

const DashboardWrapper = () => {
  const { user } = useSelector((state) => state.auth);

  // Return different dashboard based on user role
  if (user?.role === "USER") {
    return <UserDashboard />;
  }

  // Admin and Super Admin see the same dashboard
  return <Dashboard />;
};

export default DashboardWrapper;