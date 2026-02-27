import { Routes, Route } from "react-router-dom";
import Login from "../features/auth/Login";
import Layout from "../components/layout/Layout";
import Dashboard from "../features/dashboard/Dashboard";
import ProtectedRoute from "../features/auth/ProtectedRoute";
import Unauthorized from "../pages/Unauthorized";
import ProjectList from "../features/projects/ProjectList";
import ProjectDetails from "../features/projects/ProjectDetails";
import ProjectLogs from "../features/dailyLogs/ProjectLogs";
import DailyLogs from "../features/dailyLogs/DailyLogs";
import ContractorList from "../features/contractors/ContractorList";
import ExtensionApproval from "../features/extensions/ExtensionApproval";




export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "USER"]}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/projects/:id/logs" element={<ProjectLogs />} />
        <Route path="/contractors" element={<ContractorList />} />
        <Route path="/extensions" element={<ExtensionApproval />} />
        <Route path="/daily-logs" element={<DailyLogs />} />
      </Route>
    </Routes>
  );
}