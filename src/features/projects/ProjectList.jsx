


// import { useSelector } from "react-redux";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { 
//   Plus, 
//   Eye, 
//   Calendar, 
//   Clock, 
//   TrendingUp,
//   Search,
//   Filter,
//   ChevronDown,
//   ChevronUp,
//   AlertCircle,
//   CheckCircle2,
//   XCircle,
//   BarChart3,
//   Users,
//   FolderOpen
// } from "lucide-react";
// import { getProjectStatusInfo, getDaysUntilDeadline } from "../../utils/deadlineUtils";

// const ProjectList = () => {
//   const navigate = useNavigate();
//   const { projects } = useSelector((state) => state.projects);
  
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [sortBy, setSortBy] = useState("deadline");
//   const [expandedCard, setExpandedCard] = useState(null);

//   // Filter and sort projects
//   const filteredProjects = projects
//     .filter(project => {
//       const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                            project.code.toLowerCase().includes(searchTerm.toLowerCase());
      
//       if (filterStatus === "all") return matchesSearch;
//       if (filterStatus === "delayed") return matchesSearch && (project.status === "DELAYED" || getDaysUntilDeadline(project.completionDate) < 0);
//       if (filterStatus === "critical") return matchesSearch && getDaysUntilDeadline(project.completionDate) <= 2 && getDaysUntilDeadline(project.completionDate) >= 0;
//       if (filterStatus === "ongoing") return matchesSearch && project.status === "ONGOING";
//       if (filterStatus === "completed") return matchesSearch && project.status === "COMPLETED";
      
//       return matchesSearch;
//     })
//     .sort((a, b) => {
//       if (sortBy === "deadline") {
//         return (getDaysUntilDeadline(a.completionDate) || 999) - (getDaysUntilDeadline(b.completionDate) || 999);
//       }
//       if (sortBy === "progress") {
//         return (b.progress || 0) - (a.progress || 0);
//       }
//       if (sortBy === "name") {
//         return a.name.localeCompare(b.name);
//       }
//       return 0;
//     });

//   // Stats
//   const stats = {
//     total: projects.length,
//     delayed: projects.filter(p => p.status === "DELAYED" || getDaysUntilDeadline(p.completionDate) < 0).length,
//     critical: projects.filter(p => getDaysUntilDeadline(p.completionDate) <= 2 && getDaysUntilDeadline(p.completionDate) >= 0).length,
//     completed: projects.filter(p => p.status === "COMPLETED").length,
//     ongoing: projects.filter(p => p.status === "ONGOING").length
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const getProgressColor = (progress) => {
//     if (progress === 100) return "bg-green-500";
//     if (progress >= 75) return "bg-blue-500";
//     if (progress >= 50) return "bg-yellow-500";
//     if (progress >= 25) return "bg-orange-500";
//     return "bg-red-500";
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: "spring",
//         damping: 15,
//         stiffness: 100
//       }
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="max-w-7xl mx-auto px-4 py-8"
//     >
//       {/* Header with Gradient */}
//       <div className="mb-10">
//         <motion.h1 
//           initial={{ x: -20, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
//         >
//           Project Portfolio
//         </motion.h1>
//         <motion.p 
//           initial={{ x: -20, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ delay: 0.1 }}
//           className="text-gray-500 text-lg"
//         >
//           Track and manage all your construction projects in one place
//         </motion.p>
//       </div>

//       {/* Stats Cards with Premium Design */}
//       <motion.div 
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
//       >
//         <motion.div
//           variants={itemVariants}
//           whileHover={{ scale: 1.05, y: -5 }}
//           className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl"
//         >
//           <FolderOpen size={24} className="mb-2 opacity-80" />
//           <p className="text-3xl font-bold">{stats.total}</p>
//           <p className="text-sm opacity-90">Total Projects</p>
//         </motion.div>

//         <motion.div
//           variants={itemVariants}
//           whileHover={{ scale: 1.05, y: -5 }}
//           className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl"
//         >
//           <CheckCircle2 size={24} className="mb-2 opacity-80" />
//           <p className="text-3xl font-bold">{stats.completed}</p>
//           <p className="text-sm opacity-90">Completed</p>
//         </motion.div>

//         <motion.div
//           variants={itemVariants}
//           whileHover={{ scale: 1.05, y: -5 }}
//           className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-xl"
//         >
//           <TrendingUp size={24} className="mb-2 opacity-80" />
//           <p className="text-3xl font-bold">{stats.ongoing}</p>
//           <p className="text-sm opacity-90">In Progress</p>
//         </motion.div>

//         <motion.div
//           variants={itemVariants}
//           whileHover={{ scale: 1.05, y: -5 }}
//           className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl"
//         >
//           <AlertCircle size={24} className="mb-2 opacity-80" />
//           <p className="text-3xl font-bold">{stats.critical}</p>
//           <p className="text-sm opacity-90">Critical</p>
//         </motion.div>

//         <motion.div
//           variants={itemVariants}
//           whileHover={{ scale: 1.05, y: -5 }}
//           className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-xl"
//         >
//           <XCircle size={24} className="mb-2 opacity-80" />
//           <p className="text-3xl font-bold">{stats.delayed}</p>
//           <p className="text-sm opacity-90">Delayed</p>
//         </motion.div>
//       </motion.div>

//       {/* Filters and Search Bar */}
//       <motion.div 
//         initial={{ y: 20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 0.3 }}
//         className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100"
//       >
//         <div className="flex flex-col md:flex-row gap-4">
//           {/* Search */}
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-3 text-gray-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search projects by name or code..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//             />
//           </div>

//           {/* Filter Dropdown */}
//           <div className="relative">
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               className="appearance-none pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white min-w-[160px]"
//             >
//               <option value="all">All Projects</option>
//               <option value="ongoing">Ongoing</option>
//               <option value="critical">Critical</option>
//               <option value="delayed">Delayed</option>
//               <option value="completed">Completed</option>
//             </select>
//             <Filter className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={20} />
//           </div>

//           {/* Sort Dropdown */}
//           <div className="relative">
//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               className="appearance-none pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white min-w-[160px]"
//             >
//               <option value="deadline">Sort by Deadline</option>
//               <option value="progress">Sort by Progress</option>
//               <option value="name">Sort by Name</option>
//             </select>
//             <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={20} />
//           </div>

//           {/* New Project Button */}
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => navigate("/projects/create")}
//             className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all flex items-center gap-2"
//           >
//             <Plus size={20} />
//             New Project
//           </motion.button>
//         </div>
//       </motion.div>

//       {/* Projects Grid */}
//       <AnimatePresence>
//         {filteredProjects.length === 0 ? (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className="text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100"
//           >
//             <FolderOpen size={64} className="mx-auto mb-4 text-gray-300" />
//             <p className="text-2xl font-semibold text-gray-700 mb-2">No projects found</p>
//             <p className="text-gray-500 mb-6">Get started by creating your first project</p>
//             <button
//               onClick={() => navigate("/projects/create")}
//               className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-xl transition-all inline-flex items-center gap-2 text-lg"
//             >
//               <Plus size={24} />
//               Create New Project
//             </button>
//           </motion.div>
//         ) : (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="grid gap-6"
//           >
//             {filteredProjects.map((project) => {
//               const statusInfo = getProjectStatusInfo(project);
//               const daysLeft = getDaysUntilDeadline(project.completionDate);
//               const isExpanded = expandedCard === project.id;
              
//               return (
//                 <motion.div
//                   key={project.id}
//                   variants={itemVariants}
//                   layout
//                   className={`bg-white rounded-3xl shadow-xl border-2 transition-all duration-300
//                     ${statusInfo.status === "DELAYED" ? "border-red-200 hover:border-red-300" :
//                       statusInfo.status === "DUE_TODAY" ? "border-orange-200 hover:border-orange-300" :
//                       statusInfo.status === "CRITICAL" ? "border-yellow-200 hover:border-yellow-300" :
//                       "border-gray-100 hover:border-blue-200"}`}
//                 >
//                   <div className="p-6">
//                     {/* Header with Status */}
//                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-3 mb-2 flex-wrap">
//                           <h3 className="text-2xl font-bold text-gray-800">{project.name}</h3>
//                           <motion.span 
//                             whileHover={{ scale: 1.05 }}
//                             className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1
//                               ${statusInfo.colors.bg} ${statusInfo.colors.text}`}
//                           >
//                             <span>{statusInfo.icon}</span>
//                             {statusInfo.label}
//                           </motion.span>
//                           <span className="text-sm text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
//                             {project.code}
//                           </span>
//                         </div>
                        
//                         <p className="text-gray-500 mb-4 line-clamp-2">
//                           {project.location || "No location specified"}
//                         </p>
                        
//                         {/* Quick Stats */}
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                           <div className="flex items-center gap-2">
//                             <div className="p-2 bg-blue-50 rounded-lg">
//                               <Calendar size={16} className="text-blue-600" />
//                             </div>
//                             <div>
//                               <p className="text-xs text-gray-500">Start Date</p>
//                               <p className="text-sm font-semibold">{formatDate(project.loaDate)}</p>
//                             </div>
//                           </div>
                          
//                           <div className="flex items-center gap-2">
//                             <div className={`p-2 rounded-lg ${
//                               daysLeft < 0 ? "bg-red-50" : 
//                               daysLeft <= 2 ? "bg-orange-50" : 
//                               daysLeft <= 7 ? "bg-yellow-50" : "bg-green-50"
//                             }`}>
//                               <Clock size={16} className={
//                                 daysLeft < 0 ? "text-red-600" : 
//                                 daysLeft <= 2 ? "text-orange-600" : 
//                                 daysLeft <= 7 ? "text-yellow-600" : "text-green-600"
//                               } />
//                             </div>
//                             <div>
//                               <p className="text-xs text-gray-500">Deadline</p>
//                               <p className="text-sm font-semibold">{formatDate(project.completionDate)}</p>
//                             </div>
//                           </div>
                          
//                           <div className="flex items-center gap-2">
//                             <div className="p-2 bg-purple-50 rounded-lg">
//                               <TrendingUp size={16} className="text-purple-600" />
//                             </div>
//                             <div>
//                               <p className="text-xs text-gray-500">Progress</p>
//                               <p className="text-sm font-semibold">{project.progress || 0}%</p>
//                             </div>
//                           </div>
                          
//                           <div className="flex items-center gap-2">
//                             <div className="p-2 bg-indigo-50 rounded-lg">
//                               <BarChart3 size={16} className="text-indigo-600" />
//                             </div>
//                             <div>
//                               <p className="text-xs text-gray-500">Activities</p>
//                               <p className="text-sm font-semibold">{project.activities?.length || 0}</p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-center gap-2">
//                         <motion.button
//                           whileHover={{ scale: 1.05 }}
//                           whileTap={{ scale: 0.95 }}
//                           onClick={() => navigate(`/projects/${project.id}`)}
//                           className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
//                         >
//                           <Eye size={18} />
//                           View Details
//                         </motion.button>
                        
//                         <button
//                           onClick={() => setExpandedCard(isExpanded ? null : project.id)}
//                           className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
//                         >
//                           {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//                         </button>
//                       </div>
//                     </div>

//                     {/* Progress Bar with Animation */}
//                     <div className="space-y-2">
//                       <div className="flex justify-between text-sm">
//                         <span className="font-medium text-gray-600">Overall Progress</span>
//                         <span className="font-bold text-blue-600">{project.progress || 0}%</span>
//                       </div>
//                       <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
//                         <motion.div
//                           initial={{ width: 0 }}
//                           animate={{ width: `${project.progress || 0}%` }}
//                           transition={{ duration: 1, ease: "easeOut" }}
//                           className={`h-3 rounded-full bg-gradient-to-r ${statusInfo.colors.gradient}`}
//                         />
//                       </div>
//                     </div>

//                     {/* Expanded Details */}
//                     <AnimatePresence>
//                       {isExpanded && (
//                         <motion.div
//                           initial={{ height: 0, opacity: 0 }}
//                           animate={{ height: "auto", opacity: 1 }}
//                           exit={{ height: 0, opacity: 0 }}
//                           className="mt-6 pt-6 border-t border-gray-100"
//                         >
//                           <div className="grid md:grid-cols-2 gap-6">
//                             <div>
//                               <h4 className="font-semibold mb-3 text-gray-700">Project Details</h4>
//                               <div className="space-y-2">
//                                 <p className="text-sm"><span className="text-gray-500">Company:</span> {project.company}</p>
//                                 <p className="text-sm"><span className="text-gray-500">Sector:</span> {project.sector}</p>
//                                 <p className="text-sm"><span className="text-gray-500">Department:</span> {project.department}</p>
//                                 <p className="text-sm"><span className="text-gray-500">Total Length:</span> {project.totalLength} km</p>
//                                 <p className="text-sm"><span className="text-gray-500">Cost:</span> ₹{project.cost} Lakhs</p>
//                               </div>
//                             </div>
                            
//                             <div>
//                               <h4 className="font-semibold mb-3 text-gray-700">Key Milestones</h4>
//                               <div className="space-y-2">
//                                 <p className="text-sm"><span className="text-gray-500">LOA Date:</span> {formatDate(project.loaDate)}</p>
//                                 <p className="text-sm"><span className="text-gray-500">Director Proposal:</span> {formatDate(project.directorProposalDate)}</p>
//                                 <p className="text-sm"><span className="text-gray-500">Project Confirmation:</span> {formatDate(project.projectConfirmationDate)}</p>
//                               </div>
//                             </div>
//                           </div>
//                         </motion.div>
//                       )}
//                     </AnimatePresence>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// };

// export default ProjectList;
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Plus, 
  Eye, 
  Calendar, 
  Clock, 
  TrendingUp,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  BarChart3,
  Users,
  FolderOpen,
  RefreshCw,
  Loader2,
  Trash2
} from "lucide-react";
import { getProjectStatusInfo, getDaysUntilDeadline } from "../../utils/deadlineUtils";
import { fetchProjects, deleteProject } from "../api/apiSlice";
import { showSnackbar } from "../notifications/notificationSlice";

const ProjectList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get projects and user from Redux store
  const { projects = [], loading } = useSelector((state) => state.api);
  const { user } = useSelector((state) => state.auth);
  const localProjects = useSelector((state) => state.projects.projects);
  
  // Combine API projects with local projects (fallback)
  const allProjects = projects.length > 0 ? projects : localProjects;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("deadline");
  const [expandedCard, setExpandedCard] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  // Fetch projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setRefreshing(true);
      await dispatch(fetchProjects()).unwrap();
    } catch (error) {
      console.error("Error fetching projects:", error);
      dispatch(showSnackbar({
        message: "Failed to load projects from server",
        type: "warning"
      }));
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteProject = async (projectId, projectName, e) => {
    e.stopPropagation(); // Prevent card click when clicking delete
    
    // Show confirmation dialog
    if (window.confirm(`Are you sure you want to delete project "${projectName}"? This action cannot be undone.`)) {
      setDeleteInProgress(true);
      try {
        // Call the delete API
        await dispatch(deleteProject(projectId)).unwrap();
        
        dispatch(showSnackbar({
          message: "Project deleted successfully",
          type: "success"
        }));
        
        // Refresh the list after deletion
        await loadProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
        dispatch(showSnackbar({
          message: error.message || "Failed to delete project",
          type: "error"
        }));
      } finally {
        setDeleteInProgress(false);
      }
    }
  };

  // Filter and sort projects
  const filteredProjects = allProjects
    .filter(project => {
      const matchesSearch = (project.name || project.project_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (project.code || project.project_code || "").toLowerCase().includes(searchTerm.toLowerCase());
      
      const projectStatus = project.status || "ONGOING";
      const daysLeft = getDaysUntilDeadline(project.completion_date || project.completionDate);
      
      if (filterStatus === "all") return matchesSearch;
      if (filterStatus === "delayed") return matchesSearch && (projectStatus === "DELAYED" || daysLeft < 0);
      if (filterStatus === "critical") return matchesSearch && daysLeft <= 2 && daysLeft >= 0;
      if (filterStatus === "ongoing") return matchesSearch && projectStatus === "ONGOING";
      if (filterStatus === "completed") return matchesSearch && projectStatus === "COMPLETED";
      
      return matchesSearch;
    })
    .sort((a, b) => {
      const aDays = getDaysUntilDeadline(a.completion_date || a.completionDate) || 999;
      const bDays = getDaysUntilDeadline(b.completion_date || b.completionDate) || 999;
      const aProgress = a.progress || 0;
      const bProgress = b.progress || 0;
      const aName = a.name || a.project_name || "";
      const bName = b.name || b.project_name || "";
      
      if (sortBy === "deadline") {
        return aDays - bDays;
      }
      if (sortBy === "progress") {
        return bProgress - aProgress;
      }
      if (sortBy === "name") {
        return aName.localeCompare(bName);
      }
      return 0;
    });

  // Calculate stats from real data
  const stats = {
    total: allProjects.length,
    delayed: allProjects.filter(p => {
      const status = p.status || "ONGOING";
      const daysLeft = getDaysUntilDeadline(p.completion_date || p.completionDate);
      return status === "DELAYED" || daysLeft < 0;
    }).length,
    critical: allProjects.filter(p => {
      const daysLeft = getDaysUntilDeadline(p.completion_date || p.completionDate);
      return daysLeft <= 2 && daysLeft >= 0;
    }).length,
    completed: allProjects.filter(p => (p.status || "ONGOING") === "COMPLETED").length,
    ongoing: allProjects.filter(p => (p.status || "ONGOING") === "ONGOING").length
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgressColor = (progress) => {
    const prog = progress || 0;
    if (prog === 100) return "bg-green-500";
    if (prog >= 75) return "bg-blue-500";
    if (prog >= 50) return "bg-yellow-500";
    if (prog >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100
      }
    }
  };

  const handleRefresh = () => {
    loadProjects();
  };

  // Get project ID safely
  const getProjectId = (project) => {
    return project.id || project.project_id;
  };

  // Get project name safely
  const getProjectName = (project) => {
    return project.name || project.project_name || "Unnamed Project";
  };

  // Get project code safely
  const getProjectCode = (project) => {
    return project.code || project.project_code || "N/A";
  };

  // Get project completion date safely
  const getCompletionDate = (project) => {
    return project.completion_date || project.completionDate || project.deadline;
  };

  // Get project progress safely
  const getProgress = (project) => {
    return project.progress || 0;
  };

  // Get project location safely
  const getLocation = (project) => {
    return project.location || "No location specified";
  };

  // Get project company safely
  const getCompany = (project) => {
    return project.company || "N/A";
  };

  // Get project sector safely
  const getSector = (project) => {
    return project.sector || "N/A";
  };

  // Get project department safely
  const getDepartment = (project) => {
    return project.department || project.client || "N/A";
  };

  // Get project cost safely
  const getCost = (project) => {
    return project.cost || project.workorder_cost || 0;
  };

  // Get project total length safely
  const getTotalLength = (project) => {
    return project.total_length || project.totalLength || 0;
  };

  // Get project LOA date safely
  const getLoaDate = (project) => {
    return project.loa_date || project.loaDate;
  };

  // Get project director proposal date safely
  const getDirectorProposalDate = (project) => {
    return project.director_proposal_date || project.directorProposalDate;
  };

  // Get project confirmation date safely
  const getProjectConfirmationDate = (project) => {
    return project.project_confirmation_date || project.projectConfirmationDate;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      {/* Header with Gradient and Refresh Button */}
      <div className="mb-10 flex justify-between items-start">
        <div>
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
          >
            Project Portfolio
          </motion.h1>
          <motion.p 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-lg"
          >
            Track and manage all your construction projects in one place
          </motion.p>
        </div>
        
        {/* Refresh Button */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 flex items-center gap-2"
        >
          <RefreshCw size={20} className={`text-blue-600 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium text-gray-700">Refresh</span>
        </motion.button>
      </div>

      {/* Loading State */}
      {(loading || refreshing) && (
        <div className="flex justify-center items-center py-12">
          <div className="bg-white rounded-2xl p-8 shadow-xl flex items-center gap-4">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <div>
              <p className="text-lg font-semibold text-gray-800">Loading Projects</p>
              <p className="text-sm text-gray-500">Fetching latest data from server...</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {!loading && !refreshing && (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <FolderOpen size={24} className="mb-2 opacity-80" />
            <p className="text-3xl font-bold">{stats.total}</p>
            <p className="text-sm opacity-90">Total Projects</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <CheckCircle2 size={24} className="mb-2 opacity-80" />
            <p className="text-3xl font-bold">{stats.completed}</p>
            <p className="text-sm opacity-90">Completed</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <TrendingUp size={24} className="mb-2 opacity-80" />
            <p className="text-3xl font-bold">{stats.ongoing}</p>
            <p className="text-sm opacity-90">In Progress</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <AlertCircle size={24} className="mb-2 opacity-80" />
            <p className="text-3xl font-bold">{stats.critical}</p>
            <p className="text-sm opacity-90">Critical</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <XCircle size={24} className="mb-2 opacity-80" />
            <p className="text-3xl font-bold">{stats.delayed}</p>
            <p className="text-sm opacity-90">Delayed</p>
          </motion.div>
        </motion.div>
      )}

      {/* Filters and Search Bar */}
      {!loading && !refreshing && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search projects by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white min-w-[160px]"
              >
                <option value="all">All Projects</option>
                <option value="ongoing">Ongoing</option>
                <option value="critical">Critical</option>
                <option value="delayed">Delayed</option>
                <option value="completed">Completed</option>
              </select>
              <Filter className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={20} />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white min-w-[160px]"
              >
                <option value="deadline">Sort by Deadline</option>
                <option value="progress">Sort by Progress</option>
                <option value="name">Sort by Name</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={20} />
            </div>

            {/* New Project Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/projects/create")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Plus size={20} />
              New Project
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Projects Grid */}
      {!loading && !refreshing && (
        <AnimatePresence>
          {filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100"
            >
              <FolderOpen size={64} className="mx-auto mb-4 text-gray-300" />
              <p className="text-2xl font-semibold text-gray-700 mb-2">No projects found</p>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterStatus !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Get started by creating your first project"}
              </p>
              <button
                onClick={() => navigate("/projects/create")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-xl transition-all inline-flex items-center gap-2 text-lg"
              >
                <Plus size={24} />
                Create New Project
              </button>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6"
            >
              {filteredProjects.map((project) => {
                const projectId = getProjectId(project);
                const projectName = getProjectName(project);
                const projectCode = getProjectCode(project);
                const completionDate = getCompletionDate(project);
                const progress = getProgress(project);
                const location = getLocation(project);
                const daysLeft = getDaysUntilDeadline(completionDate);
                
                // Create a compatible project object for statusInfo
                const projectForStatus = {
                  status: project.status || "ONGOING",
                  completionDate: completionDate,
                  progress: progress
                };
                
                const statusInfo = getProjectStatusInfo(projectForStatus);
                const isExpanded = expandedCard === projectId;
                
                return (
                  <motion.div
                    key={projectId}
                    variants={itemVariants}
                    layout
                    className={`bg-white rounded-3xl shadow-xl border-2 transition-all duration-300 relative group
                      ${statusInfo.status === "DELAYED" ? "border-red-200 hover:border-red-300" :
                        statusInfo.status === "DUE_TODAY" ? "border-orange-200 hover:border-orange-300" :
                        statusInfo.status === "CRITICAL" ? "border-yellow-200 hover:border-yellow-300" :
                        "border-gray-100 hover:border-blue-200"}`}
                  >
                    {/* DELETE BUTTON - Always visible for testing */}
                    <button
                      onClick={(e) => handleDeleteProject(projectId, projectName, e)}
                      disabled={deleteInProgress}
                      className="absolute top-4 right-4 z-10 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all hover:scale-110"
                      title="Delete project"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div 
                      className="p-6 cursor-pointer"
                      onClick={() => navigate(`/projects/${projectId}`)}
                    >
                      {/* Header with Status */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-2xl font-bold text-gray-800">{projectName}</h3>
                            <motion.span 
                              whileHover={{ scale: 1.05 }}
                              className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1
                                ${statusInfo.colors.bg} ${statusInfo.colors.text}`}
                            >
                              <span>{statusInfo.icon}</span>
                              {statusInfo.label}
                            </motion.span>
                            <span className="text-sm text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
                              {projectCode}
                            </span>
                          </div>
                          
                          <p className="text-gray-500 mb-4 line-clamp-2">
                            {location}
                          </p>
                          
                          {/* Quick Stats */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-blue-50 rounded-lg">
                                <Calendar size={16} className="text-blue-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Start Date</p>
                                <p className="text-sm font-semibold">{formatDate(getLoaDate(project))}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className={`p-2 rounded-lg ${
                                daysLeft < 0 ? "bg-red-50" : 
                                daysLeft <= 2 ? "bg-orange-50" : 
                                daysLeft <= 7 ? "bg-yellow-50" : "bg-green-50"
                              }`}>
                                <Clock size={16} className={
                                  daysLeft < 0 ? "text-red-600" : 
                                  daysLeft <= 2 ? "text-orange-600" : 
                                  daysLeft <= 7 ? "text-yellow-600" : "text-green-600"
                                } />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Deadline</p>
                                <p className="text-sm font-semibold">{formatDate(completionDate)}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-purple-50 rounded-lg">
                                <TrendingUp size={16} className="text-purple-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Progress</p>
                                <p className="text-sm font-semibold">{progress}%</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-indigo-50 rounded-lg">
                                <BarChart3 size={16} className="text-indigo-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Activities</p>
                                <p className="text-sm font-semibold">{project.activities?.length || 0}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/projects/${projectId}`);
                            }}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                          >
                            <Eye size={18} />
                            View Details
                          </motion.button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedCard(isExpanded ? null : projectId);
                            }}
                            className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                          >
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar with Animation */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-600">Overall Progress</span>
                          <span className="font-bold text-blue-600">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-3 rounded-full bg-gradient-to-r ${statusInfo.colors.gradient}`}
                          />
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-6 pt-6 border-t border-gray-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold mb-3 text-gray-700">Project Details</h4>
                                <div className="space-y-2">
                                  <p className="text-sm"><span className="text-gray-500">Company:</span> {getCompany(project)}</p>
                                  <p className="text-sm"><span className="text-gray-500">Sector:</span> {getSector(project)}</p>
                                  <p className="text-sm"><span className="text-gray-500">Department:</span> {getDepartment(project)}</p>
                                  <p className="text-sm"><span className="text-gray-500">Total Length:</span> {getTotalLength(project)} km</p>
                                  <p className="text-sm"><span className="text-gray-500">Cost:</span> ₹{getCost(project)} Lakhs</p>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold mb-3 text-gray-700">Key Milestones</h4>
                                <div className="space-y-2">
                                  <p className="text-sm"><span className="text-gray-500">LOA Date:</span> {formatDate(getLoaDate(project))}</p>
                                  <p className="text-sm"><span className="text-gray-500">Director Proposal:</span> {formatDate(getDirectorProposalDate(project))}</p>
                                  <p className="text-sm"><span className="text-gray-500">Project Confirmation:</span> {formatDate(getProjectConfirmationDate(project))}</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default ProjectList;