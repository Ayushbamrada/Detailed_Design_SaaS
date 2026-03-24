// import { useParams, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   Calendar, 
//   Clock, 
//   AlertCircle, 
//   CheckCircle, 
//   XCircle,
//   FileText,
//   ArrowLeft,
//   Filter,
//   User,
//   Trash2,
//   RefreshCw,
//   Loader2,
//   Info,
//   TrendingUp,
//   Activity,
//   Building2
// } from "lucide-react";
// import { fetchProjectLogs, createLog, deleteLog } from "../dailyLogs/logSlice";
// import { showSnackbar } from "../notifications/notificationSlice";
// import { fetchProjects } from "../api/apiSlice";

// const ProjectLogs = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { user } = useSelector((state) => state.auth);
//   // Get projects from both API slice and local slice
//   const { projects: apiProjects = [] } = useSelector((state) => state.api);
//   const { projects: localProjects = [] } = useSelector((state) => state.projects);
//   const { projectLogs, loading } = useSelector((state) => state.logs);
  
//   // Find project from either source
//   const project = [...apiProjects, ...localProjects].find(
//     p => p.id === id || p.project_id === id
//   );

//   const [filter, setFilter] = useState("all");
//   const [showAddLog, setShowAddLog] = useState(false);
//   const [selectedLog, setSelectedLog] = useState(null);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [newLog, setNewLog] = useState({
//     event_type: "MANUAL_LOG",
//     message: ""
//   });

//   useEffect(() => {
//     // Fetch projects if not available
//     if (!project && apiProjects.length === 0) {
//       dispatch(fetchProjects());
//     }
    
//     // Fetch logs for this project
//     if (id) {
//       dispatch(fetchProjectLogs(id));
//     }
//   }, [dispatch, id, project, apiProjects.length]);

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await dispatch(fetchProjectLogs(id));
//     setRefreshing(false);
//   };

//   if (!project && !loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <XCircle size={48} className="text-red-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-800">Project not found</h2>
//           <p className="text-gray-600 mb-4">Project ID: {id}</p>
//           <button
//             onClick={() => navigate("/projects")}
//             className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Back to Projects
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const handleAddLog = async () => {
//     if (!newLog.message.trim()) {
//       dispatch(showSnackbar({
//         message: "Please enter a message",
//         type: "error"
//       }));
//       return;
//     }

//     const logData = {
//       project: id,
//       event_type: newLog.event_type,
//       message: newLog.message,
//       created_at: new Date().toISOString()
//     };

//     try {
//       await dispatch(createLog(logData)).unwrap();
//       dispatch(showSnackbar({
//         message: "Log added successfully",
//         type: "success"
//       }));
//       setShowAddLog(false);
//       setNewLog({
//         event_type: "MANUAL_LOG",
//         message: ""
//       });
//       // Refresh logs
//       dispatch(fetchProjectLogs(id));
//     } catch (error) {
//       dispatch(showSnackbar({
//         message: error.message || "Failed to add log",
//         type: "error"
//       }));
//     }
//   };

//   const handleDeleteLog = async (logId) => {
//     if (user?.role !== "SUPER_ADMIN") {
//       dispatch(showSnackbar({
//         message: "Only Super Admin can delete logs",
//         type: "error"
//       }));
//       return;
//     }

//     try {
//       await dispatch(deleteLog(logId)).unwrap();
//       dispatch(showSnackbar({
//         message: "Log deleted successfully",
//         type: "success"
//       }));
//       setShowDeleteConfirm(false);
//       setSelectedLog(null);
//     } catch (error) {
//       dispatch(showSnackbar({
//         message: error.message || "Failed to delete log",
//         type: "error"
//       }));
//     }
//   };

//   const filteredLogs = filter === "all" 
//     ? projectLogs 
//     : projectLogs.filter(log => log.event_type === filter);

//   const getLogIcon = (eventType) => {
//     switch(eventType) {
//       case "Project Created":
//         return <FileText className="text-blue-500" size={20} />;
//       case "Project Updated":
//         return <RefreshCw className="text-green-500" size={20} />;
//       case "Progress Changed":
//         return <TrendingUp className="text-purple-500" size={20} />;
//       case "Activity Updated":
//       case "Activity Created":
//         return <Activity className="text-indigo-500" size={20} />;
//       case "SubActivity Updated":
//       case "SubActivity Created":
//         return <CheckCircle className="text-emerald-500" size={20} />;
//       case "Extension Requested":
//         return <Clock className="text-yellow-500" size={20} />;
//       case "Extension Approved":
//         return <CheckCircle className="text-green-500" size={20} />;
//       case "Extension Rejected":
//         return <XCircle className="text-red-500" size={20} />;
//       case "MANUAL_LOG":
//         return <FileText className="text-orange-500" size={20} />;
//       default:
//         return <Info className="text-gray-500" size={20} />;
//     }
//   };

//   const getLogColor = (eventType) => {
//     switch(eventType) {
//       case "Project Created":
//         return "border-blue-200 bg-blue-50";
//       case "Project Updated":
//         return "border-green-200 bg-green-50";
//       case "Progress Changed":
//         return "border-purple-200 bg-purple-50";
//       case "Activity Updated":
//       case "Activity Created":
//         return "border-indigo-200 bg-indigo-50";
//       case "SubActivity Updated":
//       case "SubActivity Created":
//         return "border-emerald-200 bg-emerald-50";
//       case "Extension Requested":
//         return "border-yellow-200 bg-yellow-50";
//       case "Extension Approved":
//         return "border-green-200 bg-green-50";
//       case "Extension Rejected":
//         return "border-red-200 bg-red-50";
//       case "MANUAL_LOG":
//         return "border-orange-200 bg-orange-50";
//       default:
//         return "border-gray-200 bg-gray-50";
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const formatValue = (value) => {
//     if (value === null || value === undefined) return "N/A";
//     if (typeof value === 'object') return JSON.stringify(value, null, 2);
//     return String(value);
//   };

//   if (loading || refreshing) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="bg-white rounded-2xl p-8 shadow-xl flex items-center gap-4">
//           <Loader2 className="animate-spin text-blue-600" size={32} />
//           <div>
//             <p className="text-lg font-semibold text-gray-800">Loading Logs</p>
//             <p className="text-sm text-gray-500">Fetching project history...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="max-w-7xl mx-auto space-y-8 px-4 py-6"
//     >
//       {/* Delete Confirmation Modal */}
//       <AnimatePresence>
//         {showDeleteConfirm && selectedLog && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//             onClick={() => setShowDeleteConfirm(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.9 }}
//               className="bg-white rounded-2xl p-6 max-w-md w-full"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <h3 className="text-xl font-bold mb-4">Delete Log</h3>
//               <p className="text-gray-600 mb-6">
//                 Are you sure you want to delete this log? This action cannot be undone.
//               </p>
//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => setShowDeleteConfirm(false)}
//                   className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => handleDeleteLog(selectedLog.id)}
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Add Log Modal */}
//       <AnimatePresence>
//         {showAddLog && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//             onClick={() => setShowAddLog(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.9 }}
//               className="bg-white rounded-2xl p-6 max-w-md w-full"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <h3 className="text-xl font-bold mb-4">Add Manual Log</h3>
              
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
//                   <select
//                     value={newLog.event_type}
//                     onChange={(e) => setNewLog({...newLog, event_type: e.target.value})}
//                     className="w-full px-4 py-2 border border-gray-200 rounded-xl"
//                   >
//                     <option value="MANUAL_LOG">Manual Log</option>
//                     <option value="STATUS_UPDATE">Status Update</option>
//                     <option value="PROGRESS_CHANGED">Progress Changed</option>
//                     <option value="EXTENSION_REQUESTED">Extension Request</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
//                   <textarea
//                     value={newLog.message}
//                     onChange={(e) => setNewLog({...newLog, message: e.target.value})}
//                     placeholder="Log message"
//                     rows={3}
//                     className="w-full px-4 py-2 border border-gray-200 rounded-xl"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="flex justify-end gap-2 mt-6">
//                 <button
//                   onClick={() => setShowAddLog(false)}
//                   className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleAddLog}
//                   disabled={loading}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                 >
//                   {loading && <Loader2 size={16} className="animate-spin" />}
//                   Add Log
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate(`/projects/${id}`)}
//             className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
//           >
//             <ArrowLeft size={20} />
//           </button>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">
//               {project?.name || project?.project_name || 'Project'} Logs
//             </h1>
//             <p className="text-sm text-gray-500 flex items-center gap-2">
//               <Building2 size={14} />
//               Code: {project?.code || project?.project_code || 'N/A'} | 
//               Total Logs: {projectLogs.length}
//             </p>
//           </div>
//         </div>
        
//         <div className="flex gap-3">
//           <button
//             onClick={handleRefresh}
//             disabled={loading || refreshing}
//             className="bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 flex items-center gap-2"
//           >
//             <RefreshCw size={18} className={(loading || refreshing) ? 'animate-spin' : ''} />
//             Refresh
//           </button>
//           <button
//             onClick={() => setShowAddLog(true)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2"
//           >
//             <FileText size={18} />
//             Add Log
//           </button>
//         </div>
//       </div>

//       {/* Project Info Card */}
//       {project && (
//         <motion.div
//           initial={{ y: -20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100"
//         >
//           <div className="grid md:grid-cols-4 gap-4">
//             <div>
//               <p className="text-sm text-gray-600">Project Code</p>
//               <p className="text-lg font-semibold text-gray-800">{project.code || project.project_code}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Company</p>
//               <p className="text-lg font-semibold text-gray-800">
//                 {project.company_detail?.name || project.company || 'N/A'}
//               </p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Location</p>
//               <p className="text-lg font-semibold text-gray-800">{project.location || 'N/A'}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Status</p>
//               <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
//                 project.status === "COMPLETED" ? "bg-green-100 text-green-600" :
//                 project.status === "DELAYED" ? "bg-red-100 text-red-600" :
//                 "bg-blue-100 text-blue-600"
//               }`}>
//                 {project.status || "ONGOING"}
//               </span>
//             </div>
//           </div>
//         </motion.div>
//       )}

//       {/* Filters */}
//       <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
//         <div className="flex items-center gap-4 flex-wrap">
//           <div className="flex items-center gap-2">
//             <Filter size={18} className="text-gray-400" />
//             <span className="text-sm font-medium text-gray-700">Filter by:</span>
//           </div>
          
//           <select
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//             className="border border-gray-200 bg-gray-50 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="all">All Logs</option>
//             <option value="Project Created">Project Created</option>
//             <option value="Project Updated">Project Updated</option>
//             <option value="Progress Changed">Progress Changed</option>
//             <option value="Activity Created">Activity Created</option>
//             <option value="Activity Updated">Activity Updated</option>
//             <option value="SubActivity Created">SubActivity Created</option>
//             <option value="SubActivity Updated">SubActivity Updated</option>
//             <option value="Extension Requested">Extension Requests</option>
//             <option value="Extension Approved">Extension Approved</option>
//             <option value="Extension Rejected">Extension Rejected</option>
//             <option value="MANUAL_LOG">Manual Logs</option>
//           </select>

//           {filter !== "all" && (
//             <button
//               onClick={() => setFilter("all")}
//               className="text-sm text-blue-600 hover:text-blue-700"
//             >
//               Clear Filter
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Logs Stats */}
//       {filteredLogs.length > 0 && (
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
//             <p className="text-xs text-gray-500">Total Logs</p>
//             <p className="text-xl font-bold text-gray-800">{filteredLogs.length}</p>
//           </div>
//           <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
//             <p className="text-xs text-gray-500">Unique Events</p>
//             <p className="text-xl font-bold text-gray-800">
//               {new Set(filteredLogs.map(l => l.event_type)).size}
//             </p>
//           </div>
//           <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
//             <p className="text-xs text-gray-500">Latest Log</p>
//             <p className="text-sm font-semibold text-gray-800">
//               {filteredLogs[0] ? formatDate(filteredLogs[0].created_at).split(',')[0] : 'N/A'}
//             </p>
//           </div>
//           <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
//             <p className="text-xs text-gray-500">Oldest Log</p>
//             <p className="text-sm font-semibold text-gray-800">
//               {filteredLogs[filteredLogs.length-1] ? formatDate(filteredLogs[filteredLogs.length-1].created_at).split(',')[0] : 'N/A'}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Logs List */}
//       <div className="space-y-4">
//         <AnimatePresence>
//           {filteredLogs.length > 0 ? (
//             filteredLogs.map((log) => (
//               <motion.div
//                 key={log.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 className={`bg-white rounded-2xl shadow-lg border-2 ${getLogColor(log.event_type)} overflow-hidden group`}
//               >
//                 <div className="p-6">
//                   <div className="flex items-start gap-4">
//                     <div className="mt-1">
//                       {getLogIcon(log.event_type)}
//                     </div>
                    
//                     <div className="flex-1">
//                       <div className="flex items-center gap-3 mb-2 flex-wrap">
//                         <h3 className="font-semibold text-gray-800">{log.event_type}</h3>
//                         <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
//                           {formatDate(log.created_at)}
//                         </span>
//                       </div>
                      
//                       <p className="text-gray-600 mb-3">{log.message}</p>
                      
//                       {/* Old/New Values Comparison */}
//                       {(log.old_value || log.new_value) && (
//                         <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
//                           <h4 className="text-sm font-semibold text-gray-700 mb-3">Changes</h4>
//                           <div className="grid md:grid-cols-2 gap-4">
//                             {log.old_value && (
//                               <div>
//                                 <p className="text-xs font-medium text-gray-500 mb-2">Previous Value</p>
//                                 <pre className="text-xs bg-white p-3 rounded-lg border border-gray-200 overflow-auto max-h-40">
//                                   {JSON.stringify(log.old_value, null, 2)}
//                                 </pre>
//                               </div>
//                             )}
//                             {log.new_value && (
//                               <div>
//                                 <p className="text-xs font-medium text-gray-500 mb-2">New Value</p>
//                                 <pre className="text-xs bg-white p-3 rounded-lg border border-gray-200 overflow-auto max-h-40">
//                                   {JSON.stringify(log.new_value, null, 2)}
//                                 </pre>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       )}

//                       {/* Related Entity Info */}
//                       {(log.activity_detail || log.subactivity_detail) && (
//                         <div className="mt-3 flex gap-2 text-xs text-gray-500">
//                           {log.activity_detail && (
//                             <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded">
//                               Activity: {log.activity_detail.activity_name}
//                             </span>
//                           )}
//                           {log.subactivity_detail && (
//                             <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded">
//                               SubActivity: {log.subactivity_detail.subactivity_name}
//                             </span>
//                           )}
//                         </div>
//                       )}

//                       {/* Performed By */}
//                       {log.performed_by_detail && (
//                         <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
//                           <User size={12} />
//                           <span>By: {log.performed_by_detail.username || 'System'}</span>
//                         </div>
//                       )}
//                     </div>

//                     {/* Delete button for Super Admin */}
//                     {user?.role === "SUPER_ADMIN" && (
//                       <button
//                         onClick={() => {
//                           setSelectedLog(log);
//                           setShowDeleteConfirm(true);
//                         }}
//                         className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                         title="Delete log"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </motion.div>
//             ))
//           ) : (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-center py-16 bg-white rounded-2xl border border-gray-200"
//             >
//               <FileText size={64} className="mx-auto mb-4 text-gray-300" />
//               <h3 className="text-xl font-semibold text-gray-700 mb-2">No Logs Found</h3>
//               <p className="text-gray-500 mb-6">
//                 {filter !== "all" 
//                   ? "No logs match the selected filter. Try a different filter."
//                   : "This project doesn't have any logs yet."}
//               </p>
//               <button
//                 onClick={() => setShowAddLog(true)}
//                 className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 inline-flex items-center gap-2"
//               >
//                 <FileText size={18} />
//                 Add First Log
//               </button>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </motion.div>
//   );
// };

// export default ProjectLogs;
// /// src/features/projects/ProjectLogs.jsx
// import { useParams, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   Calendar, 
//   ArrowLeft,
//   Filter,
//   RefreshCw,
//   Loader2,
//   Building2,
//   FileText,
//   X,
//   Search,
//   AlertCircle,
//   Download,
//   ChevronDown,
//   ChevronUp
// } from "lucide-react";
// import { 
//   fetchProjectLogs, 
//   createLog, 
//   deleteLog, 
//   setLogFilters, 
//   resetFilters, 
//   resetPagination,
//   fetchAllLogsUnfiltered,
//   calculateStats
// } from "../dailyLogs/logSlice";
// import { showSnackbar } from "../notifications/notificationSlice";
// import { fetchProjects } from "../api/apiSlice";
// import LogCard from "../../components/LogCard";
// import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

// // Debounce function to prevent too many API calls
// const debounce = (func, wait) => {
//   let timeout;
//   return (...args) => {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => func(...args), wait);
//   };
// };

// const ProjectLogs = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { user } = useSelector((state) => state.auth);
//   const { projects: apiProjects = [] } = useSelector((state) => state.api);
//   const { projects: localProjects = [] } = useSelector((state) => state.projects);
//   const { projectLogs, loading, loadingMore, pagination, filters, error, stats } = useSelector((state) => state.logs);
  
//   // Find project from either source
//   const project = useMemo(() => 
//     [...apiProjects, ...localProjects].find(p => p.id === id || p.project_id === id),
//     [apiProjects, localProjects, id]
//   );

//   // Local state
//   const [expandedLogs, setExpandedLogs] = useState({});
//   const [showAddLogModal, setShowAddLogModal] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [selectedLog, setSelectedLog] = useState(null);
//   const [showFilters, setShowFilters] = useState(false);
//   const [newLog, setNewLog] = useState({
//     event_type: "MANUAL_LOG",
//     message: ""
//   });

//   // Debounced filter change handler
//   const debouncedFilterChange = useRef(
//     debounce((key, value) => {
//       dispatch(setLogFilters({ [key]: value }));
//       dispatch(resetPagination());
//     }, 500)
//   ).current;

//   // Fetch initial data
//   useEffect(() => {
//     if (!project && apiProjects.length === 0) {
//       dispatch(fetchProjects());
//     }
    
//     // Set default date filter if not set
//     if (!filters.date) {
//       dispatch(setLogFilters({ date: new Date().toISOString().split('T')[0] }));
//     }
//   }, [dispatch, project, apiProjects.length, filters.date]);

//   // Fetch logs when filters change
//   useEffect(() => {
//     if (!id) return;
    
//     dispatch(resetPagination());
//     dispatch(fetchProjectLogs({ 
//       projectId: id, 
//       page: 1, 
//       pageSize: 10, // Reduced from 20 to 10 for better performance
//       filters: {
//         date: filters.date || new Date().toISOString().split('T')[0],
//         eventType: filters.eventType || 'all',
//         search: filters.search || ''
//       }
//     }));
    
//     // Debug: fetch unfiltered logs to see what's available
//     if (process.env.NODE_ENV === 'development') {
//       dispatch(fetchAllLogsUnfiltered({ pageSize: 50 }));
//     }
//   }, [dispatch, id, filters.date, filters.eventType, filters.search]);

//   // Calculate stats when logs change
//   useEffect(() => {
//     if (projectLogs.length > 0) {
//       dispatch(calculateStats());
//     }
//   }, [projectLogs, dispatch]);

//   // Load more logs
//   const loadMoreLogs = useCallback(() => {
//     if (pagination.hasNext && !loadingMore && !loading && id) {
//       dispatch(fetchProjectLogs({ 
//         projectId: id,
//         page: pagination.currentPage + 1, 
//         pageSize: 10, // Reduced from 20 to 10
//         append: true,
//         filters: {
//           date: filters.date,
//           eventType: filters.eventType,
//           search: filters.search
//         }
//       }));
//     }
//   }, [dispatch, id, pagination, loadingMore, loading, filters]);

//   // Infinite scroll trigger
//   const { setElement } = useInfiniteScroll(loadMoreLogs, pagination.hasNext, loadingMore);

//   // Handle filter changes
//   const handleFilterChange = (key, value) => {
//     if (key === 'search') {
//       // Debounce search input
//       debouncedFilterChange(key, value);
//     } else {
//       // Immediate update for other filters
//       dispatch(setLogFilters({ [key]: value }));
//       dispatch(resetPagination());
//     }
//   };

//   const handleClearFilters = () => {
//     dispatch(resetFilters());
//     dispatch(setLogFilters({ date: new Date().toISOString().split('T')[0] }));
//     dispatch(resetPagination());
//   };

//   const handleRefresh = () => {
//     dispatch(resetPagination());
//     dispatch(fetchProjectLogs({ 
//       projectId: id, 
//       page: 1, 
//       pageSize: 10,
//       filters: {
//         date: filters.date,
//         eventType: filters.eventType,
//         search: filters.search
//       }
//     }));
//   };

//   const handleAddLog = async () => {
//     if (!newLog.message.trim()) {
//       dispatch(showSnackbar({
//         message: "Please enter a message",
//         type: "error"
//       }));
//       return;
//     }

//     const logData = {
//       project: id,
//       project_name: project?.name || project?.project_name,
//       event_type: newLog.event_type,
//       message: newLog.message,
//       created_at: new Date().toISOString(),
//       user: user?.name || "System",
//       user_role: user?.role || "USER"
//     };

//     try {
//       await dispatch(createLog(logData)).unwrap();
//       dispatch(showSnackbar({
//         message: "Log added successfully",
//         type: "success"
//       }));
//       setShowAddLogModal(false);
//       setNewLog({
//         event_type: "MANUAL_LOG",
//         message: ""
//       });
//       // Refresh logs after adding
//       handleRefresh();
//     } catch (error) {
//       dispatch(showSnackbar({
//         message: error.message || "Failed to add log",
//         type: "error"
//       }));
//     }
//   };

//   const handleDeleteLog = async (log) => {
//     if (user?.role !== "SUPER_ADMIN") {
//       dispatch(showSnackbar({
//         message: "Only Super Admin can delete logs",
//         type: "error"
//       }));
//       return;
//     }

//     setSelectedLog(log);
//     setShowDeleteConfirm(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       await dispatch(deleteLog(selectedLog.id)).unwrap();
//       dispatch(showSnackbar({
//         message: "Log deleted successfully",
//         type: "success"
//       }));
//       setShowDeleteConfirm(false);
//       setSelectedLog(null);
//       // Refresh logs after deletion
//       handleRefresh();
//     } catch (error) {
//       dispatch(showSnackbar({
//         message: error.message || "Failed to delete log",
//         type: "error"
//       }));
//     }
//   };

//   const handleExport = () => {
//     const dataStr = JSON.stringify(projectLogs, null, 2);
//     const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
//     const exportFileDefaultName = `project-${project?.project_code || id}-logs.json`;
//     const linkElement = document.createElement('a');
//     linkElement.setAttribute('href', dataUri);
//     linkElement.setAttribute('download', exportFileDefaultName);
//     linkElement.click();
//   };

//   const toggleLogExpansion = (logId) => {
//     setExpandedLogs(prev => ({
//       ...prev,
//       [logId]: !prev[logId]
//     }));
//   };

//   const hasActiveFilters = filters.eventType !== 'all' || 
//                           filters.search || 
//                           filters.date !== new Date().toISOString().split('T')[0];

//   if (loading && projectLogs.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="bg-white rounded-2xl p-8 shadow-xl flex items-center gap-4">
//           <Loader2 className="animate-spin text-blue-600" size={32} />
//           <div>
//             <p className="text-lg font-semibold text-gray-800">Loading Logs</p>
//             <p className="text-sm text-gray-500">Fetching project history...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!project && !loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-800">Project not found</h2>
//           <p className="text-gray-600 mb-4">Project ID: {id}</p>
//           <button
//             onClick={() => navigate("/projects")}
//             className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Back to Projects
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="max-w-7xl mx-auto space-y-6 px-4 py-6"
//     >
//       {/* Delete Confirmation Modal */}
//       <AnimatePresence>
//         {showDeleteConfirm && selectedLog && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//             onClick={() => setShowDeleteConfirm(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.9 }}
//               className="bg-white rounded-2xl p-6 max-w-md w-full"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <h3 className="text-xl font-bold mb-4">Delete Log</h3>
//               <p className="text-gray-600 mb-6">
//                 Are you sure you want to delete this log? This action cannot be undone.
//               </p>
//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => setShowDeleteConfirm(false)}
//                   className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={confirmDelete}
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Add Log Modal */}
//       <AnimatePresence>
//         {showAddLogModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//             onClick={() => setShowAddLogModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.9 }}
//               className="bg-white rounded-2xl p-6 max-w-md w-full"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <h3 className="text-xl font-bold mb-4">Add Manual Log</h3>
              
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
//                   <select
//                     value={newLog.event_type}
//                     onChange={(e) => setNewLog({...newLog, event_type: e.target.value})}
//                     className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="MANUAL_LOG">Manual Log</option>
//                     <option value="STATUS_UPDATE">Status Update</option>
//                     <option value="PROGRESS_CHANGED">Progress Changed</option>
//                     <option value="EXTENSION_REQUESTED">Extension Request</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
//                   <textarea
//                     value={newLog.message}
//                     onChange={(e) => setNewLog({...newLog, message: e.target.value})}
//                     placeholder="Log message"
//                     rows={3}
//                     className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="flex justify-end gap-2 mt-6">
//                 <button
//                   onClick={() => setShowAddLogModal(false)}
//                   className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleAddLog}
//                   disabled={loading}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                 >
//                   {loading && <Loader2 size={16} className="animate-spin" />}
//                   Add Log
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Header */}
//       <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate(`/projects/${id}`)}
//             className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
//           >
//             <ArrowLeft size={20} />
//           </button>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">
//               {project?.name || project?.project_name || 'Project'} Logs
//             </h1>
//             <p className="text-sm text-gray-500 flex items-center gap-2">
//               <Building2 size={14} />
//               Code: {project?.code || project?.project_code || 'N/A'} | 
//               Total Logs: {pagination.totalItems} | 
//               Page {pagination.currentPage} of {pagination.totalPages}
//             </p>
//           </div>
//         </div>
        
//         <div className="flex gap-2 w-full lg:w-auto">
//           <button
//             onClick={handleRefresh}
//             disabled={loading}
//             className="bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 flex items-center gap-2"
//           >
//             <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
//             <span className="hidden sm:inline">Refresh</span>
//           </button>
//           <button
//             onClick={handleExport}
//             className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 flex items-center gap-2"
//           >
//             <Download size={18} />
//             <span className="hidden sm:inline">Export</span>
//           </button>
//           <button
//             onClick={() => setShowAddLogModal(true)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2 flex-1 lg:flex-none"
//           >
//             <FileText size={18} />
//             Add Log
//           </button>
//         </div>
//       </div>

//       {/* Project Info Card */}
//       {project && (
//         <motion.div
//           initial={{ y: -20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
//         >
//           <div className="grid md:grid-cols-4 gap-4">
//             <div>
//               <p className="text-sm text-gray-600">Project Code</p>
//               <p className="text-lg font-semibold text-gray-800">{project.code || project.project_code}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Company</p>
//               <p className="text-lg font-semibold text-gray-800">
//                 {project.company_detail?.name || project.company || 'N/A'}
//               </p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Location</p>
//               <p className="text-lg font-semibold text-gray-800">{project.location || 'N/A'}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Progress</p>
//               <p className="text-lg font-semibold text-gray-800">{project.progress || 0}%</p>
//             </div>
//           </div>
//         </motion.div>
//       )}

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <motion.div
//           whileHover={{ scale: 1.02 }}
//           className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
//         >
//           <p className="text-sm text-gray-500">Total Logs</p>
//           <p className="text-2xl font-bold text-gray-800">{pagination.totalItems || 0}</p>
//         </motion.div>
        
//         <motion.div
//           whileHover={{ scale: 1.02 }}
//           className="bg-blue-50 rounded-xl p-4 shadow-md border border-blue-100"
//         >
//           <p className="text-sm text-blue-600">Log Types</p>
//           <p className="text-2xl font-bold text-blue-700">
//             {Object.keys(stats.byType || {}).length}
//           </p>
//         </motion.div>

//         <motion.div
//           whileHover={{ scale: 1.02 }}
//           className="bg-green-50 rounded-xl p-4 shadow-md border border-green-100"
//         >
//           <p className="text-sm text-green-600">Today's Logs</p>
//           <p className="text-2xl font-bold text-green-700">
//             {stats.byDate?.[filters.date] || 0}
//           </p>
//         </motion.div>

//         <motion.div
//           whileHover={{ scale: 1.02 }}
//           className="bg-purple-50 rounded-xl p-4 shadow-md border border-purple-100"
//         >
//           <p className="text-sm text-purple-600">Project Progress</p>
//           <p className="text-2xl font-bold text-purple-700">
//             {project?.progress || 0}%
//           </p>
//         </motion.div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
//         <div className="flex items-center gap-4 flex-wrap">
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className="flex items-center gap-2 text-gray-700"
//           >
//             <Filter size={18} />
//             <span className="font-medium">Filters</span>
//             {hasActiveFilters && (
//               <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs">
//                 Active
//               </span>
//             )}
//           </button>

//           {hasActiveFilters && (
//             <button
//               onClick={handleClearFilters}
//               className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
//             >
//               <X size={14} />
//               Clear all
//             </button>
//           )}
//         </div>

//         <AnimatePresence>
//           {showFilters && (
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: 'auto', opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               className="overflow-hidden"
//             >
//               <div className="grid md:grid-cols-3 gap-4 pt-4 mt-2 border-t border-gray-100">
//                 {/* Date Filter */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
//                   <input
//                     type="date"
//                     value={filters.date}
//                     onChange={(e) => handleFilterChange('date', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 {/* Type Filter */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
//                   <select
//                     value={filters.eventType}
//                     onChange={(e) => handleFilterChange('eventType', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="all">All Types</option>
//                     <option value="Project Created">Project Created</option>
//                     <option value="Project Updated">Project Updated</option>
//                     <option value="Progress Changed">Progress Changed</option>
//                     <option value="Activity Created">Activity Created</option>
//                     <option value="Activity Updated">Activity Updated</option>
//                     <option value="SubActivity Created">SubActivity Created</option>
//                     <option value="SubActivity Updated">SubActivity Updated</option>
//                     <option value="Extension Requested">Extension Requested</option>
//                     <option value="Extension Approved">Extension Approved</option>
//                     <option value="Extension Rejected">Extension Rejected</option>
//                     <option value="MANUAL_LOG">Manual Logs</option>
//                     <option value="STATUS_UPDATE">Status Update</option>
//                   </select>
//                 </div>

//                 {/* Search */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
//                   <div className="relative">
//                     <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       value={filters.search}
//                       onChange={(e) => handleFilterChange('search', e.target.value)}
//                       placeholder="Search logs..."
//                       className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Pagination Info */}
//       <div className="flex items-center justify-between text-sm text-gray-500">
//         <p>
//           Showing {projectLogs.length} of {pagination.totalItems} logs
//         </p>
//         <p>
//           Page {pagination.currentPage} of {pagination.totalPages}
//         </p>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
//           <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
//           <div>
//             <p className="font-medium text-red-800">Error loading logs</p>
//             <p className="text-sm text-red-600">{typeof error === 'string' ? error : JSON.stringify(error)}</p>
//           </div>
//           <button
//             onClick={handleRefresh}
//             className="ml-auto text-red-600 hover:text-red-700"
//           >
//             <RefreshCw size={16} />
//           </button>
//         </div>
//       )}

//       {/* Logs List */}
//       <div className="space-y-4">
//         <AnimatePresence mode="popLayout">
//           {projectLogs.length > 0 ? (
//             projectLogs.map((log) => (
//               <LogCard
//                 key={log.id}
//                 log={log}
//                 onDelete={handleDeleteLog}
//                 userRole={user?.role}
//                 isExpanded={expandedLogs[log.id]}
//                 onToggle={() => toggleLogExpansion(log.id)}
//               />
//             ))
//           ) : !loading && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-center py-16 bg-white rounded-2xl border border-gray-200"
//             >
//               <FileText size={64} className="mx-auto mb-4 text-gray-300" />
//               <h3 className="text-xl font-semibold text-gray-700 mb-2">No Logs Found</h3>
//               <p className="text-gray-500 mb-6">
//                 {hasActiveFilters
//                   ? "No logs match your filters. Try adjusting them."
//                   : "This project doesn't have any logs yet."}
//               </p>
//               <button
//                 onClick={() => setShowAddLogModal(true)}
//                 className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 inline-flex items-center gap-2"
//               >
//                 <FileText size={18} />
//                 Add First Log
//               </button>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Loading More Indicator */}
//         {loadingMore && (
//           <div className="flex justify-center py-6">
//             <div className="flex items-center gap-3">
//               <Loader2 className="animate-spin text-blue-600" size={24} />
//               <p className="text-gray-600">Loading more logs...</p>
//             </div>
//           </div>
//         )}

//         {/* Infinite Scroll Trigger */}
//         {pagination.hasNext && !loading && !loadingMore && projectLogs.length > 0 && (
//           <div ref={setElement} className="h-10" />
//         )}

//         {/* End of List Message */}
//         {!pagination.hasNext && projectLogs.length > 0 && (
//           <div className="text-center py-6 text-gray-400 border-t border-gray-200">
//             <p>You've reached the end of the logs</p>
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default ProjectLogs;




/////////////





// src/features/projects/ProjectLogs.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  ArrowLeft,
  Filter,
  RefreshCw,
  Loader2,
  Building2,
  FileText,
  X,
  Search,
  AlertCircle,
  Download,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { 
  fetchProjectLogs, 
  createLog, 
  deleteLog, 
  setLogFilters, 
  resetFilters,
  setPage,
  nextPage,
  prevPage,
  calculateStats
} from "../dailyLogs/logSlice";
import { showSnackbar } from "../notifications/notificationSlice";
import { fetchProjects } from "../api/apiSlice";
import LogCard from "../../components/LogCard";

const ProjectLogs = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { projects: apiProjects = [] } = useSelector((state) => state.api);
  const { projects: localProjects = [] } = useSelector((state) => state.projects);
  const { projectLogs, loading, pagination, filters, error, stats } = useSelector((state) => state.logs);
  
  // Find project
  const project = useMemo(() => 
    [...apiProjects, ...localProjects].find(p => p.id === id || p.project_id === id),
    [apiProjects, localProjects, id]
  );

  // Local state
  const [expandedLogs, setExpandedLogs] = useState({});
  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [newLog, setNewLog] = useState({
    event_type: "MANUAL_LOG",
    message: ""
  });

  // Get current page logs
  const currentLogs = useMemo(() => {
    const start = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const end = start + pagination.itemsPerPage;
    return projectLogs.slice(start, end);
  }, [projectLogs, pagination.currentPage, pagination.itemsPerPage]);

  // Fetch initial data
  useEffect(() => {
    if (!project && apiProjects.length === 0) {
      dispatch(fetchProjects());
    }
  }, [dispatch, project, apiProjects.length]);

  // Fetch logs when filters change
  useEffect(() => {
    if (!id) return;
    
    dispatch(fetchProjectLogs({ 
      projectId: id,
      date: filters.date,
      eventType: filters.eventType,
      search: filters.search
    }));
  }, [dispatch, id, filters.date, filters.eventType, filters.search]);

  // Calculate stats when logs change
  useEffect(() => {
    if (projectLogs.length > 0) {
      dispatch(calculateStats());
    }
  }, [projectLogs, dispatch]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    dispatch(setLogFilters({ [key]: value }));
  };

  const handleClearFilters = () => {
    dispatch(resetFilters());
  };

  const handleRefresh = () => {
    dispatch(fetchProjectLogs({ 
      projectId: id,
      date: filters.date,
      eventType: filters.eventType,
      search: filters.search
    }));
  };

  const handleAddLog = async () => {
    if (!newLog.message.trim()) {
      dispatch(showSnackbar({
        message: "Please enter a message",
        type: "error"
      }));
      return;
    }

    const logData = {
      project: id,
      project_name: project?.name || project?.project_name,
      event_type: newLog.event_type,
      message: newLog.message,
      created_at: new Date().toISOString(),
      user: user?.name || "System",
      user_role: user?.role || "USER"
    };

    try {
      await dispatch(createLog(logData)).unwrap();
      dispatch(showSnackbar({
        message: "Log added successfully",
        type: "success"
      }));
      setShowAddLogModal(false);
      setNewLog({
        event_type: "MANUAL_LOG",
        message: ""
      });
      handleRefresh();
    } catch (error) {
      dispatch(showSnackbar({
        message: error.message || "Failed to add log",
        type: "error"
      }));
    }
  };

  const handleDeleteLog = async (log) => {
    if (user?.role !== "SUPER_ADMIN") {
      dispatch(showSnackbar({
        message: "Only Super Admin can delete logs",
        type: "error"
      }));
      return;
    }

    setSelectedLog(log);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteLog(selectedLog.id)).unwrap();
      dispatch(showSnackbar({
        message: "Log deleted successfully",
        type: "success"
      }));
      setShowDeleteConfirm(false);
      setSelectedLog(null);
      handleRefresh();
    } catch (error) {
      dispatch(showSnackbar({
        message: error.message || "Failed to delete log",
        type: "error"
      }));
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(projectLogs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `project-${project?.project_code || id}-logs.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const toggleLogExpansion = (logId) => {
    setExpandedLogs(prev => ({
      ...prev,
      [logId]: !prev[logId]
    }));
  };

  const hasActiveFilters = filters.eventType !== 'all' || 
                          filters.search || 
                          filters.date !== new Date().toISOString().split('T')[0];

  if (loading && projectLogs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl flex items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <div>
            <p className="text-lg font-semibold text-gray-800">Loading Logs</p>
            <p className="text-sm text-gray-500">Fetching project history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Project not found</h2>
          <p className="text-gray-600 mb-4">Project ID: {id}</p>
          <button
            onClick={() => navigate("/projects")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto space-y-6 px-4 py-6"
    >
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && selectedLog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Delete Log</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this log? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Log Modal */}
      <AnimatePresence>
        {showAddLogModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddLogModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Add Manual Log</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                  <select
                    value={newLog.event_type}
                    onChange={(e) => setNewLog({...newLog, event_type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="MANUAL_LOG">Manual Log</option>
                    <option value="STATUS_UPDATE">Status Update</option>
                    <option value="PROGRESS_CHANGED">Progress Changed</option>
                    <option value="EXTENSION_REQUESTED">Extension Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={newLog.message}
                    onChange={(e) => setNewLog({...newLog, message: e.target.value})}
                    placeholder="Log message"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowAddLogModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddLog}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  Add Log
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/projects/${id}`)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {project?.name || project?.project_name || 'Project'} Logs
            </h1>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Building2 size={14} />
              Code: {project?.code || project?.project_code || 'N/A'} | 
              Total Logs: {projectLogs.length}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 w-full lg:w-auto">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 flex items-center gap-2"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 flex items-center gap-2"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={() => setShowAddLogModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2 flex-1 lg:flex-none"
          >
            <FileText size={18} />
            Add Log
          </button>
        </div>
      </div>

      {/* Project Info Card */}
      {project && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
        >
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Project Code</p>
              <p className="text-lg font-semibold text-gray-800">{project.code || project.project_code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Company</p>
              <p className="text-lg font-semibold text-gray-800">
                {project.company_detail?.name || project.company || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="text-lg font-semibold text-gray-800">{project.location || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Progress</p>
              <p className="text-lg font-semibold text-gray-800">{project.progress || 0}%</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <p className="text-sm text-gray-500">Total Logs</p>
          <p className="text-2xl font-bold text-gray-800">{projectLogs.length}</p>
        </div>
        
        <div className="bg-blue-50 rounded-xl p-4 shadow-md border border-blue-100">
          <p className="text-sm text-blue-600">Log Types</p>
          <p className="text-2xl font-bold text-blue-700">
            {Object.keys(stats.byType || {}).length}
          </p>
        </div>

        <div className="bg-green-50 rounded-xl p-4 shadow-md border border-green-100">
          <p className="text-sm text-green-600">Today's Logs</p>
          <p className="text-2xl font-bold text-green-700">
            {stats.byDate?.[filters.date] || 0}
          </p>
        </div>

        <div className="bg-purple-50 rounded-xl p-4 shadow-md border border-purple-100">
          <p className="text-sm text-purple-600">Project Progress</p>
          <p className="text-2xl font-bold text-purple-700">
            {project?.progress || 0}%
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-700"
          >
            <Filter size={18} />
            <span className="font-medium">Filters</span>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs">
                Active
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <X size={14} />
              Clear all
            </button>
          )}
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid md:grid-cols-3 gap-4 pt-4 mt-2 border-t border-gray-100">
                {/* Date Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={filters.date}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                  <select
                    value={filters.eventType}
                    onChange={(e) => handleFilterChange('eventType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="Project Created">Project Created</option>
                    <option value="Project Updated">Project Updated</option>
                    <option value="Progress Changed">Progress Changed</option>
                    <option value="Activity Created">Activity Created</option>
                    <option value="Activity Updated">Activity Updated</option>
                    <option value="SubActivity Created">SubActivity Created</option>
                    <option value="SubActivity Updated">SubActivity Updated</option>
                    <option value="Extension Requested">Extension Requested</option>
                    <option value="Extension Approved">Extension Approved</option>
                    <option value="Extension Rejected">Extension Rejected</option>
                    <option value="MANUAL_LOG">Manual Logs</option>
                    <option value="STATUS_UPDATE">Status Update</option>
                  </select>
                </div>

                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      placeholder="Search logs..."
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, projectLogs.length)} of {projectLogs.length} logs
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => dispatch(prevPage())}
            disabled={!pagination.hasPrev}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages || 1}
          </span>
          <button
            onClick={() => dispatch(nextPage())}
            disabled={!pagination.hasNext}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
          <div>
            <p className="font-medium text-red-800">Error loading logs</p>
            <p className="text-sm text-red-600">{typeof error === 'string' ? error : JSON.stringify(error)}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="ml-auto text-red-600 hover:text-red-700"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      )}

      {/* Logs List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {currentLogs.length > 0 ? (
            currentLogs.map((log) => (
              <LogCard
                key={log.id}
                log={log}
                onDelete={handleDeleteLog}
                userRole={user?.role}
                isExpanded={expandedLogs[log.id]}
                onToggle={() => toggleLogExpansion(log.id)}
              />
            ))
          ) : !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-white rounded-2xl border border-gray-200"
            >
              <FileText size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Logs Found</h3>
              <p className="text-gray-500 mb-6">
                {hasActiveFilters
                  ? "No logs match your filters. Try adjusting them."
                  : "This project doesn't have any logs yet."}
              </p>
              <button
                onClick={() => setShowAddLogModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 inline-flex items-center gap-2"
              >
                <FileText size={18} />
                Add First Log
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ProjectLogs;