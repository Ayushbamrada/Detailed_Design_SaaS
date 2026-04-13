import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
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
  FolderOpen,
  RefreshCw,
  Loader2,
  Trash2,
  UserCheck,
  Briefcase,
  Shield,
  UserCog,
  User,
  Building2,
  MapPin,
  IndianRupee,
  Ruler,
  CheckCircle,
  Hash,
} from "lucide-react";
import {
  getProjectStatusInfo,
  getDaysUntilDeadline,
} from "../../utils/deadlineUtils";
import {
  fetchProjects,
  deleteProject,
  fetchCompanies,
  fetchSectors,
  fetchClients,
} from "../api/apiSlice";
import { showSnackbar } from "../notifications/notificationSlice";
import TaskPicker from "../tasks/TaskPicker";
import LoadingModal from "../../components/modals/LoadingModal";
import { SECTOR_UNIT_MAPPING } from "../../utils/enumMapping";

const ProjectList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get projects and user from Redux store
  const {
    projects = [],
    loading: apiLoading = false,
    companies = [],
    sectors = [],
    clients = [],
  } = useSelector((state) => state.api || {});
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("deadline");
  const [expandedCard, setExpandedCard] = useState(null);
  const [expandedActivities, setExpandedActivities] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskPicker, setShowTaskPicker] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading Projects");
  const [loadingSubMessage, setLoadingSubMessage] = useState(
    "Fetching your projects...",
  );
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Create lookup maps for IDs to names
  const companyMap = useMemo(() => {
    const map = {};
    if (companies && Array.isArray(companies)) {
      companies.forEach((company) => {
        if (company && company.id) map[company.id] = company.name;
      });
    }
    return map;
  }, [companies]);

  const sectorMap = useMemo(() => {
    const map = {};
    if (sectors && Array.isArray(sectors)) {
      sectors.forEach((sector) => {
        if (sector && sector.id) map[sector.id] = sector.name;
      });
    }
    return map;
  }, [sectors]);

  const clientMap = useMemo(() => {
    const map = {};
    if (clients && Array.isArray(clients)) {
      clients.forEach((client) => {
        if (client && client.id) map[client.id] = client.name;
      });
    }
    return map;
  }, [clients]);

  const getWeightedProgress = (project) => {
    const activities = getActivities(project);

    if (!activities.length) return 0;

    let totalWeight = 0;
    let completedWeight = 0;

    activities.forEach((activity) => {
      const weight = Number(activity.weightage) || 0;
      const subs = activity.subactivities || [];

      if (!subs.length) return;

      const completedSubs = subs.filter(
        (s) => s.is_completed || s.status === "Complete",
      ).length;

      const activityProgress = completedSubs / subs.length;

      totalWeight += weight;
      completedWeight += weight * activityProgress;
    });

    if (totalWeight === 0) return 0;

    return Math.round((completedWeight / totalWeight) * 100);
  };

  // Load all data in a single loading session
  useEffect(() => {
    const loadAllData = async () => {
      setIsInitialLoading(true);
      setLoadingMessage("Loading Projects");
      setLoadingSubMessage("Fetching project data...");

      try {
        console.log("Loading all data...");
        await Promise.all([
          dispatch(fetchCompanies()).unwrap(),
          dispatch(fetchSectors()).unwrap(),
          dispatch(fetchClients()).unwrap(),
          dispatch(fetchProjects()).unwrap(),
        ]);
        console.log("All data loaded successfully");
      } catch (error) {
        console.error("Error loading data:", error);
        dispatch(
          showSnackbar({
            message: "Failed to load data from server",
            type: "warning",
          }),
        );
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadAllData();
  }, [dispatch]);

  // Refresh data
  const loadData = async () => {
    setRefreshing(true);
    setLoadingMessage("Refreshing Projects");
    setLoadingSubMessage("Fetching latest data...");

    try {
      await Promise.all([
        dispatch(fetchCompanies()).unwrap(),
        dispatch(fetchSectors()).unwrap(),
        dispatch(fetchClients()).unwrap(),
        dispatch(fetchProjects()).unwrap(),
      ]);
      dispatch(
        showSnackbar({
          message: "Data refreshed successfully",
          type: "success",
        }),
      );
    } catch (error) {
      dispatch(
        showSnackbar({
          message: "Failed to refresh data",
          type: "error",
        }),
      );
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteProject = async (projectId, projectName, e) => {
    e.stopPropagation();
    if (
      !window.confirm(
        `Are you sure you want to delete project "${projectName}"? This action cannot be undone.`,
      )
    ) {
      return;
    }
    setDeleteInProgress(true);
    setLoadingMessage("Deleting Project");
    setLoadingSubMessage(`Deleting ${projectName}...`);
    try {
      await dispatch(deleteProject(projectId)).unwrap();
      dispatch(
        showSnackbar({
          message: "Project deleted successfully",
          type: "success",
        }),
      );
      await loadData();
    } catch (error) {
      dispatch(
        showSnackbar({
          message: error.message || "Failed to delete project",
          type: "error",
        }),
      );
    } finally {
      setDeleteInProgress(false);
    }
  };

  const handlePickTask = (project, activity, subActivity, e) => {
    e.stopPropagation();
    setSelectedTask({ project, activity, subActivity });
    setShowTaskPicker(true);
  };

  const toggleActivity = (activityId, e) => {
    e.stopPropagation();
    setExpandedActivities((prev) => ({
      ...prev,
      [activityId]: !prev[activityId],
    }));
  };

  // Role-based checks
  const isACCOUNT = user?.role === "ACCOUNT";
  const isAdmin = user?.role === "ADMIN" || isACCOUNT;
  const isUser = user?.role === "USER";

  // Helper functions
  const getCompanyName = (project) => {
    const companyId = project.company || project.company_id;
    if (companyMap[companyId]) return companyMap[companyId];
    if (project.company_detail?.name) return project.company_detail.name;
    return companyId || "—";
  };

  const getSectorName = (project) => {
    const sectorId = project.sector || project.sector_id;
    if (sectorMap[sectorId]) return sectorMap[sectorId];
    if (project.sector_detail?.name) return project.sector_detail.name;
    return sectorId || "—";
  };

  const getClientName = (project) => {
    const clientId = project.client || project.client_id;
    if (clientMap[clientId]) return clientMap[clientId];
    if (project.client_detail?.name) return project.client_detail.name;
    return clientId || "—";
  };

  const getRoleIcon = () => {
    if (isACCOUNT) return <Shield size={16} className="text-purple-600" />;
    if (isAdmin) return <UserCog size={16} className="text-blue-600" />;
    return <User size={16} className="text-green-600" />;
  };

  const getRoleDisplay = () => {
    if (isACCOUNT) return "Account";
    if (isAdmin) return "Admin";
    return "Employee";
  };

  // Helper function to get sector unit
  const getSectorUnit = (project) => {
    const sectorName = getSectorName(project);
    const sector = sectors.find((s) => s.name === sectorName);
    return SECTOR_UNIT_MAPPING[sector?.unit] || "";
  };

  // Helper function to calculate GST amount
  const calculateGSTAmount = (project) => {
    const cost = getCost(project);
    const igst = project.igst_percentage || 0;
    const cgst = project.cgst_percentage || 0;
    const total = ((cost * igst) / 100 + (cost * cgst) / 100).toFixed(2);
    return total != 0.0 ? total : ((cost * 18) / 100).toFixed(2);
  };

  // Helper function to calculate total with GST
  const calculateTotalWithGST = (project) => {
    const cost = getCost(project);
    const igst = project.igst_percentage || 0;
    const cgst = project.cgst_percentage || 0;
    const total = ((cost * igst) / 100 + (cost * cgst) / 100).toFixed(2);
    return (cost + (total != 0.0 ? total : (cost * 18) / 100)).toFixed(2);
  };

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    if (!projects || !Array.isArray(projects)) return [];
    let filtered = [...projects];
    if (searchTerm) {
      filtered = filtered.filter((project) => {
        const name = (project.project_name || project.name || "").toLowerCase();
        const code = (project.project_code || project.code || "").toLowerCase();
        const term = searchTerm.toLowerCase();
        return name.includes(term) || code.includes(term);
      });
    }
    if (filterStatus !== "all") {
      filtered = filtered.filter((project) => {
        const projectStatus = project.status || "ONGOING";
        const progress = project.progress || 0;
        const daysLeft = getDaysUntilDeadline(
          project.completion_date || project.completionDate,
        );
        if (filterStatus === "delayed")
          return (
            (projectStatus === "DELAYED" || daysLeft < 0) && progress < 100
          );
        if (filterStatus === "critical")
          return daysLeft <= 2 && daysLeft >= 0 && progress < 100;
        if (filterStatus === "ongoing")
          return projectStatus === "ONGOING" && progress < 100;
        if (filterStatus === "completed")
          return progress === 100 || projectStatus === "COMPLETED";
        return true;
      });
    }
    filtered.sort((a, b) => {
      const aDays =
        getDaysUntilDeadline(a.completion_date || a.completionDate) || 999;
      const bDays =
        getDaysUntilDeadline(b.completion_date || b.completionDate) || 999;
      const aProgress = a.progress || 0;
      const bProgress = b.progress || 0;
      const aName = a.project_name || a.name || "";
      const bName = b.project_name || b.name || "";
      if (sortBy === "deadline") return aDays - bDays;
      if (sortBy === "progress") return bProgress - aProgress;
      if (sortBy === "name") return aName.localeCompare(bName);
      return 0;
    });
    return filtered;
  }, [projects, searchTerm, filterStatus, sortBy]);

  const stats = useMemo(() => {
    if (!projects || !Array.isArray(projects)) {
      return { total: 0, delayed: 0, critical: 0, completed: 0, ongoing: 0 };
    }
    return {
      total: projects.length,
      delayed: projects.filter((p) => {
        const status = p.status || "ONGOING";
        const progress = p.progress || 0;
        const daysLeft = getDaysUntilDeadline(
          p.completion_date || p.completionDate,
        );
        return (status === "DELAYED" || daysLeft < 0) && progress < 100;
      }).length,
      critical: projects.filter((p) => {
        const progress = p.progress || 0;
        const daysLeft = getDaysUntilDeadline(
          p.completion_date || p.completionDate,
        );
        return daysLeft <= 2 && daysLeft >= 0 && progress < 100;
      }).length,
      completed: projects.filter(
        (p) =>
          (p.progress || 0) === 100 || (p.status || "ONGOING") === "COMPLETED",
      ).length,
      ongoing: projects.filter((p) => {
        const progress = p.progress || 0;
        return progress > 0 && progress < 100;
      }).length,
    };
  }, [projects]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", damping: 15, stiffness: 100 },
    },
  };

  const handleRefresh = () => loadData();

  const getProjectId = (project) => project.id || project.project_id;
  const getProjectName = (project) =>
    project.project_name || project.name || "Unnamed Project";
  const getProjectCode = (project) =>
    project.project_code || project.code || "N/A";
  const getCompletionDate = (project) =>
    project.completion_date || project.completionDate || project.deadline;
  const getActualCompletionDate = (project) =>
    project.actual_completion_date ||
    project.completed_at ||
    project.updated_at;
  const getProgress = (project) => project.progress || 0;
  const getLocation = (project) => project.location || "No location specified";
  const getCost = (project) => project.workorder_cost || project.cost || 0;
  const getTotalLength = (project) =>
    project.total_length || project.totalLength || 0;
  const getLoaDate = (project) => project.loa_date || project.loaDate;
  const getDirectorProposalDate = (project) =>
    project.director_proposal_date || project.directorProposalDate;
  const getProjectConfirmationDate = (project) =>
    project.project_confirmation_date || project.projectConfirmationDate;
  const getActivities = (project) =>
    project.activities_detail || project.activities || [];

  const handleProjectNavigation = (projectId, e) => {
    if (e) e.stopPropagation();
    if (isUser) {
      navigate(`/my-projects/${projectId}`);
    } else {
      navigate(`/projects/${projectId}`);
    }
  };

  const showLoading = isInitialLoading || refreshing || deleteInProgress;
  const calculateDaysLeft = useCallback((endDate) => {
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
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <LoadingModal isVisible={showLoading} />

      {showTaskPicker && selectedTask && (
        <TaskPicker
          project={selectedTask.project}
          activity={selectedTask.activity}
          subActivity={selectedTask.subActivity}
          onClose={() => {
            setShowTaskPicker(false);
            setSelectedTask(null);
          }}
        />
      )}

      {!showLoading && (
        <>
          <div className="mb-10 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <motion.h1
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                >
                  {isAdmin ? "Project Portfolio" : "AVAILABLE PROJECTS"}
                </motion.h1>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${isACCOUNT
                      ? "bg-purple-100 text-purple-600"
                      : isAdmin
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                    }`}
                >
                  {getRoleIcon()}
                  {getRoleDisplay()}
                </motion.div>
              </div>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-gray-500 text-lg"
              >
                {isAdmin
                  ? "Track and manage all your construction projects in one place"
                  : "Browse projects and pick tasks to work on"}
              </motion.p>
            </div>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleRefresh}
              disabled={showLoading}
              className="p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 flex items-center gap-2"
            >
              <RefreshCw
                size={20}
                className={`text-blue-600 ${refreshing ? "animate-spin" : ""}`}
              />
              <span className="text-sm font-medium text-gray-700">Refresh</span>
            </motion.button>
          </div>

          {/* Stats Cards - Removed Critical/Delayed for user, only shown to Admin */}
          {isAdmin && projects.length > 0 && (
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

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search projects by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

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
                <Filter
                  className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>

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
                <ChevronDown
                  className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>

              {isAdmin && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/projects/create")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <Plus size={20} />
                  New Project
                </motion.button>
              )}
            </div>

            {isUser && (
              <div className="mt-4 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-xl">
                <UserCheck size={18} />
                <span>
                  You're browsing as <strong>{user?.name}</strong> (Employee).
                </span>
              </div>
            )}
          </motion.div>

          <AnimatePresence>
            {filteredProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100"
              >
                <FolderOpen size={64} className="mx-auto mb-4 text-gray-300" />
                <p className="text-2xl font-semibold text-gray-700 mb-2">
                  No projects found
                </p>
                {isAdmin && (
                  <button
                    onClick={() => navigate("/projects/create")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-xl transition-all inline-flex items-center gap-2 text-lg"
                  >
                    <Plus size={24} /> Create New Project
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-6"
              >
                {filteredProjects.map((project) => {
                  {
                    console.log(project, "project");
                  }
                  const projectId = getProjectId(project);
                  const projectName = getProjectName(project);
                  const projectCode = getProjectCode(project);
                  const completionDate = getCompletionDate(project);
                  const actualCompletionDate = getActualCompletionDate(project);
                  const progress = getProgress(project);
                  const location = getLocation(project);
                  const daysLeft = getDaysUntilDeadline(completionDate);
                  const activities = getActivities(project);
                  const isCompleted = progress === 100;
                  const weightedProgress = getWeightedProgress(project);

                  const statusInfo = getProjectStatusInfo({
                    status: project.status || "ONGOING",
                    completionDate: completionDate,
                    progress: progress,
                  });

                  const isExpanded = expandedCard === projectId;
                  return (
                    <motion.div
                      key={projectId}
                      variants={itemVariants}
                      layout
                      className={`bg-white rounded-3xl shadow-lg hover:shadow-2xl border-2 transition-all duration-300 relative group
                        ${isCompleted
                          ? "border-green-200 hover:border-green-300"
                          : statusInfo.status === "DELAYED"
                            ? "border-red-200 hover:border-red-300"
                            : statusInfo.status === "DUE_TODAY"
                              ? "border-orange-200 hover:border-orange-300"
                              : statusInfo.status === "CRITICAL"
                                ? "border-yellow-200 hover:border-yellow-300"
                                : "border-gray-100 hover:border-blue-200"
                        }`}
                    >
                      {/* {isAdmin && (
                        <button
                          onClick={(e) => handleDeleteProject(projectId, projectName, e)}
                          disabled={deleteInProgress}
                          className="absolute top-4 right-4 z-10 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all hover:scale-110"
                        >
                          <Trash2 size={16} />
                        </button>
                      )} */}

                      {/* <div className="p-6 cursor-pointer" onClick={() => handleProjectNavigation(projectId)}> */}
                      <div
                        className="p-6 cursor-pointer"
                        onClick={() =>
                          setExpandedCard(isExpanded ? null : projectId)
                        }
                      >
                        {/* <div className="p-6 cursor-pointer" > */}
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                          {/* LEFT SECTION */}
                          <div className="flex-1">
                            {/* 🔹 Header Row */}
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                {projectName}
                              </h3>

                              {/* Status */}
                              <motion.span
                                whileHover={{ scale: 1.05 }}
                                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1
                                  ${isCompleted
                                    ? "bg-green-100 text-green-700"
                                    : `${statusInfo.colors.bg} ${statusInfo.colors.text}`
                                  }`}
                              >
                                {isCompleted ? (
                                  <CheckCircle size={14} />
                                ) : (
                                  statusInfo.icon
                                )}
                                {isCompleted ? "Completed" : statusInfo.label}
                              </motion.span>

                              {/* Code */}
                              <motion.span
                                whileHover={{ scale: 1.05 }}
                                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusInfo.colors.bg} ${statusInfo.colors.text}`}
                              >
                                <Hash size={12} />
                                {projectCode}
                              </motion.span>

                              {/* 🔹 Location */}
                              <motion.span
                                whileHover={{ scale: 1.05 }}
                                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusInfo.colors.bg} ${statusInfo.colors.text}`}
                              >
                                <MapPin size={14} />
                                <span className="text-sm">{location}</span>
                              </motion.span>
                            </div>

                            {/* 🔹 Key Info Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                  <Calendar
                                    size={16}
                                    className="text-blue-600"
                                  />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Start</p>
                                  <p className="text-sm font-semibold">
                                    {formatDate(getLoaDate(project))}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <div
                                  className={`p-2 rounded-lg ${isCompleted
                                      ? "bg-green-50"
                                      : daysLeft < 0
                                        ? "bg-red-50"
                                        : daysLeft <= 2
                                          ? "bg-orange-50"
                                          : "bg-green-50"
                                    }`}
                                >
                                  <Clock
                                    size={16}
                                    className={
                                      isCompleted
                                        ? "text-green-600"
                                        : daysLeft < 0
                                          ? "text-red-600"
                                          : "text-green-600"
                                    }
                                  />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">
                                    {isCompleted ? "Completed" : "Deadline"}
                                  </p>
                                  <p className="text-sm font-semibold">
                                    {isCompleted
                                      ? formatDate(actualCompletionDate)
                                      : formatDate(completionDate)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                  <TrendingUp
                                    size={16}
                                    className="text-purple-600"
                                  />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Status
                                  </p>
                                  <p className="text-sm font-semibold">
                                    {progress === 100
                                      ? "Completed"
                                      : progress > 0
                                        ? "Ongoing"
                                        : "Pending"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                  <BarChart3
                                    size={16}
                                    className="text-indigo-600"
                                  />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Activities
                                  </p>
                                  <p className="text-sm font-semibold">
                                    {activities.length}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                  <UserCheck
                                    size={16}
                                    className="text-indigo-600"
                                  />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Client
                                  </p>
                                  <p className="text-sm font-semibold">
                                    {project?.client_detail?.client_name ||
                                      getClientName(project)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* RIGHT ACTIONS */}
                          {/* <div className="flex lg:flex-col gap-3 items-center lg:items-end">

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProjectNavigation(projectId);
                              }}
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                            >
                              <Eye size={18} />
                              <span className="hidden sm:inline">View</span>
                            </motion.button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedCard(isExpanded ? null : projectId);
                              }}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronUp size={20} />
                              ) : (
                                <ChevronDown size={20} />
                              )}
                            </button>
                          </div> */}

                          <div className="flex flex-column items-center justify-center gap-2">
                            {/* <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProjectNavigation(projectId);
                              }}
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                            >
                              <Eye size={18} /> View Details
                            </motion.button> */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedCard(isExpanded ? null : projectId);
                              }}
                              className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronUp size={20} />
                              ) : (
                                <ChevronDown size={20} />
                              )}
                            </button>
                          </div>
                        </div>
                        {/* 🔥 Progress Section */}
                        <div className="mt-5">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-500 font-medium">
                              Overall Progress
                            </span>
                            <span className="text-sm font-bold text-blue-600">
                              {weightedProgress}%
                            </span>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${weightedProgress}%` }}
                              transition={{ duration: 0.8 }}
                              className={`h-2 rounded-full ${weightedProgress === 100
                                  ? "bg-green-500"
                                  : weightedProgress > 70
                                    ? "bg-blue-500"
                                    : weightedProgress > 40
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                            />
                          </div>
                        </div>

                        {/* 💰 Quick Footer */}
                        {/* <div className="flex justify-between items-center mt-4 text-sm">
                          <div className="flex items-center gap-1 text-green-600 font-semibold">
                            <IndianRupee size={14} />
                            {getCost(project)}L
                          </div>

                          <div className="text-gray-400 text-xs">
                            {activities.length} activities
                          </div>
                        </div> */}

                        {/* Progress Bar - Only visible for Admin */}
                        {/* {isAdmin && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium text-gray-600">Overall Progress</span>
                              <span className={`font-bold ${isCompleted ? "text-green-600" : "text-blue-600"}`}>{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1 }} className={`h-3 rounded-full ${isCompleted ? "bg-green-500" : `bg-gradient-to-r ${statusInfo.colors.gradient}`}`} />
                            </div>
                          </div>
                        )} */}

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="mt-6 pt-6 border-t border-gray-100 overflow-hidden"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* Key Metrics Dashboard */}
                              {!isUser && (
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3">
                                    <p className="text-xs text-gray-500 mb-1">
                                      Total Length
                                    </p>
                                    <p className="text-xl font-bold text-blue-700">
                                      {getTotalLength(project)}{" "}
                                      <span className="text-sm font-normal">
                                        {getSectorUnit(project)}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3">
                                    <p className="text-xs text-gray-500 mb-1">
                                      Workorder Amount
                                    </p>
                                    <p className="text-xl font-bold text-green-700">
                                      ₹{getCost(project)}{" "}
                                      <span className="text-sm font-normal">
                                        Lakhs
                                      </span>
                                    </p>
                                  </div>
                                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3">
                                    <p className="text-xs text-gray-500 mb-1">
                                      Total Activities
                                    </p>
                                    <p className="text-xl font-bold text-purple-700">
                                      {activities.length}
                                    </p>
                                  </div>
                                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3">
                                    <p className="text-xs text-gray-500 mb-1">
                                      GST Amount
                                    </p>
                                    <p className="text-xl font-bold text-orange-700">
                                      ₹{calculateGSTAmount(project)}{" "}
                                      <span className="text-sm font-normal">
                                        Lakhs
                                      </span>
                                    </p>
                                  </div>
                                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-3">
                                    <p className="text-xs text-gray-500 mb-1">
                                      Total with GST
                                    </p>
                                    <p className="text-xl font-bold text-teal-700">
                                      ₹{calculateTotalWithGST(project)}{" "}
                                      <span className="text-sm font-normal">
                                        Lakhs
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Two Column Layout for Details */}
                              <div className="grid md:grid-cols-2 gap-6 mb-6">
                                {/* Left Column - Basic Information */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                  <h4 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
                                    <Building2
                                      size={18}
                                      className="text-blue-600"
                                    />
                                    Basic Information
                                  </h4>
                                  <div className="space-y-3">
                                    <div className="flex items-center py-2 border-b border-gray-200">
                                      <span className="text-sm text-gray-500 w-40">
                                        Project Code :
                                      </span>
                                      <span className="text-sm font-medium text-gray-800">
                                        {projectCode}
                                      </span>
                                    </div>
                                    <div className="flex items-center py-2 border-b border-gray-200">
                                      <span className="text-sm text-gray-500 w-40">
                                        Short Name :
                                      </span>
                                      <span className="text-sm font-medium text-gray-800">
                                        {project.short_name ||
                                          project.shortName ||
                                          "—"}
                                      </span>
                                    </div>
                                    <div className="flex items-center py-2 border-b border-gray-200">
                                      <span className="text-sm text-gray-500 w-40">
                                        Location :
                                      </span>
                                      <span className="text-sm font-medium text-gray-800">
                                        {location}
                                      </span>
                                    </div>
                                    <div className="flex items-center py-2 border-b border-gray-200">
                                      <span className="text-sm text-gray-500 w-40">
                                        Our Company :
                                      </span>
                                      <span className="text-sm font-medium text-gray-800">
                                        {getCompanyName(project)}
                                      </span>
                                    </div>
                                    {project.gst_no && (
                                      <div className="flex items-center py-2 border-b border-gray-200">
                                        <span className="text-sm text-gray-500 w-40">
                                          Company GST :
                                        </span>
                                        <span className="text-sm font-medium text-gray-800 font-mono">
                                          {project.gst_no}
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex items-center py-2 border-b border-gray-200">
                                      <span className="text-sm text-gray-500 w-40">
                                        Sector :
                                      </span>
                                      <span className="text-sm font-medium text-gray-800">
                                        {getSectorName(project)}
                                      </span>
                                    </div>
                                    <div className="flex items-center py-2 border-b border-gray-200">
                                      <span className="text-sm text-gray-500 w-40">
                                        Client :
                                      </span>
                                      <span className="text-sm font-medium text-gray-800">
                                        {project?.client_detail?.client_name ||
                                          getClientName(project)}
                                      </span>
                                    </div>
                                    {/* {project.clientbranch && (
                                      <>
                                        <div className="flex items-center py-2 border-b border-gray-200">
                                          <span className="text-sm text-gray-500 w-40">Branch</span>
                                          <span className="text-sm font-medium text-g :ray-800">{project.clientbranch_detail?.name || project.clientbranch}</span>
                                        </div>
                                        <div className="flex items-center py-2">
                                          <span className="text-sm text-gray-500 w-40">Client GST</span>
                                          <span className="text-sm font-medium text-g :ray-800 font-mono">{project.clientbranch_detail?.gst || "—"}</span>
                                        </div>
                                      </>
                                    )} */}
                                    {project.clientbranch &&
                                      (() => {
                                        const matchedBranch =
                                          project.client_detail?.branches?.find(
                                            (b) =>
                                              b.gst?.trim() ===
                                              project.clientbranch?.trim(),
                                          );

                                        return (
                                          <>
                                            <div className="flex items-center py-2 border-b border-gray-200">
                                              <span className="text-sm text-gray-500 w-40">
                                                Branch :
                                              </span>
                                              <span className="text-sm font-medium text-gray-800">
                                                {matchedBranch?.name?.trim() ||
                                                  ""}{" "}
                                                -{" "}
                                                {matchedBranch?.state?.trim() ||
                                                  ""}
                                              </span>
                                            </div>

                                            {!isUser && (
                                              <div className="flex items-center py-2">
                                                <span className="text-sm text-gray-500 w-40">
                                                  Client GST :
                                                </span>
                                                <span className="text-sm font-medium text-gray-800">
                                                  {matchedBranch?.gst || "—"}
                                                </span>
                                              </div>
                                            )}
                                          </>
                                        );
                                      })()}
                                  </div>
                                </div>

                                {/* Right Column - Project Specifications & Dates */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                  <h4 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
                                    <Calendar
                                      size={18}
                                      className="text-green-600"
                                    />
                                    Project Specifications & Dates
                                  </h4>
                                  <div className="space-y-3">
                                    <div className="flex items-center py-2 border-b border-gray-200">
                                      <span className="text-sm text-gray-500 w-40">
                                        Total Length :
                                      </span>
                                      <span className="text-sm font-medium text-gray-800">
                                        {getTotalLength(project)}{" "}
                                        {getSectorUnit(project)}
                                      </span>
                                    </div>
                                    {!isUser && (
                                      <div className="flex items-center py-2 border-b border-gray-200">
                                        <span className="text-sm text-gray-500 w-40">
                                          Workorder Amount :
                                        </span>
                                        <span className="text-sm font-medium text-gray-800">
                                          ₹{getCost(project)} Lakhs
                                        </span>
                                      </div>
                                    )}
                                    {project.igst_percentage && (
                                      <div className="flex items-center py-2 border-b border-gray-200">
                                        <span className="text-sm text-gray-500 w-40">
                                          GST Percentage :
                                        </span>
                                        <span className="text-sm font-medium text-gray-800">
                                          {project.igst_percentage}%
                                        </span>
                                      </div>
                                    )}
                                    {project.cgst_percentage && (
                                      <div className="flex items-center py-2 border-b border-gray-200">
                                        <span className="text-sm text-gray-500 w-40">
                                          CGST Percentage :
                                        </span>
                                        <span className="text-sm font-medium text-gray-800">
                                          {project.cgst_percentage}%
                                        </span>
                                      </div>
                                    )}
                                    {!isUser && (
                                      <>
                                        <div className="flex items-center py-2 border-b border-gray-200">
                                          <span className="text-sm text-gray-500 w-40">
                                            LOA Date :
                                          </span>
                                          <span className="text-sm font-medium text-gray-800">
                                            {formatDate(getLoaDate(project))}
                                          </span>
                                        </div>
                                        <div className="flex items-center py-2 border-b border-gray-200">
                                          <span className="text-sm text-gray-500 w-40">
                                            Completion Date :
                                          </span>
                                          <span className="text-sm font-medium text-gray-800">
                                            {formatDate(completionDate)}
                                          </span>
                                        </div>
                                      </>
                                    )}
                                    {isCompleted && actualCompletionDate && (
                                      <div className="flex items-center py-2 border-b border-gray-200">
                                        <span className="text-sm text-gray-500 w-40">
                                          Actual Completion Date :
                                        </span>
                                        <span className="text-sm font-medium text-green-600">
                                          {formatDate(actualCompletionDate)}
                                        </span>
                                      </div>
                                    )}

                                    {!isCompleted && daysLeft !== undefined && (
                                      <div
                                        className={`flex items-center py-2 border-b border-gray-200 ${daysLeft < 0 ? "bg-red-50 -mx-2 px-2 rounded-lg" : daysLeft <= 2 ? "bg-orange-50 -mx-2 px-2 rounded-lg" : ""}`}
                                      >
                                        <span className="text-sm text-gray-500 w-40">
                                          Days Remaining :
                                        </span>
                                        <span
                                          className={`text-sm font-bold ${daysLeft < 0 ? "text-red-600" : daysLeft <= 2 ? "text-orange-600" : "text-green-600"}`}
                                        >
                                          {daysLeft < 0
                                            ? `Overdue by ${Math.abs(daysLeft)} days`
                                            : `${daysLeft} days left`}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* GST Calculation Summary */}
                              {(project.igst_percentage ||
                                project.cgst_percentage) &&
                                getCost(project) > 0 && (
                                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
                                    <h4 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
                                      <Percent
                                        size={18}
                                        className="text-blue-600"
                                      />
                                      GST Calculation Summary
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                      <div>
                                        <p className="text-xs text-gray-500 mb-1">
                                          Workorder Amount
                                        </p>
                                        <p className="text-lg font-bold text-gray-800">
                                          ₹{getCost(project)} Lakhs
                                        </p>
                                      </div>
                                      {project.igst_percentage && (
                                        <div>
                                          <p className="text-xs text-gray-500 mb-1">
                                            GST ({project.igst_percentage}%)
                                          </p>
                                          <p className="text-lg font-bold text-blue-600">
                                            ₹
                                            {(
                                              (getCost(project) *
                                                project.igst_percentage) /
                                              100
                                            ).toFixed(2)}{" "}
                                            Lakhs
                                          </p>
                                        </div>
                                      )}
                                      <div>
                                        <p className="text-xs text-gray-500 mb-1">
                                          Total with GST
                                        </p>
                                        <p className="text-lg font-bold text-green-600">
                                          ₹
                                          {(
                                            getCost(project) +
                                            (getCost(project) *
                                              (project.igst_percentage || 0)) /
                                            100
                                          ).toFixed(2)}{" "}
                                          Lakhs
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                              {/* Activities Section */}
                              {activities.length > 0 && (
                                <div className="mt-6">
                                  <h4 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
                                    <Briefcase
                                      size={18}
                                      className="text-blue-600"
                                    />
                                    Activities & Sub-Activities (
                                    {activities.length})
                                  </h4>
                                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                                    {activities.map((activity, actIndex) => {
                                      const subs = activity.subactivities || [];
                                      const isActivityExpanded =
                                        expandedActivities[activity.id];
                                      const activityProgress =
                                        subs.length > 0
                                          ? (subs.filter(
                                            (s) =>
                                              s.is_completed ||
                                              s.status === "Complete",
                                          ).length /
                                            subs.length) *
                                          100
                                          : 0;
                                      const daysLeft = calculateDaysLeft(
                                        activity?.end_date || activity.endDate,
                                      );
                                      return (
                                        <div
                                          key={activity.id || actIndex}
                                          className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200"
                                        >
                                          <div
                                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                                            onClick={(e) =>
                                              toggleActivity(activity.id, e)
                                            }
                                          >
                                            <div className="flex-1">
                                              <div className="flex items-center gap-3 flex-wrap">
                                                <h5 className="font-semibold text-gray-800">
                                                  {activity.activity_name}
                                                </h5>
                                                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                                                  Weightage:{" "}
                                                  {activity.weightage || 0}%
                                                </span>
                                                <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600">
                                                  {subs.length} tasks
                                                </span>

                                                <span
                                                  className={`text-xs px-2 py-1 rounded-full ${activityProgress == 100 ? "bg-green-100 text-green-600" : daysLeft < 0 ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}
                                                >
                                                  {activityProgress == 100
                                                    ? "Completed"
                                                    : daysLeft < 0
                                                      ? "Delayed"
                                                      : "Ongoing"}
                                                </span>
                                              </div>
                                              <div className="mt-2">
                                                <div className="flex justify-between text-xs mb-1">
                                                  <span className="text-gray-500">
                                                    Activity Progress
                                                  </span>
                                                  <span className="font-medium text-blue-600">
                                                    {Math.round(
                                                      activityProgress,
                                                    )}
                                                    %
                                                  </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                                  <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{
                                                      width: `${activityProgress}%`,
                                                    }}
                                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                                  />
                                                </div>
                                              </div>
                                              {activity.start_date &&
                                                activity.end_date && (
                                                  <p className="text-xs text-gray-400 mt-2">
                                                    {formatDate(
                                                      activity.start_date,
                                                    )}{" "}
                                                    →{" "}
                                                    {formatDate(
                                                      activity.end_date,
                                                    )}
                                                  </p>
                                                )}
                                            </div>
                                            <button className="p-2 hover:bg-white rounded-lg transition-colors">
                                              {isActivityExpanded ? (
                                                <ChevronUp size={18} />
                                              ) : (
                                                <ChevronDown size={18} />
                                              )}
                                            </button>
                                          </div>

                                          <AnimatePresence>
                                            {isActivityExpanded && (
                                              <motion.div
                                                initial={{
                                                  height: 0,
                                                  opacity: 0,
                                                }}
                                                animate={{
                                                  height: "auto",
                                                  opacity: 1,
                                                }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-gray-200"
                                              >
                                                <div className="p-4 space-y-2 bg-white">
                                                  {subs.length === 0 ? (
                                                    <p className="text-sm text-gray-400 text-center py-4">
                                                      No sub-activities
                                                      available
                                                    </p>
                                                  ) : (
                                                    subs.map(
                                                      (sub, subIndex) => {
                                                        const isSubCompleted =
                                                          sub.is_completed ||
                                                          sub.status ===
                                                          "Complete";
                                                        const pickedStatus =
                                                          sub.picked_at
                                                            ?.length > 0;
                                                        const isPickedByMe =
                                                          pickedStatus &&
                                                          sub.picked_at.some(
                                                            (p) =>
                                                              p.emp_code ===
                                                              user?.id,
                                                          );

                                                        return (
                                                          <div
                                                            key={
                                                              sub.id || subIndex
                                                            }
                                                            className="bg-gray-50 rounded-lg p-3 flex items-center justify-between hover:shadow-sm transition-shadow"
                                                          >
                                                            <div className="flex-1 rounded-xl p-3  bg-white shadow-sm hover:shadow-md transition">
                                                              {/* HEADER */}
                                                              <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                                                                <p className="text-sm font-semibold text-gray-800">
                                                                  {
                                                                    sub.subactivity_name
                                                                  }
                                                                </p>

                                                                <div className="flex items-center gap-2 flex-wrap text-sm">
                                                                  {sub.unit && (
                                                                    <span className="badge-gray">
                                                                      Unit:{" "}
                                                                      {sub.unit}
                                                                    </span>
                                                                  )}
                                                                  {sub.total_quantity !==
                                                                    "0" && (
                                                                      <span className="badge-purple">
                                                                        Qty:{" "}
                                                                        {
                                                                          sub.total_quantity
                                                                        }
                                                                      </span>
                                                                    )}
                                                                  {isSubCompleted && (
                                                                    <span className="badge-green">
                                                                      <CheckCircle
                                                                        size={
                                                                          12
                                                                        }
                                                                      />{" "}
                                                                      Completed
                                                                    </span>
                                                                  )}
                                                                  {pickedStatus &&
                                                                    !isSubCompleted && (
                                                                      <span className="badge-yellow">
                                                                        <User
                                                                          size={
                                                                            12
                                                                          }
                                                                        />{" "}
                                                                        In
                                                                        Progress
                                                                      </span>
                                                                    )}
                                                                </div>
                                                              </div>

                                                              {/* DESCRIPTION */}
                                                              {sub.description && (
                                                                <p className="text-xs text-gray-500">
                                                                  {
                                                                    sub.description
                                                                  }
                                                                </p>
                                                              )}

                                                              {/* META INFO */}
                                                              <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-2">
                                                                {sub.chainage_start &&
                                                                  sub.chainage_end && (
                                                                    <p>
                                                                      📍{" "}
                                                                      {
                                                                        sub.chainage_start
                                                                      }{" "}
                                                                      m
                                                                      {/* →{" "}
                                                                      {
                                                                        sub.chainage_end
                                                                      }{" "}
                                                                      km */}
                                                                    </p>
                                                                  )}

                                                                {!isUser && (
                                                                  <>
                                                                    {sub.submission_payment && (
                                                                      <p>
                                                                        💰
                                                                        Submission:{" "}
                                                                        {
                                                                          sub.submission_payment
                                                                        }
                                                                        %
                                                                      </p>
                                                                    )}

                                                                    {sub.approval_payment && (
                                                                      <p>
                                                                        ✅
                                                                        Approval:{" "}
                                                                        {
                                                                          sub.approval_payment
                                                                        }
                                                                        %
                                                                      </p>
                                                                    )}
                                                                  </>
                                                                )}

                                                                {sub.covered_area && (
                                                                  <p>
                                                                    📐 Area:{" "}
                                                                    {
                                                                      sub.covered_area
                                                                    }{" "}
                                                                    m²
                                                                  </p>
                                                                )}
                                                                {!isUser && (
                                                                  <>
                                                                    {sub.submission_payment !=
                                                                      0 && (
                                                                        <p>
                                                                          💰
                                                                          Submission
                                                                          Payment:{" "}
                                                                          <b>
                                                                            {(
                                                                              (((project?.workorder_cost ||
                                                                                0) *
                                                                                (sub?.submission_payment ||
                                                                                  0)) /
                                                                                100) *
                                                                              1.18
                                                                            ).toFixed(
                                                                              2,
                                                                            )}{" "}
                                                                            Lakh{" "}
                                                                          </b>
                                                                          (GST
                                                                          Included)
                                                                        </p>
                                                                      )}

                                                                    {sub.approval_payment !=
                                                                      0 && (
                                                                        <p>
                                                                          💰
                                                                          Approval
                                                                          Payment:{" "}
                                                                          <b>
                                                                            {(
                                                                              (((project?.workorder_cost ||
                                                                                0) *
                                                                                (sub?.approval_payment ||
                                                                                  0)) /
                                                                                100) *
                                                                              1.18
                                                                            ).toFixed(
                                                                              2,
                                                                            )}{" "}
                                                                            Lakh{" "}
                                                                          </b>
                                                                          (GST
                                                                          Included)
                                                                        </p>
                                                                      )}
                                                                  </>
                                                                )}
                                                              </div>

                                                              {/* USER INFO */}
                                                              {sub.assigned_user && (
                                                                <div className="flex items-center gap-2 mt-3 text-xs text-gray-600">
                                                                  <User
                                                                    size={14}
                                                                  />
                                                                  <span>
                                                                    Assigned to:{" "}
                                                                    <b>
                                                                      {
                                                                        sub
                                                                          .assigned_user
                                                                          .name
                                                                      }
                                                                    </b>
                                                                  </span>
                                                                </div>
                                                              )}
                                                              {/* TOTAL WORK SUMMARY */}
                                                              <div className="mt-3 flex justify-between items-center text-xs font-medium text-gray-600 border-t pt-2">
                                                                <span>
                                                                  Total Work
                                                                  Done
                                                                </span>
                                                                <span className="text-green-600 font-semibold">
                                                                  {sub.work_done ||
                                                                    0}{" "}
                                                                  {/* {sub.unit ||
                                                                    ""} */}
                                                                  %
                                                                </span>
                                                              </div>
                                                              {/* TIME LOGS */}
                                                              {!isUser && (
                                                                <>
                                                                  {sub
                                                                    .work_summary
                                                                    ?.users
                                                                    ?.length >
                                                                    0 && (
                                                                      <div className="mt-3 bg-gray-50 rounded-lg p-2">
                                                                        <div className="flex items-center justify-between mb-1">
                                                                          <p className="text-xs font-medium text-gray-700 flex items-center gap-1">
                                                                            <Clock
                                                                              size={
                                                                                12
                                                                              }
                                                                            />{" "}
                                                                            Time
                                                                            Logs
                                                                          </p>
                                                                          <p className="text-xs font-semibold text-blue-600">
                                                                            Total:{" "}
                                                                            {
                                                                              sub
                                                                                .work_summary
                                                                                .total_hours
                                                                            }{" "}
                                                                            hrs
                                                                          </p>
                                                                          <br />
                                                                        </div>

                                                                        <div className="space-y-1 max-h-24 overflow-y-auto">
                                                                          {sub.work_summary?.users?.map(
                                                                            (
                                                                              log,
                                                                              i,
                                                                            ) => (
                                                                              <div
                                                                                key={
                                                                                  i
                                                                                }
                                                                                className="flex justify-between text-xs text-gray-500 border-b last:border-none border-gray-300 pb-1"
                                                                              >
                                                                                <span>
                                                                                  {
                                                                                    log.emp_code
                                                                                  }{" "}
                                                                                  →{" "}
                                                                                  {
                                                                                    log.name
                                                                                  }

                                                                                  →{" "}
                                                                                  {log?.days_worked +
                                                                                    " " +
                                                                                    (log?.days_worked >
                                                                                      1
                                                                                      ? "days"
                                                                                      : "day") ||
                                                                                    "0 day"}
                                                                                </span>
                                                                                <span>
                                                                                  {
                                                                                    log.total_time_spent
                                                                                  }

                                                                                  h
                                                                                </span>
                                                                              </div>
                                                                            ),
                                                                          )}
                                                                        </div>
                                                                      </div>
                                                                    )}
                                                                </>
                                                              )}
                                                            </div>

                                                            {/* {!isSubCompleted && !pickedStatus && isUser && (
                                                            <motion.button
                                                              whileHover={{ scale: 1.05 }}
                                                              whileTap={{ scale: 0.95 }}
                                                              onClick={(e) => handlePickTask(project, activity, sub, e)}
                                                              className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-1"
                                                            >
                                                              <Briefcase size={14} />
                                                              <span className="text-xs font-medium hidden sm:inline">Pick Task</span>
                                                            </motion.button>
                                                          )} */}

                                                            {!isSubCompleted &&
                                                              isPickedByMe && (
                                                                <div className="flex items-center gap-2">
                                                                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full flex items-center gap-1">
                                                                    <User
                                                                      size={12}
                                                                    />{" "}
                                                                    Assigned to
                                                                    you
                                                                  </span>
                                                                </div>
                                                              )}
                                                          </div>
                                                        );
                                                      },
                                                    )
                                                  )}
                                                </div>
                                              </motion.div>
                                            )}
                                          </AnimatePresence>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Assigned Personnel Section */}
                              {project.assigned_to && (
                                <div className="mt-6 bg-gray-50 rounded-xl p-4">
                                  <h4 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
                                    <UserCheck
                                      size={18}
                                      className="text-blue-600"
                                    />
                                    Assigned Personnel
                                  </h4>
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                                      {project.assigned_to
                                        ?.charAt(0)
                                        ?.toUpperCase() || "U"}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-800">
                                        {project.assigned_to_detail?.name ||
                                          project.assigned_to}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Project Supervisor
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
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
        </>
      )}
    </motion.div>
  );
};

export default ProjectList;
