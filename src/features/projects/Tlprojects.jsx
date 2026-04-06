




import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
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
    CheckCircle
} from "lucide-react";
import { getProjectStatusInfo, getDaysUntilDeadline } from "../../utils/deadlineUtils";
import {
    fetchProjects,
    deleteProject,
    fetchCompanies,
    fetchSubCompanies,
    fetchSectors,
    fetchClients
} from "../api/apiSlice";
import { showSnackbar } from "../notifications/notificationSlice";
import TaskPicker from "../tasks/TaskPicker";
import LoadingModal from "../../components/modals/LoadingModal";

const TlProjectList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Get projects and user from Redux store
    const { projects = [], loading: apiLoading = false, companies = [], subCompanies = [], sectors = [], clients = [] } = useSelector((state) => state.api || {});
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
    const [loadingSubMessage, setLoadingSubMessage] = useState("Fetching your projects...");
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    // Create lookup maps for IDs to names
    const companyMap = useMemo(() => {
        const map = {};
        if (companies && Array.isArray(companies)) {
            companies.forEach(company => {
                if (company && company.id) map[company.id] = company.name;
            });
        }
        return map;
    }, [companies]);

    const subCompanyMap = useMemo(() => {
        const map = {};
        if (subCompanies && Array.isArray(subCompanies)) {
            subCompanies.forEach(sub => {
                if (sub && sub.id) map[sub.id] = sub.name;
            });
        }
        return map;
    }, [subCompanies]);

    const sectorMap = useMemo(() => {
        const map = {};
        if (sectors && Array.isArray(sectors)) {
            sectors.forEach(sector => {
                if (sector && sector.id) map[sector.id] = sector.name;
            });
        }
        return map;
    }, [sectors]);

    const clientMap = useMemo(() => {
        const map = {};
        if (clients && Array.isArray(clients)) {
            clients.forEach(client => {
                if (client && client.id) map[client.id] = client.name;
            });
        }
        return map;
    }, [clients]);

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
                    dispatch(fetchSubCompanies()).unwrap(),
                    dispatch(fetchSectors()).unwrap(),
                    dispatch(fetchClients()).unwrap(),
                    dispatch(fetchProjects()).unwrap()
                ]);
                console.log("All data loaded successfully");
            } catch (error) {
                console.error("Error loading data:", error);
                dispatch(showSnackbar({
                    message: "Failed to load data from server",
                    type: "warning"
                }));
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
                dispatch(fetchSubCompanies()).unwrap(),
                dispatch(fetchSectors()).unwrap(),
                dispatch(fetchClients()).unwrap(),
                dispatch(fetchProjects()).unwrap()
            ]);
            dispatch(showSnackbar({
                message: "Data refreshed successfully",
                type: "success"
            }));
        } catch (error) {
            dispatch(showSnackbar({
                message: "Failed to refresh data",
                type: "error"
            }));
        } finally {
            setRefreshing(false);
        }
    };

    const handleDeleteProject = async (projectId, projectName, e) => {
        e.stopPropagation();
        if (!window.confirm(`Are you sure you want to delete project "${projectName}"? This action cannot be undone.`)) {
            return;
        }
        setDeleteInProgress(true);
        setLoadingMessage("Deleting Project");
        setLoadingSubMessage(`Deleting ${projectName}...`);
        try {
            await dispatch(deleteProject(projectId)).unwrap();
            dispatch(showSnackbar({
                message: "Project deleted successfully",
                type: "success"
            }));
            await loadData();
        } catch (error) {
            dispatch(showSnackbar({
                message: error.message || "Failed to delete project",
                type: "error"
            }));
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
        setExpandedActivities(prev => ({
            ...prev,
            [activityId]: !prev[activityId]
        }));
    };

    // Role-based checks
    const isSuperAdmin = user?.role === "SUPER_ADMIN";
    const isAdmin = user?.role === "ADMIN" || isSuperAdmin;
    const isUser = user?.role === "USER";
    const TL = user?.role === "TL";

    // Helper functions
    const getCompanyName = (project) => {
        const companyId = project.company || project.company_id;
        if (companyMap[companyId]) return companyMap[companyId];
        if (project.company_detail?.name) return project.company_detail.name;
        return companyId || "—";
    };

    const getSubCompanyName = (project) => {
        const subCompanyId = project.sub_company || project.sub_company_id;
        if (subCompanyMap[subCompanyId]) return subCompanyMap[subCompanyId];
        if (project.sub_company_detail?.name) return project.sub_company_detail.name;
        return subCompanyId || "—";
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
        if (isSuperAdmin) return <Shield size={16} className="text-purple-600" />;
        if (isAdmin) return <UserCog size={16} className="text-blue-600" />;
        return <User size={16} className="text-green-600" />;
    };

    const getRoleDisplay = () => {
        if (isSuperAdmin) return "Super Admin";
        if (isAdmin) return "Admin";
        if (TL) return "TL"
        return "Employee";
    };
    console.log(projects, 'projetcs')
    // Filter and sort projects
    const filteredProjects = useMemo(() => {
        if (!projects || !Array.isArray(projects)) return [];
        let filtered = [...projects];
        console.log(filtered, 'filtered status')
        if (searchTerm) {
            filtered = filtered.filter(project => {
                const name = (project.project_name || project.name || "").toLowerCase();
                const code = (project.project_code || project.code || "").toLowerCase();
                const term = searchTerm.toLowerCase();
                return name.includes(term) || code.includes(term);
            });
        }
        if (filterStatus !== "all") {
            filtered = filtered.filter(project => {
                const projectStatus = project.status || "ONGOING";
                const progress = project.progress || 0;
                const daysLeft = getDaysUntilDeadline(project.completion_date || project.completionDate);
                if (filterStatus === "delayed") return (projectStatus === "DELAYED" || daysLeft < 0) && progress < 100;
                if (filterStatus === "critical") return daysLeft <= 2 && daysLeft >= 0 && progress < 100;
                if (filterStatus === "ongoing") return projectStatus === "ONGOING" && progress < 100;
                if (filterStatus === "completed") return progress === 100 || projectStatus === "COMPLETED";
                return true;
            });
        }
        filtered.sort((a, b) => {
            const aDays = getDaysUntilDeadline(a.completion_date || a.completionDate) || 999;
            const bDays = getDaysUntilDeadline(b.completion_date || b.completionDate) || 999;
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
            delayed: projects.filter(p => {
                const status = p.status || "ONGOING";
                const progress = p.progress || 0;
                const daysLeft = getDaysUntilDeadline(p.completion_date || p.completionDate);
                return (status === "DELAYED" || daysLeft < 0) && progress < 100;
            }).length,
            critical: projects.filter(p => {
                const progress = p.progress || 0;
                const daysLeft = getDaysUntilDeadline(p.completion_date || p.completionDate);
                return daysLeft <= 2 && daysLeft >= 0 && progress < 100;
            }).length,
            completed: projects.filter(p => (p.progress || 0) === 100 || (p.status || "ONGOING") === "COMPLETED").length,
            ongoing: projects.filter(p => {
                const progress = p.progress || 0;
                return progress > 0 && progress < 100;
            }).length
        };
    }, [projects]);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch { return "N/A"; }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", damping: 15, stiffness: 100 }
        }
    };

    const handleRefresh = () => loadData();

    const getProjectId = (project) => project.id || project.project_id;
    const getProjectName = (project) => project.project_name || project.name || "Unnamed Project";
    const getProjectCode = (project) => project.project_code || project.code || "N/A";
    const getCompletionDate = (project) => project.completion_date || project.completionDate || project.deadline;
    const getActualCompletionDate = (project) => project.actual_completion_date || project.completed_at || project.updated_at;
    const getProgress = (project) => project.progress || 0;
    const getLocation = (project) => project.location || "No location specified";
    const getCost = (project) => project.workorder_cost || project.cost || 0;
    const getTotalLength = (project) => project.total_length || project.totalLength || 0;
    const getLoaDate = (project) => project.loa_date || project.loaDate;
    const getDirectorProposalDate = (project) => project.director_proposal_date || project.directorProposalDate;
    const getProjectConfirmationDate = (project) => project.project_confirmation_date || project.projectConfirmationDate;
    const getActivities = (project) => project.activities_detail || project.activities || [];

    const handleProjectNavigation = (projectId, e) => {
        if (e) e.stopPropagation();
        if (isUser) {
            navigate(`/my-projects/${projectId}`);
        } else {
            navigate(`/projects/${projectId}`);
        }
    };

    const showLoading = isInitialLoading || refreshing || deleteInProgress;

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
                                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${isSuperAdmin ? "bg-purple-100 text-purple-600" :
                                        isAdmin ? "bg-blue-100 text-blue-600" :
                                            "bg-green-100 text-green-600"
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
                            <RefreshCw size={20} className={`text-blue-600 ${refreshing ? 'animate-spin' : ''}`} />
                            <span className="text-sm font-medium text-gray-700">Refresh</span>
                        </motion.button>
                    </div>



                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100"
                    >
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
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
                                <Filter className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={20} />
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
                                <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={20} />
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
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100">
                                <FolderOpen size={64} className="mx-auto mb-4 text-gray-300" />
                                <p className="text-2xl font-semibold text-gray-700 mb-2">No projects found</p>
                                {isAdmin && (
                                    <button onClick={() => navigate("/projects/create")} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-xl transition-all inline-flex items-center gap-2 text-lg">
                                        <Plus size={24} /> Create New Project
                                    </button>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-6">
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

                                    const statusInfo = getProjectStatusInfo({
                                        status: project.status || "ONGOING",
                                        completionDate: completionDate,
                                        progress: progress
                                    });

                                    const isExpanded = expandedCard === projectId;

                                    return (
                                        <motion.div
                                            key={projectId}
                                            variants={itemVariants}
                                            layout
                                            className={`bg-white rounded-3xl shadow-xl border-2 transition-all duration-300 relative group
                        ${isCompleted ? "border-green-200 hover:border-green-300" :
                                                    statusInfo.status === "DELAYED" ? "border-red-200 hover:border-red-300" :
                                                        statusInfo.status === "DUE_TODAY" ? "border-orange-200 hover:border-orange-300" :
                                                            statusInfo.status === "CRITICAL" ? "border-yellow-200 hover:border-yellow-300" :
                                                                "border-gray-100 hover:border-blue-200"}`}
                                        >
                                            {isAdmin && (
                                                <button
                                                    onClick={(e) => handleDeleteProject(projectId, projectName, e)}
                                                    disabled={deleteInProgress}
                                                    className="absolute top-4 right-4 z-10 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all hover:scale-110"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}

                                            <div className="p-6 cursor-pointer" onClick={() => handleProjectNavigation(projectId)}>
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                            <h3 className="text-2xl font-bold text-gray-800">{projectName}</h3>
                                                            <motion.span
                                                                whileHover={{ scale: 1.05 }}
                                                                className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1
                                  ${isCompleted ? "bg-green-100 text-green-700" :
                                                                        statusInfo.colors.bg} ${isCompleted ? "bg-green-100" : statusInfo.colors.text}`}
                                                            >
                                                                <span>{isCompleted ? <CheckCircle size={14} /> : statusInfo.icon}</span>
                                                                {isCompleted ? "Completed" : statusInfo.label}
                                                            </motion.span>
                                                            <span className="text-sm text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
                                                                {projectCode}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-500 mb-4 line-clamp-2">{location}</p>

                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="p-2 bg-blue-50 rounded-lg"><Calendar size={16} className="text-blue-600" /></div>
                                                                <div><p className="text-xs text-gray-500">Start Date</p><p className="text-sm font-semibold">{formatDate(getLoaDate(project))}</p></div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <div className={`p-2 rounded-lg ${isCompleted ? "bg-green-50" : daysLeft < 0 ? "bg-red-50" : daysLeft <= 2 ? "bg-orange-50" : "bg-green-50"}`}><Clock size={16} className={isCompleted ? "text-green-600" : daysLeft < 0 ? "text-red-600" : "text-green-600"} /></div>
                                                                <div><p className="text-xs text-gray-500">{isCompleted ? "Completed On" : "Deadline"}</p><p className="text-sm font-semibold">{isCompleted ? formatDate(actualCompletionDate) : formatDate(completionDate)}</p></div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <div className={`p-2 rounded-lg ${isCompleted ? "bg-green-50" : "bg-purple-50"}`}><TrendingUp size={16} className={isCompleted ? "text-green-600" : "text-purple-600"} /></div>
                                                                <div><p className="text-xs text-gray-500">Status</p><p className="text-sm font-semibold">{progress === 100 ? "Completed" : progress > 0 ? "Ongoing" : "Pending"}</p></div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <div className="p-2 bg-indigo-50 rounded-lg"><BarChart3 size={16} className="text-indigo-600" /></div>
                                                                <div><p className="text-xs text-gray-500">Activities</p><p className="text-sm font-semibold">{activities.length}</p></div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={(e) => { e.stopPropagation(); handleProjectNavigation(projectId); }}
                                                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                                                        >
                                                            <Eye size={18} /> View Details
                                                        </motion.button>
                                                        <button onClick={(e) => { e.stopPropagation(); setExpandedCard(isExpanded ? null : projectId); }} className="p-3 hover:bg-gray-100 rounded-xl transition-colors">
                                                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Progress Bar - Only visible for Admin */}
                                                {isAdmin && (
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="font-medium text-gray-600">Overall Progress</span>
                                                            <span className={`font-bold ${isCompleted ? "text-green-600" : "text-blue-600"}`}>{progress}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                                            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1 }} className={`h-3 rounded-full ${isCompleted ? "bg-green-500" : `bg-gradient-to-r ${statusInfo.colors.gradient}`}`} />
                                                        </div>
                                                    </div>
                                                )}

                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-6 pt-6 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                                                            <div className="grid md:grid-cols-2 gap-6">
                                                                <div>
                                                                    <h4 className="font-semibold mb-3 text-gray-700">Project Details</h4>
                                                                    <div className="space-y-2">
                                                                        <p className="text-sm"><span className="text-gray-500">Company:</span> {getCompanyName(project)}</p>
                                                                        <p className="text-sm"><span className="text-gray-500">Sub Company:</span> {getSubCompanyName(project)}</p>
                                                                        <p className="text-sm"><span className="text-gray-500">Sector:</span> {getSectorName(project)}</p>
                                                                        <p className="text-sm"><span className="text-gray-500">Client:</span> {getClientName(project)}</p>
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

                                                            {activities.length > 0 && (
                                                                <div className="mt-6">
                                                                    <h4 className="font-semibold mb-3 text-gray-700">Activities & Tasks</h4>
                                                                    <div className="space-y-3">
                                                                        {activities.slice(0, 3).map((activity) => {
                                                                            const subs = activity.subactivities || [];
                                                                            const isActivityExpanded = expandedActivities[activity.id];
                                                                            return (
                                                                                <div key={activity.id} className="bg-gray-50 p-3 rounded-xl">
                                                                                    <div className="flex items-center justify-between cursor-pointer" onClick={(e) => toggleActivity(activity.id, e)}>
                                                                                        <div>
                                                                                            <h5 className="font-medium text-gray-800">{activity.activity_name}</h5>
                                                                                            <p className="text-xs text-gray-500 mt-1">{subs.length} tasks</p>
                                                                                        </div>
                                                                                        <button className="p-1 hover:bg-white rounded">{isActivityExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
                                                                                    </div>
                                                                                    <AnimatePresence>
                                                                                        {isActivityExpanded && (
                                                                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-3 space-y-2">
                                                                                                {subs.map((sub) => {
                                                                                                    const isSubCompleted = sub.is_completed || sub.status === "Complete";
                                                                                                    const pickedStatus = sub.picked_at?.length > 0;
                                                                                                    const isPickedByMe = pickedStatus && sub.picked_at.some(p => p.emp_code === user?.id);
                                                                                                    return (
                                                                                                        <div key={sub.id} className="bg-white p-3 rounded-lg flex items-center justify-between">
                                                                                                            <div className="flex-1">
                                                                                                                <div className="flex items-center gap-2">
                                                                                                                    <p className="text-sm font-medium">{sub.subactivity_name}</p>
                                                                                                                    {isSubCompleted && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-600">Completed</span>}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            {!isSubCompleted && !pickedStatus && isUser && (
                                                                                                                <button onClick={(e) => handlePickTask(project, activity, sub, e)} className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                                                                                                                    <Briefcase size={16} />
                                                                                                                </button>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    );
                                                                                                })}
                                                                                            </motion.div>
                                                                                        )}
                                                                                    </AnimatePresence>
                                                                                </div>
                                                                            );
                                                                        })}
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

export default TlProjectList;