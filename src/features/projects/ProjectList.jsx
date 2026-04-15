import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
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
  X,
  Save,
  PlusCircle,
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
import { saveDailyWorkLog } from "../tasks/taskSlice";

const ProjectList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // const showProjectDetailsID = location.state?.showProjectDetailsID;

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
  const [selectedTaskfortimelog, setSelectedTaskfortimelog] = useState(null);
  const [showTaskPicker, setShowTaskPicker] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading Projects");
  const [loadingSubMessage, setLoadingSubMessage] = useState(
    "Fetching your projects...",
  );
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [showTimeLogModal, setShowTimeLogModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [timeLogData, setTimeLogData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    description: ''
  });

  const [worklogreturned, setWorkLogReturned] = useState([]);

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
        await Promise.all([
          dispatch(fetchCompanies()).unwrap(),
          dispatch(fetchSectors()).unwrap(),
          dispatch(fetchClients()).unwrap(),
          dispatch(fetchProjects()).unwrap(),
        ]);
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



  const handleSaveTimeLog = async () => {
    if (!selectedTaskfortimelog) return;

    // Validate
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

    setIsSaving(true);
    try {
      await dispatch(saveDailyWorkLog({
        projectId: selectedTaskfortimelog.project_id,
        subActivityId: selectedTaskfortimelog.id,
        date: timeLogData.date,
        startTime: timeLogData.startTime,
        endTime: timeLogData.endTime,
        note: timeLogData.description,
        status: 'WORKED'
      })).unwrap();

      dispatch(showSnackbar({
        message: 'Work hours saved successfully!',
        type: 'success'
      }));

      const mixedData = {
        ...selectedTaskfortimelog,
        date: timeLogData.date,
        startTime: timeLogData.startTime,
        endTime: timeLogData.endTime,
        description: timeLogData.description
      };
      setWorkLogReturned((prev) => [...prev, mixedData]);

      setShowTimeLogModal(false);
      setSelectedTaskfortimelog(null);
      setTimeLogData({
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        description: ''
      });

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


  // Add this state
  const [hasAutoExpanded, setHasAutoExpanded] = useState(false);
  const [targetSubActivityId, setTargetSubActivityId] = useState(null);
  const [targetActivityId, setTargetActivityId] = useState(null);

  // Replace your existing useEffect with this:
  useEffect(() => {
    const projectId = location.state?.showProjectDetailsID;
    const activityId = location.state?.showActivityDetailsID;
    const subActivityId = location.state?.showSubAcivityDetailsID;

    if (projectId && !hasAutoExpanded && !isInitialLoading && filteredProjects.length > 0) {
      // Check if the project exists in filteredProjects
      const projectExists = filteredProjects.some(p => {
        const pid = p.id || p.project_id;
        return pid === projectId;
      });

      if (projectExists) {

        // Store target IDs for subactivity expansion
        if (activityId) setTargetActivityId(activityId);
        if (subActivityId) setTargetSubActivityId(subActivityId);

        // Expand the card
        setExpandedCard(projectId);

        // Small delay to ensure DOM is updated with expanded content
        setTimeout(() => {
          const element = document.getElementById(`project-card-${projectId}`);
          if (element) {
            // Scroll to the element
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });

            // // Add highlight effect
            // element.classList.add('ring-4', 'ring-blue-400', 'ring-offset-2', 'transition-all', 'duration-300');
            // setTimeout(() => {
            //   element.classList.remove('ring-4', 'ring-blue-400', 'ring-offset-2');
            // }, 2000);
          }
        }, 200); // Increased delay for smoother expansion


        // Small delay to ensure DOM is updated with expanded content
        setTimeout(() => {
          const element = document.getElementById(`project-card-${projectId}`);
          if (element) {
            // Scroll to the element
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }

          // If subactivity ID is provided, expand the specific activity and scroll to subactivity
          if (subActivityId) {
            // Find which activity contains this subactivity
            const project = filteredProjects.find(p => (p.id || p.project_id) === projectId);
            if (project && project.activities_detail) {
              const activity = project.activities_detail.find(act =>
                act.subactivities && act.subactivities.some(sub => sub.id === subActivityId)
              );

              if (activity) {
                // Expand the activity
                setExpandedActivities(prev => ({
                  ...prev,
                  [activity.id]: true
                }));

                // Scroll to the subactivity after a delay
                setTimeout(() => {
                  const subActivityElement = document.getElementById(`subactivity-row-${subActivityId}`);
                  if (subActivityElement) {
                    subActivityElement.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center'
                    });
                    // // Add highlight effect
                    // subActivityElement.classList.add('bg-yellow-50', 'transition-all', 'duration-300');
                    // setTimeout(() => {
                    //   subActivityElement.classList.remove('bg-yellow-50');
                    // }, 2000);
                  }
                }, 300);
              }
            }
          } else if (activityId) {
            // If only activity ID is provided, expand that activity
            setExpandedActivities(prev => ({
              ...prev,
              [activityId]: true
            }));

            // Scroll to the activity after a delay
            setTimeout(() => {
              const activityElement = document.getElementById(`activity-${activityId}`);
              if (activityElement) {
                activityElement.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center'
                });
                // activityElement.classList.add('ring-2', 'ring-blue-400', 'transition-all', 'duration-300');
                // setTimeout(() => {
                //   activityElement.classList.remove('ring-2', 'ring-blue-400');
                // }, 2000);
              }
            }, 300);
          }
        }, 200);

        setHasAutoExpanded(true);

        // Clear the location state
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, isInitialLoading, filteredProjects, hasAutoExpanded]);


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
      {/* Time Log Modal */}
      <AnimatePresence>
        {showTimeLogModal && selectedTaskfortimelog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowTimeLogModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="bg-white rounded-2xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Clock size={20} className="text-blue-500" />
                  Log Work Hours
                </h3>
                <button
                  onClick={() => setShowTimeLogModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Task Info */}
              <div className="mb-5 p-3 bg-gray-50 rounded-xl border">
                <p className="font-medium text-gray-800">{selectedTaskfortimelog.subactivity_name}</p>
                <p className="text-sm text-gray-500">{selectedTaskfortimelog.project_name}</p>
              </div>

              {/* Date */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Date</label>
                <input
                  type="date"
                  value={timeLogData.date}
                  onChange={(e) =>
                    setTimeLogData({ ...timeLogData, date: e.target.value })
                  }
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Time Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                {/* Start Time */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Start Time
                  </label>
                  <select
                    value={timeLogData.startTime}
                    onChange={(e) =>
                      setTimeLogData({ ...timeLogData, startTime: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    {Array.from({ length: 24 }).map((_, hour) =>
                      ["00", "30"].map((min) => {
                        const time = `${String(hour).padStart(2, "0")}:${min}`;
                        return (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        );
                      })
                    )}
                  </select>
                </div>

                {/* End Time */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    End Time
                  </label>
                  <select
                    value={timeLogData.endTime}
                    onChange={(e) =>
                      setTimeLogData({ ...timeLogData, endTime: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    {Array.from({ length: 24 }).map((_, hour) =>
                      ["00", "30"].map((min) => {
                        const time = `${String(hour).padStart(2, "0")}:${min}`;
                        return (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        );
                      })
                    )}
                  </select>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  { label: "Full Day", start: "09:00", end: "18:00" },
                  { label: "Half Day", start: "09:00", end: "13:00" },
                  { label: "Evening", start: "14:00", end: "18:00" },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() =>
                      setTimeLogData({
                        ...timeLogData,
                        startTime: preset.start,
                        endTime: preset.end,
                      })
                    }
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Validation + Total */}
              {timeLogData.startTime && timeLogData.endTime && (
                <div className="mb-4 p-3 rounded-lg border bg-blue-50">
                  {timeLogData.endTime <= timeLogData.startTime ? (
                    <p className="text-red-500 text-sm font-medium">
                      End time must be after start time
                    </p>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700">Total Hours:</span>
                      <span className="text-lg font-semibold text-blue-700">
                        {calculateHours(
                          timeLogData.startTime,
                          timeLogData.endTime
                        ).toFixed(2)}{" "}
                        hrs
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="mb-5">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Description
                </label>
                <textarea
                  value={timeLogData.description}
                  onChange={(e) =>
                    setTimeLogData({
                      ...timeLogData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe what you worked on..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowTimeLogModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveTimeLog}
                  disabled={
                    isSaving ||
                    !timeLogData.startTime ||
                    !timeLogData.endTime ||
                    timeLogData.endTime <= timeLogData.startTime
                  }
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition"
                >
                  {isSaving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                      id={`project-card-${projectId}`}
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

                              {/* <div className="flex items-center gap-2">
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
                              </div> */}
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
                                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3">
                                    <p className="text-xs text-gray-500 mb-1">
                                      Total Activities
                                    </p>
                                    <p className="text-xl font-bold text-purple-700">
                                      {activities.length}
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
                                      // if (activity.activity_name == "Deliverable Item" && isUser) return null; // Skip rendering this activity
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
                                          id={`activity-${activity.id}`}
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


                                                <div className="overflow-x-auto bg-white rounded-xl border shadow-sm">
                                                  <table className="w-full text-sm">

                                                    {/* HEADER */}
                                                    <thead className="bg-gray-100 text-[10px] uppercase text-gray-600">
                                                      <tr>
                                                        <th className="px-2 py-3"></th>
                                                        <th className="px-2 py-3 text-left">Sub Activity</th>
                                                        <th className="px-2 py-3 text-center">Chainage</th>
                                                        <th className="px-2 py-3 text-center">Qty</th>
                                                        <th className="px-2 py-3 text-center">Area</th>
                                                        <th className="px-2 py-3 text-center">Status</th>
                                                        {
                                                          !isUser &&
                                                          <>
                                                            <th className="px-2 py-3 text-center">Stage</th>
                                                            <th className="px-2 py-3 text-center">%</th>
                                                            <th className="px-2 py-3 text-center">Amount ₹</th>
                                                            <th className="px-2 py-3 text-center">Raised</th>
                                                            <th className="px-2 py-3 text-center">Received</th>
                                                            <th className="px-2 py-3 text-center">Remaining</th>
                                                            <th className="px-2 py-3 text-center">Status</th>
                                                          </>
                                                        }
                                                        {
                                                          isUser &&
                                                          <th className="px-2 py-3 text-right">Action</th>
                                                        }
                                                      </tr>
                                                    </thead>

                                                    {/* BODY */}
                                                    <tbody>
                                                      {subs.map((sub, i) => {
                                                        const submissionAmount =
                                                          (((project?.workorder_cost || 0) *
                                                            (sub?.submission_payment || 0)) /
                                                            100) * 1.18;

                                                        const approvalAmount =
                                                          (((project?.workorder_cost || 0) *
                                                            (sub?.approval_payment || 0)) /
                                                            100) * 1.18;

                                                        const subRaised = sub.submission_raised || 0;
                                                        const subReceived = sub.submission_received || 0;
                                                        const subRemaining = submissionAmount - subReceived;

                                                        const apprRaised = sub.approval_raised || 0;
                                                        const apprReceived = sub.approval_received || 0;
                                                        const apprRemaining = approvalAmount - apprReceived;
                                                        const changeStatus = (sub.status || "Pending");

                                                        const submissionStatus =
                                                          subReceived >= submissionAmount
                                                            ? "Completed"
                                                            : subRaised > 0
                                                              ? "Submitted"
                                                              : "Pending";

                                                        const approvalStatus =
                                                          apprReceived >= approvalAmount
                                                            ? "Completed"
                                                            : apprRaised > 0
                                                              ? "Submitted"
                                                              : "Pending";

                                                        return (
                                                          <>
                                                            {/* 🔵 SUBMISSION ROW */}
                                                            <tr
                                                              id={`subactivity-row-${sub.id}`}
                                                              className="border-t  text-[12px]"
                                                            >

                                                              <td rowSpan="2" className="px-2 text-center align-center">
                                                                {
                                                                  sub.work_summary?.users.length > 0 || worklogreturned
                                                                    ?.filter((d) => d.id == sub.id).length > 0 ? (
                                                                    <button
                                                                      onClick={() =>
                                                                        setExpandedRow(
                                                                          expandedRow === sub.id ? null : sub.id
                                                                        )
                                                                      }
                                                                    >
                                                                      {expandedRow === sub.id ? "−" : "+"}
                                                                    </button>
                                                                  ) : ""}
                                                              </td>


                                                              <td rowSpan="2" className="px-2 font-medium align-center">
                                                                {sub.subactivity_name}
                                                              </td>


                                                              <td rowSpan="2" className="text-center">{sub.chainage_start}</td>
                                                              <td rowSpan="2" className="text-center">{sub.total_quantity}</td>
                                                              <td rowSpan="2" className="text-center">{sub.covered_area}</td>
                                                              <td rowSpan="2" className="text-center">
                                                                <div className="relative inline-block p-2">
                                                                  <span className={`min-w-[80px] text-center appearance-none text-[11px] font-medium px-3 py-1 block rounded-full border
                                                                                                                                                ${changeStatus === "Inprogress" ? "bg-yellow-100 text-yellow-600 border-yellow-600" :
                                                                      changeStatus === "Submitted" ? "bg-green-100 text-green-600 border-green-200" :
                                                                        changeStatus === "Rejected" ? "bg-red-100 text-red-600 border-red-200" :
                                                                          changeStatus === "Approved" ? "bg-blue-100 text-blue-600 border-blue-200" :
                                                                            changeStatus === "Completed" ? "bg-purple-100 text-purple-600 border-purple-200" :
                                                                              "bg-gray-100 text-gray-600 border-gray-200"
                                                                    }`}>
                                                                    {changeStatus}
                                                                  </span>
                                                                </div>
                                                              </td>
                                                              {
                                                                !isUser &&
                                                                <>
                                                                  <td className="text-center font-semibold text-green-600 border-b border-gray-300 border-l">
                                                                    Submission
                                                                  </td>

                                                                  <td className="text-center text-green-600 border-b border-gray-300">
                                                                    {sub.submission_payment}%
                                                                  </td>

                                                                  <td className="text-center border-b border-gray-300">
                                                                    ₹ {submissionAmount.toFixed(2)} L
                                                                  </td>

                                                                  <td className="text-center border-b border-gray-300">{subRaised}</td>
                                                                  <td className="text-center border-b border-gray-300">{subReceived}</td>
                                                                  <td className="text-center text-red-500 border-b border-gray-300">
                                                                    {subRemaining.toFixed(2)} L
                                                                  </td>

                                                                  <td className="text-center border-b border-gray-300 p-2">
                                                                    <select
                                                                      value={submissionStatus}
                                                                      onChange={(e) =>
                                                                        handleSubmissionStatus(sub, e.target.value)
                                                                      }
                                                                      className="text-xs border m-1 rounded bg-white"
                                                                    >
                                                                      <option>Pending</option>
                                                                      <option>Submitted</option>
                                                                      <option>Completed</option>
                                                                    </select>
                                                                  </td>
                                                                </>
                                                              }
                                                              {
                                                                isUser &&
                                                                <td rowSpan="2" className="text-right px-2 py-2">
                                                                  <button className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full "
                                                                    onClick={() => {
                                                                      setSelectedTaskfortimelog({
                                                                        id: sub.id,
                                                                        project_id: project.id || project.project_id,
                                                                        subactivity_name: sub.subactivity_name,
                                                                        project_name:
                                                                          project.shortName || project.short_name,
                                                                      });

                                                                      setTimeLogData({
                                                                        date: new Date()
                                                                          .toISOString()
                                                                          .split("T")[0],
                                                                        startTime: "",
                                                                        endTime: "",
                                                                        description: "",
                                                                      });

                                                                      setShowTimeLogModal(true);
                                                                    }}>
                                                                    <span className='flex flex-row '>
                                                                      <PlusCircle size={16} />
                                                                      Work Log
                                                                    </span>
                                                                  </button>
                                                                </td>
                                                              }
                                                            </tr>

                                                            {/* 🟢 APPROVAL ROW */}
                                                            {
                                                              !isUser &&
                                                                sub.approval_payment > 0 ? (
                                                                <tr className=" text-[12px] border-b">
                                                                  <td className="text-center font-semibold text-blue-600 border-l border-gray-300">
                                                                    Approval
                                                                  </td>

                                                                  <td className="text-center text-blue-600">
                                                                    {sub.approval_payment}%
                                                                  </td>

                                                                  <td className="text-center">
                                                                    ₹ {approvalAmount.toFixed(2)} L
                                                                  </td>

                                                                  <td className="text-center">{apprRaised}</td>
                                                                  <td className="text-center">{apprReceived}</td>
                                                                  <td className="text-center text-red-500">
                                                                    {apprRemaining.toFixed(2)} L
                                                                  </td>

                                                                  <td className="text-center p-2">
                                                                    <select
                                                                      value={approvalStatus}
                                                                      // onChange={(e) =>
                                                                      //   handleApprovalStatus(sub, e.target.value)
                                                                      // }
                                                                      className="text-xs m-1 border rounded bg-white"
                                                                    >
                                                                      <option>Pending</option>
                                                                      <option>Submitted</option>
                                                                      <option>Completed</option>
                                                                    </select>
                                                                  </td>

                                                                  <td></td>
                                                                </tr>
                                                              ) : <tr>
                                                              </tr>}

                                                            {/* {
                                                              isUser &&
                                                              <tr>
                                                                <td></td>
                                                              </tr>
                                                            } */}


                                                            {/* 🔽 EXPAND ROW */}
                                                            {expandedRow === sub.id && (
                                                              <tr className="bg-gray-50">
                                                                <td colSpan="13" className="px-4 py-4">

                                                                  <div className="bg-white border rounded-xl shadow-sm p-4">

                                                                    {/* HEADER */}
                                                                    {/* <div className="flex items-center justify-between mb-3">
                                                                      <h4 className="text-sm font-semibold text-gray-700">
                                                                        Work Summary
                                                                      </h4>

                                                                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-600">
                                                                        {sub.work_done || 0}% Completed
                                                                      </span>
                                                                    </div>

                                                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                                                      <div
                                                                        className="bg-green-500 h-2 rounded-full"
                                                                        style={{ width: `${sub.work_done || 0}%` }}
                                                                      ></div>
                                                                    </div> */}

                                                                    {/* TIME LOG HEADER */}
                                                                    <div className="flex justify-between text-xs font-medium text-gray-500 border-b pb-2 mb-2">
                                                                      <span>User</span>
                                                                      <span>Time Spent</span>
                                                                    </div>

                                                                    {/* TIME LOG LIST */}
                                                                    <div className="max-h-40 overflow-y-auto space-y-1">
                                                                      {worklogreturned
                                                                        ?.filter((d) => d.id == sub.id)
                                                                        ?.map((log, i) => (

                                                                          <div
                                                                            key={i}
                                                                            className="flex justify-between items-center text-xs px-2 py-2 rounded-md hover:bg-gray-50 transition"
                                                                          >
                                                                            <div className="flex items-center gap-2">
                                                                              {/* Avatar */}
                                                                              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-[10px] font-semibold">
                                                                                {log.name?.charAt(0) || "U"}
                                                                              </div>

                                                                              <span className="text-gray-700">
                                                                                {log.name || "You"}
                                                                              </span>
                                                                            </div>

                                                                            <span className="font-medium text-blue-600">
                                                                              {calculateHours(
                                                                                log.startTime,
                                                                                log.endTime
                                                                              ).toFixed(2)}{" "}
                                                                              h
                                                                            </span>
                                                                          </div>
                                                                          // <div
                                                                          //   key={i}
                                                                          //   className="flex justify-between text-xs border-b pb-1"
                                                                          // >
                                                                          //   <span>Today</span>
                                                                          //   <span>
                                                                          //     {calculateHours(
                                                                          //       log.startTime,
                                                                          //       log.endTime
                                                                          //     ).toFixed(2)}{" "}
                                                                          //     h
                                                                          //   </span>
                                                                          // </div>
                                                                        ))}
                                                                      {sub.work_summary?.users?.length > 0 ? (
                                                                        sub.work_summary.users.map((log, i) => (
                                                                          <div
                                                                            key={i}
                                                                            className="flex justify-between items-center text-xs px-2 py-2 rounded-md hover:bg-gray-50 transition"
                                                                          >
                                                                            <div className="flex items-center gap-2">
                                                                              {/* Avatar */}
                                                                              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-[10px] font-semibold">
                                                                                {log.name?.charAt(0)}
                                                                              </div>

                                                                              <span className="text-gray-700">
                                                                                {log.name}
                                                                              </span>
                                                                            </div>

                                                                            <span className="font-medium text-blue-600">
                                                                              {log.total_time_spent} h
                                                                            </span>
                                                                          </div>
                                                                        ))
                                                                      ) : (
                                                                        worklogreturned
                                                                          ?.filter((d) => d.id == sub.id).length > 0 ? null :
                                                                          <p className="text-xs text-gray-400 text-center py-3">
                                                                            No work logs available
                                                                          </p>
                                                                      )}
                                                                    </div>

                                                                  </div>

                                                                </td>
                                                              </tr>
                                                            )}
                                                          </>
                                                        );
                                                      })}
                                                    </tbody>
                                                  </table>
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
