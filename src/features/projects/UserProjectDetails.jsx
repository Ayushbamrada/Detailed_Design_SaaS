// // src/features/projects/UserProjectDetails.jsx
// import { useParams, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { motion, AnimatePresence } from "framer-motion";
// import { useState, useEffect, useCallback, useMemo } from "react";
// import { 
//   Calendar, 
//   ClipboardList, 
//   ChevronDown, 
//   ChevronUp,
//   Clock,
//   MapPin,
//   Building2,
//   IndianRupee,
//   Ruler,
//   AlertCircle,
//   CheckCircle2,
//   XCircle,
//   ArrowLeft,
//   FileText,
//   Briefcase,
//   User,
//   Layers,
//   Target,
//   Info,
//   Loader2
// } from "lucide-react";
// import { showSnackbar } from "../notifications/notificationSlice";
// import TaskPickerModal from "../tasks/TaskPickerModal";
// import { fetchProjects } from "../api/apiSlice";

// // Helper function to calculate days until deadline
// const getDaysUntilDeadline = (deadline) => {
//   if (!deadline) return null;
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   const deadlineDate = new Date(deadline);
//   deadlineDate.setHours(0, 0, 0, 0);
//   const diffTime = deadlineDate - today;
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   return diffDays;
// };

// // Get deadline status
// const getDeadlineStatus = (deadline) => {
//   const days = getDaysUntilDeadline(deadline);
//   if (days === null) return "UNKNOWN";
//   if (days < 0) return "OVERDUE";
//   if (days === 0) return "TODAY";
//   if (days <= 2) return "CRITICAL";
//   if (days <= 7) return "WARNING";
//   if (days <= 14) return "UPCOMING";
//   return "SAFE";
// };

// // Map backend status to frontend
// const mapStatusToFrontend = (backendStatus) => {
//   const map = {
//     "Pending": "PENDING",
//     "Inprogress": "ONGOING",
//     "Complete": "COMPLETED",
//     "OnHold": "HOLD"
//   };
//   return map[backendStatus] || "PENDING";
// };

// // Map backend unit to frontend
// const mapUnitToFrontend = (backendUnit) => {
//   const map = {
//     'Kilometer': 'Km',
//     'Numbers': 'Nos.',
//     'Percentage': 'Percentage'
//   };
//   return map[backendUnit] || backendUnit;
// };

// // Calculate progress based on status for status-based items
// const getProgressFromStatus = (status) => {
//   const statusProgress = {
//     "PENDING": 0,
//     "ONGOING": 50,
//     "COMPLETED": 100,
//     "DELAYED": 25,
//     "HOLD": 10
//   };
//   return statusProgress[status] || 0;
// };

// const UserProjectDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { user } = useSelector((state) => state.auth);

//   // FIXED: Get projects from api slice, not projects slice
//   const { projects = [], loading: apiLoading } = useSelector((state) => state.api);
//   const localProjects = useSelector((state) => state.projects?.projects || []);

//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [expandedActivities, setExpandedActivities] = useState({});
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [showTaskPicker, setShowTaskPicker] = useState(false);
//   const [companyMap, setCompanyMap] = useState({});
//   const [sectorMap, setSectorMap] = useState({});
//   const [clientMap, setClientMap] = useState({});

//   // Fetch projects if not loaded
//   useEffect(() => {
//     if (projects.length === 0) {
//       dispatch(fetchProjects());
//     }
//   }, [dispatch, projects.length]);

//   // Find the project from either api or local projects
//   useEffect(() => {
//     setLoading(true);

//     // Try to find in api projects first
//     let foundProject = projects.find(p => p.id === id || p.project_id === id);

//     // If not found, try local projects
//     if (!foundProject) {
//       foundProject = localProjects.find(p => p.id === id || p.project_id === id);
//     }

//     if (foundProject) {
//       console.log("Project found:", foundProject);
//       setProject(foundProject);

//       // Extract names from project_detail if available
//       if (foundProject.project_detail) {
//         setCompanyMap({
//           [foundProject.company]: foundProject.project_detail.company_detail?.name
//         });
//         setSectorMap({
//           [foundProject.sector]: foundProject.project_detail.sector_detail?.name
//         });
//         setClientMap({
//           [foundProject.client]: foundProject.project_detail.client_detail?.name
//         });
//       }
//     } else {
//       console.log("Project not found with ID:", id);
//     }

//     setLoading(false);
//   }, [id, projects, localProjects]);

//   // Helper functions to get display names
//   const getCompanyName = useCallback(() => {
//     if (project?.company_detail?.name) return project.company_detail.name;
//     if (project?.project_detail?.company_detail?.name) return project.project_detail.company_detail.name;
//     if (companyMap[project?.company]) return companyMap[project?.company];
//     return project?.company || "—";
//   }, [project, companyMap]);

//   const getSectorName = useCallback(() => {
//     if (project?.sector_detail?.name) return project.sector_detail.name;
//     if (project?.project_detail?.sector_detail?.name) return project.project_detail.sector_detail.name;
//     if (sectorMap[project?.sector]) return sectorMap[project?.sector];
//     return project?.sector || "—";
//   }, [project, sectorMap]);

//   const getClientName = useCallback(() => {
//     if (project?.client_detail?.name) return project.client_detail.name;
//     if (project?.project_detail?.client_detail?.name) return project.project_detail.client_detail.name;
//     if (clientMap[project?.client]) return clientMap[project?.client];
//     return project?.client || project?.department || "—";
//   }, [project, clientMap]);

//   const getProjectName = useCallback(() => {
//     return project?.name || project?.project_name || "Unnamed Project";
//   }, [project]);

//   const getProjectCode = useCallback(() => {
//     return project?.code || project?.project_code || "N/A";
//   }, [project]);

//   const getProjectStatus = useCallback(() => {
//     return mapStatusToFrontend(project?.status);
//   }, [project]);

//   const getProjectProgress = useCallback(() => {
//     return project?.progress || 0;
//   }, [project]);

//   const getProjectLocation = useCallback(() => {
//     return project?.location || "—";
//   }, [project]);

//   const getProjectTotalLength = useCallback(() => {
//     const value = project?.total_length || project?.totalLength || 0;
//     return `${value} km`;
//   }, [project]);

//   const getProjectCost = useCallback(() => {
//     const value = project?.cost || project?.workorder_cost || 0;
//     return `₹ ${value} Lakhs`;
//   }, [project]);

//   const getProjectLoaDate = useCallback(() => {
//     const date = project?.loa_date || project?.loaDate;
//     return date ? formatDate(date) : "Not set";
//   }, [project]);

//   const getProjectDirectorProposalDate = useCallback(() => {
//     const date = project?.director_proposal_date || project?.directorProposalDate;
//     return date ? formatDate(date) : "Not set";
//   }, [project]);

//   const getProjectConfirmationDate = useCallback(() => {
//     const date = project?.project_confirmation_date || project?.projectConfirmationDate;
//     return date ? formatDate(date) : "Not set";
//   }, [project]);

//   const getProjectCompletionDate = useCallback(() => {
//     return project?.completion_date || project?.completionDate;
//   }, [project]);

//   const formatDate = useCallback((dateString) => {
//     if (!dateString) return "Not set";
//     try {
//       return new Date(dateString).toLocaleDateString('en-IN', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     } catch (e) {
//       return "Invalid date";
//     }
//   }, []);

//   const toggleActivity = (activityId) => {
//     setExpandedActivities(prev => ({
//       ...prev,
//       [activityId]: !prev[activityId]
//     }));
//   };

//   const handlePickTask = (activity, subActivity) => {
//     setSelectedTask({ project, activity, subActivity });
//     setShowTaskPicker(true);
//   };

//   const calculateDaysLeft = (endDate) => {
//     if (!endDate) return null;
//     try {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       const end = new Date(endDate);
//       end.setHours(0, 0, 0, 0);
//       const diffTime = end - today;
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//       return diffDays;
//     } catch (e) {
//       return null;
//     }
//   };

//   const getDeadlineBadge = (endDate, isCompleted = false) => {
//     if (isCompleted) return null;
//     const days = calculateDaysLeft(endDate);
//     if (days === null) return null;
//     if (days < 0) return <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">Overdue</span>;
//     if (days === 0) return <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">Due Today</span>;
//     if (days <= 2) return <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full">{days} days left</span>;
//     if (days <= 7) return <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full">{days} days left</span>;
//     return <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">{days} days left</span>;
//   };

//   const getStatusColor = (status) => {
//     const frontendStatus = mapStatusToFrontend(status);
//     switch(frontendStatus) {
//       case "COMPLETED": return "bg-green-100 text-green-600 border-green-200";
//       case "ONGOING": return "bg-blue-100 text-blue-600 border-blue-200";
//       case "DELAYED": return "bg-red-100 text-red-600 border-red-200";
//       case "HOLD": return "bg-yellow-100 text-yellow-600 border-yellow-200";
//       default: return "bg-gray-100 text-gray-600 border-gray-200";
//     }
//   };

//   const getProgressColor = (progress) => {
//     if (progress === 100) return "bg-green-500";
//     if (progress >= 75) return "bg-blue-500";
//     if (progress >= 50) return "bg-yellow-500";
//     if (progress >= 25) return "bg-orange-500";
//     return "bg-red-500";
//   };

//   if (loading || apiLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
//         <div className="bg-white rounded-2xl p-8 shadow-xl flex items-center gap-4">
//           <Loader2 className="animate-spin text-blue-600" size={32} />
//           <div>
//             <p className="text-lg font-semibold text-gray-800">Loading Project</p>
//             <p className="text-sm text-gray-500">Please wait...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!project) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
//         <div className="text-center px-4">
//           <XCircle size={48} className="text-red-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Project not found</h2>
//           <p className="text-gray-600 mb-6">Project ID: {id}</p>
//           <button
//             onClick={() => navigate("/all-projects")}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Back to Projects
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const activities = project.activities_detail || project.activities || [];
//   const totalSubActivities = activities.reduce((acc, act) => 
//     acc + (act.subactivities?.length || act.subActivities?.length || 0), 0
//   );
//   const availableTasks = activities.reduce((acc, act) => {
//     const subs = act.subactivities || act.subActivities || [];
//     return acc + subs.filter(s => {
//       const status = s.status_display || mapStatusToFrontend(s.status);
//       return status !== "COMPLETED";
//     }).length;
//   }, 0);

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
//     >
//       {/* Task Picker Modal */}
//       <AnimatePresence>
//         {showTaskPicker && selectedTask && (
//           <TaskPickerModal
//             project={selectedTask.project}
//             activity={selectedTask.activity}
//             subActivity={selectedTask.subActivity}
//             onClose={() => {
//               setShowTaskPicker(false);
//               setSelectedTask(null);
//             }}
//           />
//         )}
//       </AnimatePresence>

//       <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate("/all-projects")}
//               className="p-2 hover:bg-gray-200 rounded-xl transition-colors"
//             >
//               <ArrowLeft size={20} className="text-gray-600" />
//             </button>
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800">{getProjectName()}</h1>
//               <p className="text-sm text-gray-500">
//                 Code: {getProjectCode()} | {project.short_name && `Short Name: ${project.short_name}`}
//               </p>
//             </div>
//           </div>

//           <button
//             onClick={() => navigate(`/projects/${id}/logs`)}
//             className="bg-gray-800 text-white px-4 py-2 rounded-xl hover:bg-gray-900 transition-all flex items-center gap-2"
//           >
//             <FileText size={18} />
//             View Logs
//           </button>
//         </div>

//         {/* Status Banner */}
//         <motion.div
//           initial={{ y: -20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           className={`rounded-2xl p-4 flex items-center justify-between ${
//             getProjectStatus() === "DELAYED" ? "bg-red-50 border border-red-200" :
//             getProjectStatus() === "COMPLETED" ? "bg-green-50 border border-green-200" :
//             "bg-blue-50 border border-blue-200"
//           }`}
//         >
//           <div className="flex items-center gap-3">
//             {getProjectStatus() === "DELAYED" ? (
//               <AlertCircle className="text-red-600" size={24} />
//             ) : getProjectStatus() === "COMPLETED" ? (
//               <CheckCircle2 className="text-green-600" size={24} />
//             ) : (
//               <Clock className="text-blue-600" size={24} />
//             )}
//             <div>
//               <p className="font-semibold">
//                 Project Status: <span className={
//                   getProjectStatus() === "DELAYED" ? "text-red-600" :
//                   getProjectStatus() === "COMPLETED" ? "text-green-600" :
//                   "text-blue-600"
//                 }>{getProjectStatus()}</span>
//               </p>
//               <p className="text-sm text-gray-600">
//                 {getDeadlineStatus(getProjectCompletionDate()) === "OVERDUE" ? "Project is overdue" :
//                  getDeadlineStatus(getProjectCompletionDate()) === "TODAY" ? "Project due today!" :
//                  getDeadlineStatus(getProjectCompletionDate()) === "CRITICAL" ? "Project deadline critical" :
//                  getProjectStatus() === "COMPLETED" ? "Project completed successfully" :
//                  "Project is on track"}
//               </p>
//             </div>
//           </div>
//           <div className="text-right">
//             <p className="text-sm text-gray-600">Completion Date</p>
//             <p className="font-semibold">{formatDate(getProjectCompletionDate())}</p>
//             {getDeadlineBadge(getProjectCompletionDate(), getProjectStatus() === "COMPLETED")}
//           </div>
//         </motion.div>

//         {/* Summary Card */}
//         <motion.div
//           whileHover={{ scale: 1.01 }}
//           className="bg-white shadow-2xl rounded-3xl p-8 border border-gray-100"
//         >
//           <div className="grid md:grid-cols-2 gap-8">
//             {/* Left Details */}
//             <div className="space-y-4">
//               <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                 <Building2 size={20} className="text-blue-600" />
//                 Project Details
//               </h3>

//               <div className="grid grid-cols-2 gap-4">
//                 <DetailItem label="Company" value={getCompanyName()} />
//                 <DetailItem label="Sub Company" value={project.sub_company || project.subCompany || "—"} />
//                 <DetailItem label="Location" value={getProjectLocation()} icon={<MapPin size={12} />} />
//                 <DetailItem label="Sector" value={getSectorName()} />
//                 <DetailItem label="Client/Dept" value={getClientName()} />
//                 <DetailItem label="Total Length" value={getProjectTotalLength()} icon={<Ruler size={12} />} />
//                 <DetailItem label="Workorder Cost" value={getProjectCost()} icon={<IndianRupee size={12} />} />
//                 <DetailItem label="LOA Date" value={getProjectLoaDate()} icon={<Calendar size={12} />} />
//               </div>

//               {/* Additional Dates */}
//               <div className="mt-6 pt-6 border-t border-gray-100">
//                 <h4 className="font-semibold text-gray-700 mb-3">Key Milestones</h4>
//                 <div className="grid grid-cols-2 gap-4">
//                   <DetailItem label="Director Proposal" value={getProjectDirectorProposalDate()} />
//                   <DetailItem label="Project Confirmation" value={getProjectConfirmationDate()} />
//                 </div>
//               </div>
//             </div>

//             {/* Right Progress */}
//             <div className="border-l border-gray-100 pl-8">
//               <h4 className="text-xl font-semibold text-gray-800 mb-6">Progress Overview</h4>

//               <div className="space-y-6">
//                 {/* Main Progress Bar */}
//                 <div>
//                   <div className="flex justify-between text-sm mb-2">
//                     <span className="font-medium">Overall Progress</span>
//                     <span className="text-blue-600 font-bold">{getProjectProgress()}%</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
//                     <motion.div
//                       initial={{ width: 0 }}
//                       animate={{ width: `${getProjectProgress()}%` }}
//                       transition={{ duration: 1, ease: "easeOut" }}
//                       className={`h-4 rounded-full ${getProgressColor(getProjectProgress())}`}
//                     />
//                   </div>
//                 </div>

//                 {/* Stats */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <StatCard label="Total Activities" value={activities.length} />
//                   <StatCard label="Total Tasks" value={totalSubActivities} />
//                 </div>

//                 {/* Available Tasks */}
//                 <div className="bg-green-50 p-4 rounded-xl border border-green-100">
//                   <div className="flex items-center gap-2 mb-1">
//                     <Target size={16} className="text-green-600" />
//                     <span className="text-sm font-semibold text-green-700">Available to Pick</span>
//                   </div>
//                   <p className="text-2xl font-bold text-green-700">{availableTasks}</p>
//                   <p className="text-xs text-green-600 mt-1">Tasks you can pick to work on</p>
//                 </div>

//                 {/* Status Tags */}
//                 <div className="flex flex-wrap gap-2">
//                   <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(getProjectStatus())}`}>
//                     {getProjectStatus()}
//                   </span>
//                   {project.extensionRequested && (
//                     <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-600">
//                       Extension Requested
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Activities Section */}
//         <div className="space-y-6">
//           <div className="flex justify-between items-center">
//             <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
//               <ClipboardList size={24} className="text-blue-600" />
//               Available Tasks to Pick
//             </h3>
//             <div className="flex items-center gap-2 text-sm text-gray-500">
//               <User size={16} />
//               <span>{user?.name}</span>
//             </div>
//           </div>

//           {activities.length === 0 ? (
//             <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
//               <Layers size={64} className="mx-auto mb-4 text-gray-300" />
//               <h3 className="text-xl font-semibold text-gray-700 mb-2">No Activities Yet</h3>
//               <p className="text-gray-500">This project doesn't have any activities defined.</p>
//             </div>
//           ) : (
//             activities.map((activity) => {
//               const isExpanded = expandedActivities[activity.id];
//               const activityName = activity.activity_name || activity.name;
//               const activityProgress = activity.progress || 0;
//               const isActivityCompleted = activityProgress === 100;
//               const subList = activity.subactivities || activity.subActivities || [];
//               const availableInActivity = subList.filter(s => {
//                 const status = s.status_display || mapStatusToFrontend(s.status);
//                 return status !== "COMPLETED";
//               }).length;

//               return (
//                 <motion.div
//                   key={activity.id}
//                   layout
//                   className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100"
//                 >
//                   {/* Activity Header */}
//                   <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
//                     <div className="flex items-center justify-between">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-3 mb-2">
//                           <h4 className="text-lg font-semibold text-gray-800">{activityName}</h4>
//                           <span className={`text-xs px-2 py-1 rounded-full ${
//                             isActivityCompleted ? "bg-green-100 text-green-600" : 
//                             "bg-blue-100 text-blue-600"
//                           }`}>
//                             {isActivityCompleted ? "Completed" : "Ongoing"}
//                           </span>
//                           {availableInActivity > 0 && (
//                             <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full flex items-center gap-1">
//                               <Target size={12} />
//                               {availableInActivity} available
//                             </span>
//                           )}
//                         </div>

//                         {/* Activity Dates */}
//                         <div className="flex items-center gap-4 text-sm text-gray-500">
//                           <div className="flex items-center gap-1">
//                             <Calendar size={14} />
//                             <span>Start: {formatDate(activity.start_date || activity.startDate)}</span>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <Calendar size={14} />
//                             <span>End: {formatDate(activity.end_date || activity.endDate)}</span>
//                           </div>
//                           {!isActivityCompleted && getDeadlineBadge(activity.end_date || activity.endDate)}
//                         </div>
//                       </div>

//                       <button
//                         onClick={() => toggleActivity(activity.id)}
//                         className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                       >
//                         {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//                       </button>
//                     </div>

//                     {/* Activity Progress */}
//                     <div className="mt-3">
//                       <div className="flex justify-between text-xs mb-1">
//                         <span className="text-gray-600">Activity Progress</span>
//                         <span className="font-semibold text-blue-600">{activityProgress}%</span>
//                       </div>
//                       <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
//                         <motion.div
//                           initial={{ width: 0 }}
//                           animate={{ width: `${activityProgress}%` }}
//                           className={`h-2 rounded-full ${getProgressColor(activityProgress)}`}
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Expanded Sub Activities */}
//                   <AnimatePresence>
//                     {isExpanded && (
//                       <motion.div
//                         initial={{ height: 0, opacity: 0 }}
//                         animate={{ height: "auto", opacity: 1 }}
//                         exit={{ height: 0, opacity: 0 }}
//                         className="border-t border-gray-100 bg-gray-50"
//                       >
//                         <div className="p-6">
//                           {subList.length === 0 ? (
//                             <p className="text-center text-gray-500 py-4">No tasks in this activity</p>
//                           ) : (
//                             <div className="space-y-4">
//                               {subList.map((sub) => {
//                                 const subName = sub.subactivity_name || sub.name;
//                                 const subProgress = sub.progress || 0;
//                                 const isSubCompleted = subProgress === 100;
//                                 const subStatus = sub.status_display || mapStatusToFrontend(sub.status);
//                                 const subUnit = sub.unit_display || mapUnitToFrontend(sub.unit);
//                                 const subPlannedQty = sub.total_quantity || sub.plannedQty || 0;
//                                 const subCompletedQty = sub.completed_quantity || sub.completedQty || 0;
//                                 const subDaysLeft = calculateDaysLeft(sub.end_date || sub.endDate);

//                                 return (
//                                   <div
//                                     key={sub.id}
//                                     className={`bg-white p-4 rounded-xl shadow-sm border ${
//                                       isSubCompleted ? 'border-green-200 bg-green-50/30' : 'border-gray-100'
//                                     }`}
//                                   >
//                                     <div className="flex items-center justify-between">
//                                       {/* Sub Activity Info */}
//                                       <div className="flex-1">
//                                         <div className="flex items-center gap-2 mb-2 flex-wrap">
//                                           <h5 className="font-medium text-gray-800">{subName}</h5>
//                                           <span className="text-xs bg-gray-100 px-2 py-1 rounded">
//                                             {subUnit === "status" ? "Status Based" : subUnit}
//                                           </span>

//                                           {isSubCompleted ? (
//                                             <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600 flex items-center gap-1">
//                                               <CheckCircle2 size={12} />
//                                               Completed
//                                             </span>
//                                           ) : (
//                                             <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(subStatus)}`}>
//                                               {subStatus}
//                                             </span>
//                                           )}
//                                         </div>

//                                         {/* Sub Activity Dates */}
//                                         <div className="flex items-center gap-3 text-xs text-gray-500">
//                                           <span>Start: {formatDate(sub.start_date || sub.startDate)}</span>
//                                           <span>End: {formatDate(sub.end_date || sub.endDate)}</span>
//                                           {!isSubCompleted && subDaysLeft !== null && subDaysLeft > 0 && (
//                                             <span className={`${
//                                               subDaysLeft <= 2 ? "text-red-600 font-semibold" : 
//                                               subDaysLeft <= 7 ? "text-yellow-600" : "text-blue-600"
//                                             }`}>
//                                               {subDaysLeft} days left
//                                             </span>
//                                           )}
//                                         </div>

//                                         {/* Quantity Info */}
//                                         {subUnit !== "status" && (
//                                           <div className="mt-2 text-sm">
//                                             <span className="text-gray-600">Planned: {subPlannedQty} {subUnit === "Percentage" ? "%" : subUnit}</span>
//                                             {subCompletedQty > 0 && (
//                                               <>
//                                                 <span className="mx-2">|</span>
//                                                 <span className="text-green-600">Completed: {subCompletedQty} {subUnit === "Percentage" ? "%" : subUnit}</span>
//                                               </>
//                                             )}
//                                           </div>
//                                         )}
//                                       </div>

//                                       {/* Pick Task Button */}
//                                       {!isSubCompleted && (
//                                         <button
//                                           onClick={() => handlePickTask(activity, sub)}
//                                           className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all hover:scale-105 shadow-lg flex items-center gap-2"
//                                           title="Pick this task"
//                                         >
//                                           <Briefcase size={18} />
//                                           <span className="text-sm font-medium">Pick Task</span>
//                                         </button>
//                                       )}
//                                     </div>

//                                     {/* Progress Bar */}
//                                     {!isSubCompleted && subUnit !== "status" && (
//                                       <div className="mt-3">
//                                         <div className="flex justify-between text-xs mb-1">
//                                           <span className="text-gray-600">Progress</span>
//                                           <span className="font-semibold text-blue-600">{subProgress}%</span>
//                                         </div>
//                                         <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
//                                           <motion.div
//                                             initial={{ width: 0 }}
//                                             animate={{ width: `${subProgress}%` }}
//                                             className={`h-1.5 rounded-full ${getProgressColor(subProgress)}`}
//                                           />
//                                         </div>
//                                       </div>
//                                     )}
//                                   </div>
//                                 );
//                               })}
//                             </div>
//                           )}
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </motion.div>
//               );
//             })
//           )}
//         </div>

//         {/* Info Banner */}
//         <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-start gap-3">
//           <Briefcase size={20} className="text-blue-600 mt-0.5" />
//           <div>
//             <h4 className="font-semibold text-blue-800 mb-1">How to pick tasks</h4>
//             <p className="text-sm text-blue-700">
//               Click the <span className="font-bold">"Pick Task"</span> button on any available task to add it to your personal task list. 
//               You can then track your progress and time in the <span className="font-bold">"My Tasks"</span> section.
//             </p>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // Helper Components
// const DetailItem = ({ label, value, icon }) => (
//   <div className="space-y-1">
//     <p className="text-xs text-gray-500 flex items-center gap-1">
//       {icon && icon}
//       {label}
//     </p>
//     <p className="font-medium text-sm text-gray-800 break-words">{value}</p>
//   </div>
// );

// const StatCard = ({ label, value }) => (
//   <div className="bg-gray-50 p-4 rounded-xl">
//     <p className="text-xs text-gray-500">{label}</p>
//     <p className="text-2xl font-bold text-gray-800">{value}</p>
//   </div>
// );

// export default UserProjectDetails;



// src/features/projects/UserProjectDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Calendar,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Building2,
  IndianRupee,
  Ruler,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  FileText,
  Briefcase,
  User,
  Layers,
  Target,
  Info,
  Loader2,
  Users,
  UserCheck,
  X,
  StopCircle,
  Play,
  Save
} from "lucide-react";
import { showSnackbar } from "../notifications/notificationSlice";
import TaskPickerModal from "../tasks/TaskPickerModal";
import { fetchProjects, fetchCompanies, fetchSubCompanies, fetchSectors, fetchClients } from "../api/apiSlice";
import { fetchUserTasks, pickTask, saveDailyWorkLog } from "../tasks/taskSlice";

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

// Map backend status to frontend
const mapStatusToFrontend = (backendStatus) => {
  const map = {
    "Pending": "PENDING",
    "Inprogress": "ONGOING",
    "Complete": "COMPLETED",
    "OnHold": "HOLD"
  };
  return map[backendStatus] || "PENDING";
};

// Map backend unit to frontend
const mapUnitToFrontend = (backendUnit) => {
  const map = {
    'Kilometer': 'Km',
    'Numbers': 'Nos.',
    'Percentage': 'Percentage'
  };
  return map[backendUnit] || backendUnit;
};

// Get picked status display
const getPickedStatusDisplay = (pickedAt, currentUserCode) => {
  if (!pickedAt || pickedAt.length === 0) return null;

  const isPickedByMe = pickedAt.some(pick => pick.emp_code === currentUserCode);
  const otherPickers = pickedAt.filter(pick => pick.emp_code !== currentUserCode);

  if (isPickedByMe) {
    return {
      isPicked: true,
      isByMe: true,
      message: "You have picked this task",
      color: "bg-green-100 text-green-700 border-green-200"
    };
  }

  if (otherPickers.length > 0) {
    return {
      isPicked: true,
      isByMe: false,
      message: `Picked by ${otherPickers[0].emp_name}`,
      color: "bg-yellow-100 text-yellow-700 border-yellow-200"
    };
  }

  return null;
};

const UserProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  // Get projects and reference data from api slice
  const {
    projects = [],
    loading: apiLoading,
    companies = [],
    subCompanies = [],
    sectors = [],
    clients = []
  } = useSelector((state) => state.api);
  const localProjects = useSelector((state) => state.projects?.projects || []);

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedActivities, setExpandedActivities] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const [activityTime, setActivityTime] = useState(null);
  const [timeLogData, setTimeLogData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    note: '',
    status: 'WORKED'
  });
  const [showTaskPicker, setShowTaskPicker] = useState(false);
  const [showTimeLogModal, setShowTimeLogModal] = useState(false);
  const [pickableactivity, setpickableactivity] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Create lookup maps
  const companyMap = useMemo(() => {
    const map = {};
    companies.forEach(company => {
      map[company.id] = company.name;
    });
    return map;
  }, [companies]);

  const subCompanyMap = useMemo(() => {
    const map = {};
    subCompanies.forEach(sub => {
      map[sub.id] = sub.name;
    });
    return map;
  }, [subCompanies]);

  const sectorMap = useMemo(() => {
    const map = {};
    sectors.forEach(sector => {
      map[sector.id] = sector.name;
    });
    return map;
  }, [sectors]);

  const clientMap = useMemo(() => {
    const map = {};
    clients.forEach(client => {
      map[client.id] = client.name;
    });
    return map;
  }, [clients]);

  // Fetch data if not loaded
  useEffect(() => {
    const loadData = async () => {
      if (projects.length === 0) {
        await Promise.all([
          dispatch(fetchProjects()),
          dispatch(fetchCompanies()),
          dispatch(fetchSubCompanies()),
          dispatch(fetchSectors()),
          dispatch(fetchClients())
        ]);
      }
    };
    loadData();
  }, [dispatch, projects.length]);

  // Find the project
  useEffect(() => {
    setLoading(true);

    let foundProject = projects.find(p => p.id === id || p.project_id === id);

    if (!foundProject) {
      foundProject = localProjects.find(p => p.id === id || p.project_id === id);
    }

    if (foundProject) {
      setProject(foundProject);
    } else {
      console.log("Project not found with ID:", id);
    }

    setLoading(false);
  }, [id, projects, localProjects]);

  // Helper functions to get display names
  const getCompanyName = useCallback(() => {
    const companyId = project?.company || project?.company_id;
    if (companyMap[companyId]) return companyMap[companyId];
    if (project?.company_detail?.name) return project.company_detail.name;
    if (project?.project_detail?.company_detail?.name) return project.project_detail.company_detail.name;
    return companyId || "—";
  }, [project, companyMap]);

  const getSubCompanyName = useCallback(() => {
    const subCompanyId = project?.sub_company || project?.sub_company_id;
    if (subCompanyMap[subCompanyId]) return subCompanyMap[subCompanyId];
    if (project?.sub_company_detail?.name) return project.sub_company_detail.name;
    if (project?.project_detail?.sub_company_detail?.name) return project.project_detail.sub_company_detail.name;
    return subCompanyId || "—";
  }, [project, subCompanyMap]);

  const getSectorName = useCallback(() => {
    const sectorId = project?.sector || project?.sector_id;
    if (sectorMap[sectorId]) return sectorMap[sectorId];
    if (project?.sector_detail?.name) return project.sector_detail.name;
    if (project?.project_detail?.sector_detail?.name) return project.project_detail.sector_detail.name;
    return sectorId || "—";
  }, [project, sectorMap]);

  const getClientName = useCallback(() => {
    const clientId = project?.client || project?.client_id;
    if (clientMap[clientId]) return clientMap[clientId];
    if (project?.client_detail?.name) return project.client_detail.name;
    if (project?.project_detail?.client_detail?.name) return project.project_detail.client_detail.name;
    return clientId || project?.department || "—";
  }, [project, clientMap]);

  const getProjectName = useCallback(() => {
    return project?.name || project?.project_name || "Unnamed Project";
  }, [project]);

  const getProjectCode = useCallback(() => {
    return project?.code || project?.project_code || "N/A";
  }, [project]);

  const getProjectStatus = useCallback(() => {
    return mapStatusToFrontend(project?.status);
  }, [project]);

  const getProjectProgress = useCallback(() => {
    return project?.progress || 0;
  }, [project]);

  const getProjectLocation = useCallback(() => {
    return project?.location || "—";
  }, [project]);

  const getProjectTotalLength = useCallback(() => {
    const value = project?.total_length || project?.totalLength || 0;
    return `${value} km`;
  }, [project]);

  const getProjectCost = useCallback(() => {
    const value = project?.cost || project?.workorder_cost || 0;
    return `₹ ${value} Lakhs`;
  }, [project]);

  const getProjectLoaDate = useCallback(() => {
    const date = project?.loa_date || project?.loaDate;
    return date ? formatDate(date) : "Not set";
  }, [project]);

  const getProjectDirectorProposalDate = useCallback(() => {
    const date = project?.director_proposal_date || project?.directorProposalDate;
    return date ? formatDate(date) : "Not set";
  }, [project]);

  const getProjectConfirmationDate = useCallback(() => {
    const date = project?.project_confirmation_date || project?.projectConfirmationDate;
    return date ? formatDate(date) : "Not set";
  }, [project]);

  const getProjectCompletionDate = useCallback(() => {
    return project?.completion_date || project?.completionDate;
  }, [project]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "Not set";
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return "Invalid date";
    }
  }, []);

  const toggleActivity = (activityId) => {
    setExpandedActivities(prev => ({
      ...prev,
      [activityId]: !prev[activityId]
    }));
  };

  const handlePickTask = async (activity, subActivity) => {
    // setSelectedTask({ project, activity, subActivity });
    // setShowTaskPicker(true);

    try {
      const projectId = project.id || project.project_id;
      const projectName = project.name || project.project_name || project.project?.name;
      const projectCode = project.code || project.project_code || project.project?.code;
      const activityId = activity.id || activity.activity_id;
      const activityName = activity.name || activity.activity_name;
      const subActivityName = subActivity.name || subActivity.subactivity_name;
      const unit = subActivity.unit || subActivity.unit_display || 'status';
      const totalQuantity = subActivity.total_quantity || subActivity.plannedQty || 0;
      const deadline = subActivity.end_date || activity.end_date || project.completion_date;

      await dispatch(pickTask({
        subActivityId: subActivity.id,
        empCode: user.id,
        empName: user.name,
        projectId: projectId,
        projectName: projectName,
        projectCode: projectCode,
        activityId: activityId,
        activityName: activityName,
        subActivityName: subActivityName,
        unit: unit,
        totalQuantity: totalQuantity,
        deadline: deadline
      })).unwrap();
      return true;
    } catch (error) {
      console.error('Error picking task:', error);
      return false;
    }
  };

  const calculateDaysLeft = (endDate) => {
    if (!endDate) return null;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);
      const diffTime = end - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (e) {
      return null;
    }
  };

  const getDeadlineBadge = (endDate, isCompleted = false) => {
    if (isCompleted) return null;
    const days = calculateDaysLeft(endDate);
    if (days === null) return null;
    if (days < 0) return <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">Overdue</span>;
    if (days === 0) return <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">Due Today</span>;
    if (days <= 2) return <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full">{days} days left</span>;
    if (days <= 7) return <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full">{days} days left</span>;
    return <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">{days} days left</span>;
  };

  const getStatusColor = (status) => {
    const frontendStatus = mapStatusToFrontend(status);
    switch (frontendStatus) {
      case "COMPLETED": return "bg-green-100 text-green-600 border-green-200";
      case "ONGOING": return "bg-blue-100 text-blue-600 border-blue-200";
      case "DELAYED": return "bg-red-100 text-red-600 border-red-200";
      case "HOLD": return "bg-yellow-100 text-yellow-600 border-yellow-200";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return "bg-green-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    if (progress >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  if (loading || apiLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white rounded-2xl p-8 shadow-xl flex items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <div>
            <p className="text-lg font-semibold text-gray-800">Loading Project</p>
            <p className="text-sm text-gray-500">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center px-4">
          <XCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Project not found</h2>
          <p className="text-gray-600 mb-6">Project ID: {id}</p>
          <button
            onClick={() => navigate("/all-projects")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const activities = project.activities_detail || project.activities || [];
  const totalSubActivities = activities.reduce((acc, act) =>
    acc + (act.subactivities?.length || act.subActivities?.length || 0), 0
  );
  const availableTasks = activities.reduce((acc, act) => {
    const subs = act.subactivities || act.subActivities || [];
    return acc + subs.filter(s => {
      const status = s.status_display || mapStatusToFrontend(s.status);
      // Check if task is not completed AND not picked by anyone else
      const isPickedByOthers = s.picked_at && s.picked_at.length > 0 && !s.picked_at.some(p => p.emp_code === user?.id);
      return status !== "COMPLETED" && !isPickedByOthers;
    }).length;
  }, 0);


  const handleSaveTimeLog = async () => {
    if (!selectedTask) return;

    // if (pickableactivity) {
    //   await handlePickTask(activityTime, selectedTask);
    // }

    // Validate
    if (timeLogData.status === 'NOT_WORKED') {
      if (!timeLogData.note.trim()) {
        dispatch(showSnackbar({
          message: 'Please provide a reason for not working',
          type: 'error'
        }));
        return;
      }
    } else {
      if (!timeLogData.startTime || !timeLogData.endTime) {
        dispatch(showSnackbar({
          message: 'Please enter both start and end time',
          type: 'error'
        }));
        return;
      }

      if (timeLogData.startTime >= timeLogData.endTime) {
        dispatch(showSnackbar({
          message: 'End time must be after start time',
          type: 'error'
        }));
        return;
      }
    }

    setIsSaving(true);
    try {
      await dispatch(saveDailyWorkLog({
        projectbyId: window.location.pathname?.split("/")[2],
        subActivityId: selectedTask.id,
        empCode: user?.id,
        date: timeLogData.date,
        startTime: timeLogData.status === 'WORKED' ? timeLogData.startTime : null,
        endTime: timeLogData.status === 'WORKED' ? timeLogData.endTime : null,
        note: timeLogData.note,
        status: timeLogData.status
      })).unwrap();

      dispatch(showSnackbar({
        message: timeLogData.status === 'WORKED' ? 'Work hours saved successfully!' : 'Leave record saved successfully!',
        type: 'success'
      }));

      setShowTimeLogModal(false);
      setSelectedTask(null);
      setTimeLogData({
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        note: '',
        status: 'WORKED'
      });
      // Refresh tasks after update
      await dispatch(fetchUserTasks(user.id));
    } catch (error) {
      dispatch(showSnackbar({
        message: error.message || 'Failed to save record',
        type: 'error'
      }));
    } finally {
      setIsSaving(false);
    }
  };
  const calculateHours = (start, end) => {
    if (!start || !end) return 0;
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    let hours = endH - startH;
    let minutes = endM - startM;
    if (minutes < 0) {
      hours--;
      minutes += 60;
    }
    return hours + minutes / 60;
  };

  // console.log(window.location.pathname?.split("/")[2]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
    >
      {/* Task Picker Modal */}
      <AnimatePresence>
        {showTaskPicker && selectedTask && (
          <TaskPickerModal
            project={selectedTask.project}
            activity={selectedTask.activity}
            subActivity={selectedTask.subActivity}
            onClose={() => {
              setShowTaskPicker(false);
              setSelectedTask(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Time Log Modal */}
      <AnimatePresence>
        {showTimeLogModal && selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowTimeLogModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Daily Work Log</h3>
                <button onClick={() => setShowTimeLogModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Task</label>
                <p className="text-gray-800 font-medium">{selectedTask.subactivity_name}</p>
                <p className="text-sm text-gray-500">{selectedTask.project_name}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={timeLogData.date}
                  onChange={(e) => setTimeLogData({ ...timeLogData, date: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTimeLogData({ ...timeLogData, status: 'WORKED' })}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${timeLogData.status === 'WORKED'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                  >
                    <Play size={18} />
                    <span>Worked</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeLogData({ ...timeLogData, status: 'NOT_WORKED' })}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${timeLogData.status === 'NOT_WORKED'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                  >
                    <StopCircle size={18} />
                    <span>Not Worked</span>
                  </button>
                </div>
              </div>

              {timeLogData.status === 'WORKED' ? (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                      <input
                        type="time"
                        value={timeLogData.startTime}
                        onChange={(e) => setTimeLogData({ ...timeLogData, startTime: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                      <input
                        type="time"
                        value={timeLogData.endTime}
                        onChange={(e) => setTimeLogData({ ...timeLogData, endTime: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {timeLogData.startTime && timeLogData.endTime && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-700">Total Hours:</span>
                        <span className="text-lg font-bold text-blue-700">
                          {calculateHours(timeLogData.startTime, timeLogData.endTime).toFixed(2)} hrs
                        </span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for not working *</label>
                  <textarea
                    value={timeLogData.note}
                    onChange={(e) => setTimeLogData({ ...timeLogData, note: e.target.value })}
                    placeholder="Please explain why you couldn't work today..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                <textarea
                  value={timeLogData.note}
                  onChange={(e) => setTimeLogData({ ...timeLogData, note: e.target.value })}
                  placeholder="Any additional notes about your work..."
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowTimeLogModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTimeLog}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Save Record
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/all-projects")}
              className="p-2 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{getProjectName()}</h1>
              <p className="text-sm text-gray-500">
                Code: {getProjectCode()} | {project.short_name && `Short Name: ${project.short_name}`}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/projects/${id}/logs`)}
            className="bg-gray-800 text-white px-4 py-2 rounded-xl hover:bg-gray-900 transition-all flex items-center gap-2"
          >
            <FileText size={18} />
            View Logs
          </button>
        </div>

        {/* Status Banner */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${getProjectStatus() === "DELAYED" ? "bg-red-50 border border-red-200" :
            getProjectStatus() === "COMPLETED" ? "bg-green-50 border border-green-200" :
              "bg-blue-50 border border-blue-200"
            }`}
        >
          <div className="flex items-center gap-3">
            {getProjectStatus() === "DELAYED" ? (
              <AlertCircle className="text-red-600" size={24} />
            ) : getProjectStatus() === "COMPLETED" ? (
              <CheckCircle2 className="text-green-600" size={24} />
            ) : (
              <Clock className="text-blue-600" size={24} />
            )}
            <div>
              <p className="font-semibold">
                Project Status: <span className={
                  getProjectStatus() === "DELAYED" ? "text-red-600" :
                    getProjectStatus() === "COMPLETED" ? "text-green-600" :
                      "text-blue-600"
                }>{getProjectStatus()}</span>
              </p>
              <p className="text-sm text-gray-600">
                {getProjectProgress() === 100 ? `Completed on ${formatDate(getProjectCompletionDate())}` :
                  getDeadlineStatus(getProjectCompletionDate()) === "OVERDUE" ? "Project is overdue" :
                    getDeadlineStatus(getProjectCompletionDate()) === "TODAY" ? "Project due today!" :
                      getDeadlineStatus(getProjectCompletionDate()) === "CRITICAL" ? "Project deadline critical" :
                        "Project is on track"}
              </p>
            </div>
          </div>
          <div className="text-right w-full md:w-auto">
            <p className="text-sm text-gray-600">
              {getProjectProgress() === 100 ? "Completion Date" : "Deadline"}
            </p>
            <p className="font-semibold">{formatDate(getProjectCompletionDate())}</p>
            {getProjectProgress() !== 100 && getDeadlineBadge(getProjectCompletionDate())}
          </div>
        </motion.div>

        {/* Summary Card */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white shadow-2xl rounded-3xl p-8 border border-gray-100"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 size={20} className="text-blue-600" />
                Project Details
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Company" value={getCompanyName()} />
                <DetailItem label="Sub Company" value={getSubCompanyName()} />
                <DetailItem label="Location" value={getProjectLocation()} icon={<MapPin size={12} />} />
                <DetailItem label="Sector" value={getSectorName()} />
                <DetailItem label="Client/Dept" value={getClientName()} />
                <DetailItem label="Total Length" value={getProjectTotalLength()} icon={<Ruler size={12} />} />
                <DetailItem label="Workorder Cost" value={getProjectCost()} icon={<IndianRupee size={12} />} />
                <DetailItem label="LOA Date" value={getProjectLoaDate()} icon={<Calendar size={12} />} />
              </div>

              {/* Additional Dates */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="font-semibold text-gray-700 mb-3">Key Milestones</h4>
                <div className="grid grid-cols-2 gap-4">
                  <DetailItem label="Director Proposal" value={getProjectDirectorProposalDate()} />
                  <DetailItem label="Project Confirmation" value={getProjectConfirmationDate()} />
                </div>
              </div>
            </div>

            {/* Right Progress */}
            <div className="border-l border-gray-100 pl-8">
              <h4 className="text-xl font-semibold text-gray-800 mb-6">Progress Overview</h4>

              <div className="space-y-6">
                {/* Main Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Overall Progress</span>
                    <span className="text-blue-600 font-bold">{getProjectProgress()}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${getProjectProgress()}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-4 rounded-full ${getProgressColor(getProjectProgress())}`}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <StatCard label="Total Activities" value={activities.length} />
                  <StatCard label="Total Tasks" value={totalSubActivities} />
                </div>

                {/* Available Tasks */}
                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Target size={16} className="text-green-600" />
                    <span className="text-sm font-semibold text-green-700">Available to Pick</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">{availableTasks}</p>
                  <p className="text-xs text-green-600 mt-1">Tasks you can pick to work on</p>
                </div>

                {/* Status Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(getProjectStatus())}`}>
                    {getProjectStatus()}
                  </span>
                  {project.extensionRequested && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-600">
                      Extension Requested
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Activities Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <ClipboardList size={24} className="text-blue-600" />
              Available Tasks to Pick
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User size={16} />
              <span>{user?.name}</span>
            </div>
          </div>

          {activities.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
              <Layers size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Activities Yet</h3>
              <p className="text-gray-500">This project doesn't have any activities defined.</p>
            </div>
          ) : (
            activities.map((activity) => {
              const isExpanded = expandedActivities[activity.id];
              const activityName = activity.activity_name || activity.name;
              const activityProgress = activity.progress || 0;
              const isActivityCompleted = activityProgress === 100;
              const subList = activity.subactivities || activity.subActivities || [];
              const availableInActivity = subList.filter(s => {
                const status = s.status_display || mapStatusToFrontend(s.status);
                const isPickedByOthers = s.picked_at && s.picked_at.length > 0 && !s.picked_at.some(p => p.emp_code === user?.id);
                return status !== "COMPLETED" && !isPickedByOthers;
              }).length;

              return (
                <motion.div
                  key={activity.id}
                  layout
                  className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100"
                >
                  {/* Activity Header */}
                  <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-800">{activityName}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${isActivityCompleted ? "bg-green-100 text-green-600" :
                            "bg-blue-100 text-blue-600"
                            }`}>
                            {isActivityCompleted ? "Completed" : "Ongoing"}
                          </span>
                          {availableInActivity > 0 && (
                            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full flex items-center gap-1">
                              <Target size={12} />
                              {availableInActivity} available
                            </span>
                          )}
                        </div>

                        {/* Activity Dates */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>Start: {formatDate(activity.start_date || activity.startDate)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>End: {formatDate(activity.end_date || activity.endDate)}</span>
                          </div>
                          {!isActivityCompleted && getDeadlineBadge(activity.end_date || activity.endDate)}
                        </div>
                      </div>

                      <button
                        onClick={() => toggleActivity(activity.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors self-start"
                      >
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>

                    {/* Activity Progress */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Activity Progress</span>
                        <span className="font-semibold text-blue-600">{activityProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${activityProgress}%` }}
                          className={`h-2 rounded-full ${getProgressColor(activityProgress)}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Sub Activities */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-100 bg-gray-50"
                      >
                        <div className="p-6">
                          {subList.length === 0 ? (
                            <p className="text-center text-gray-500 py-4">No tasks in this activity</p>
                          ) : (
                            <div className="space-y-4">
                              {subList.map((sub) => {
                                const subName = sub.subactivity_name || sub.name;
                                const subProgress = sub.progress || 0;
                                const isSubCompleted = subProgress === 100;
                                const subStatus = sub.status_display || mapStatusToFrontend(sub.status);
                                const subUnit = sub.unit_display || mapUnitToFrontend(sub.unit);
                                const subPlannedQty = sub.total_quantity || sub.plannedQty || 0;
                                const subCompletedQty = sub.completed_quantity || sub.completedQty || 0;
                                const subDaysLeft = calculateDaysLeft(sub.end_date || sub.endDate);

                                // Check if task is picked by someone else
                                const pickedStatus = getPickedStatusDisplay(sub.picked_at, user?.id);
                                const isPickable = !isSubCompleted && !pickedStatus;

                                return (
                                  <div
                                    key={sub.id}
                                    className={`bg-white p-4 rounded-xl shadow-sm border ${isSubCompleted ? 'border-green-200 bg-green-50/30' :
                                      // pickedStatus?.isPicked ? 'border-yellow-200 bg-yellow-50/30' :
                                      'border-gray-100'
                                      }`}
                                  >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                      {/* Sub Activity Info */}
                                      <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                          <h5 className="font-medium text-gray-800">{subName}</h5>
                                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                            {subUnit === "status" ? "Status Based" : subUnit}
                                          </span>

                                          {isSubCompleted ? (
                                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600 flex items-center gap-1">
                                              <CheckCircle2 size={12} />
                                              Completed
                                            </span>
                                            // ) : pickedStatus ? (
                                            //   <div className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${pickedStatus.color}`}>
                                            //     {pickedStatus.isByMe ? <CheckCircle2 size={12} /> : <Users size={12} />}
                                            //     {pickedStatus.message}
                                            //   </div>
                                          ) : (
                                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(subStatus)}`}>
                                              {subStatus}
                                            </span>
                                          )}
                                        </div>

                                        {/* Sub Activity Dates */}
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                          <span>Start: {formatDate(sub.start_date || sub.startDate)}</span>
                                          <span>End: {formatDate(sub.end_date || sub.endDate)}</span>
                                          {!isSubCompleted && subDaysLeft !== null && subDaysLeft > 0 && (
                                            <span className={`${subDaysLeft <= 2 ? "text-red-600 font-semibold" :
                                              subDaysLeft <= 7 ? "text-yellow-600" : "text-blue-600"
                                              }`}>
                                              {subDaysLeft} days left
                                            </span>
                                          )}
                                        </div>

                                        {/* Quantity Info */}
                                        {subUnit !== "status" && (
                                          <div className="mt-2 text-sm">
                                            <span className="text-gray-600">Planned: {subPlannedQty} {subUnit === "Percentage" ? "%" : subUnit}</span>
                                            {subCompletedQty > 0 && (
                                              <>
                                                <span className="mx-2">|</span>
                                                <span className="text-green-600">Completed: {subCompletedQty} {subUnit === "Percentage" ? "%" : subUnit}</span>
                                              </>
                                            )}
                                          </div>
                                        )}
                                      </div>

                                      {/* Pick Task Button - Only if not picked and not completed */}
                                      {/* {isPickable && (
                                        <button
                                          onClick={() => handlePickTask(activity, sub)}
                                          className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all hover:scale-105 shadow-lg flex items-center gap-2 self-start"
                                          title="Pick this task"
                                        >
                                          <Briefcase size={18} />
                                          <span className="text-sm font-medium">Pick Task</span>
                                        </button>
                                      )} */}

                                      {/* Action Buttons */}
                                      {!isSubCompleted && (
                                        <div className="flex items-center gap-2">
                                          <button
                                            onClick={() => {
                                              setSelectedTask(sub);
                                              setActivityTime(activity);
                                              setTimeLogData({
                                                date: new Date().toISOString().split('T')[0],
                                                startTime: '',
                                                endTime: '',
                                                note: '',
                                                status: 'WORKED'
                                              });
                                              setShowTimeLogModal(true);
                                              setpickableactivity(isExpanded)
                                            }}
                                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                            title="Log daily work"
                                          >
                                            <Clock size={18} />
                                          </button>
                                        </div>)}
                                    </div>

                                    {/* Progress Bar */}
                                    {!isSubCompleted && subUnit !== "status" && (
                                      <div className="mt-3">
                                        <div className="flex justify-between text-xs mb-1">
                                          <span className="text-gray-600">Progress</span>
                                          <span className="font-semibold text-blue-600">{subProgress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                          <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${subProgress}%` }}
                                            className={`h-1.5 rounded-full ${getProgressColor(subProgress)}`}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-start gap-3">
          <Briefcase size={20} className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">How to pick tasks</h4>
            <p className="text-sm text-blue-700">
              Click the <span className="font-bold">"Pick Task"</span> button on any available task to add it to your personal task list.
              Once picked, other users cannot pick the same task. You can track your progress in the <span className="font-bold">"My Tasks"</span> section.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Helper Components
const DetailItem = ({ label, value, icon }) => (
  <div className="space-y-1">
    <p className="text-xs text-gray-500 flex items-center gap-1">
      {icon && icon}
      {label}
    </p>
    <p className="font-medium text-sm text-gray-800 break-words">{value}</p>
  </div>
);

const StatCard = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-xl">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

export default UserProjectDetails;