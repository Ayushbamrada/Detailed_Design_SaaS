// import { Routes, Route } from "react-router-dom";
// import Login from "../features/auth/Login";
// import Layout from "../components/layout/Layout";
// import Dashboard from "../features/dashboard/Dashboard";
// import ProtectedRoute from "../features/auth/ProtectedRoute";
// import Unauthorized from "../pages/Unauthorized";
// import ProjectList from "../features/projects/ProjectList";
// import ProjectDetails from "../features/projects/ProjectDetails";
// import ExtensionRequestPage from "../features/extensions/ExtensionRequestPage";
// import ProjectLogs from "../features/dailyLogs/ProjectLogs";
// import DailyLogs from "../features/dailyLogs/DailyLogs";
// import ContractorList from "../features/contractors/ContractorList";
// import ExtensionApproval from "../features/extensions/ExtensionApproval";
// import CreateProject from "../features/projects/CreateProject";




// export default function AppRoutes() {
//   return (
//     <Routes>
//       <Route path="/" element={<Login />} />
//       <Route path="/unauthorized" element={<Unauthorized />} />

//       <Route
//         element={
//           <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "USER"]}>
//             <Layout />
//           </ProtectedRoute>
//         }
//       >
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/projects" element={<ProjectList />} />
//         <Route path="/projects/:id" element={<ProjectDetails />} />
//         <Route path="/projects/:id/extend" element={<ExtensionRequestPage />} />
//         <Route path="/projects/:id/logs" element={<ProjectLogs />} />
//         <Route path="/contractors" element={<ContractorList />} />
//         <Route path="/extensions" element={<ExtensionApproval />} />
//         <Route path="/daily-logs" element={<DailyLogs />} />
//         <Route path="/projects/create" element={<CreateProject />} />
//       </Route>
//     </Routes>
//   );
// }

// import { Routes, Route } from "react-router-dom";
// import Login from "../features/auth/Login";
// import Layout from "../components/layout/Layout";
// import Dashboard from "../features/dashboard/Dashboard";
// import ProtectedRoute from "../features/auth/ProtectedRoute";
// import Unauthorized from "../pages/Unauthorized";
// import ProjectList from "../features/projects/ProjectList";
// import ProjectDetails from "../features/projects/ProjectDetails";
// import ExtensionRequestPage from "../features/extensions/ExtensionRequestPage"; // ✅ Correct path
// import ProjectLogs from "../features/dailyLogs/ProjectLogs";
// import DailyLogs from "../features/dailyLogs/DailyLogs";
// import ContractorList from "../features/contractors/ContractorList";
// import ExtensionApproval from "../features/extensions/ExtensionApproval";
// import CreateProject from "../features/projects/CreateProject";

// export default function AppRoutes() {
//   return (
//     <Routes>
//       <Route path="/" element={<Login />} />
//       <Route path="/unauthorized" element={<Unauthorized />} />

//       <Route
//         element={
//           <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "USER"]}>
//             <Layout />
//           </ProtectedRoute>
//         }
//       >
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/projects" element={<ProjectList />} />
//         <Route path="/projects/:id" element={<ProjectDetails />} />
//         <Route path="/projects/:id/extend" element={<ExtensionRequestPage />} />
//         <Route path="/projects/:id/logs" element={<ProjectLogs />} />
//         <Route path="/contractors" element={<ContractorList />} />
//         <Route path="/extensions" element={<ExtensionApproval />} />
//         <Route path="/daily-logs" element={<DailyLogs />} />
//         <Route path="/projects/create" element={<CreateProject />} />
//       </Route>
//     </Routes>
//   );
// }

import { Routes, Route } from "react-router-dom";
import Login from "../features/auth/Login";
import Layout from "../components/layout/Layout";
import DashboardWrapper from "../features/dashboard/DashboardWrapper";
import ProtectedRoute from "../features/auth/ProtectedRoute";
import Unauthorized from "../pages/Unauthorized";
import ProjectList from "../features/projects/ProjectList";
import ProjectDetails from "../features/projects/ProjectDetails";
import UserProjectDetails from "../features/projects/UserProjectDetails";
import UserProjectList from "../features/projects/UserProjectList"; // ✅ Add this import
import ExtensionRequestPage from "../features/extensions/ExtensionRequestPage";
import ProjectLogs from "../features/dailyLogs/ProjectLogs";
import DailyLogs from "../features/dailyLogs/DailyLogs";
import ContractorList from "../features/contractors/ContractorList";
import ExtensionApproval from "../features/extensions/ExtensionApproval";
import CreateProject from "../features/projects/CreateProject";

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
        {/* Dashboard - Role based wrapper */}
        <Route path="/dashboard" element={<DashboardWrapper />} />

        {/* User specific routes - accessible only to USER role */}
        <Route path="/my-projects" element={
          <ProtectedRoute allowedRoles={["USER"]}>
            <UserProjectList />  {/* Now this is defined */}
          </ProtectedRoute>
        } />
        <Route path="/my-projects/:id" element={
          <ProtectedRoute allowedRoles={["USER"]}>
            <UserProjectDetails />
          </ProtectedRoute>
        } />
        <Route path="/my-projects/:id/extend" element={
          <ProtectedRoute allowedRoles={["USER"]}>
            <ExtensionRequestPage />
          </ProtectedRoute>
        } />
        <Route path="/my-projects/:id/logs" element={
          <ProtectedRoute allowedRoles={["USER"]}>
            <ProjectLogs />
          </ProtectedRoute>
        } />

        {/* Admin/Super Admin specific routes */}
        <Route path="/projects" element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
            <ProjectList />
          </ProtectedRoute>
        } />
        <Route path="/projects/:id" element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
            <ProjectDetails />
          </ProtectedRoute>
        } />
        <Route path="/projects/create" element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
            <CreateProject />
          </ProtectedRoute>
        } />

        {/* Common routes */}
        <Route path="/daily-logs" element={<DailyLogs />} />
        
        {/* Admin only routes */}
        <Route path="/contractors" element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
            <ContractorList />
          </ProtectedRoute>
        } />
        <Route path="/extensions" element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
            <ExtensionApproval />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}