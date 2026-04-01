import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useMemo } from "react";
import { 
  updateSubActivityProgressLocally,
  updateSubActivityStatusLocally,
  addSubActivity,
  deleteActivity,
  deleteSubActivity,
  extendActivityDeadline,
  extendSubActivityDeadline
} from "./projectSlice";
import { showSnackbar } from "../notifications/notificationSlice";
import ActivityExtensionModal from "./ActivityExtensionModal";
import { 
  fetchProjects, 
  fetchCompanies,
  fetchSubCompanies,
  fetchSectors,
  fetchClients,
  fetchActivities,
  fetchSubActivities,
  updateSubActivityProgress as updateSubActivityProgressApi,
  updateSubActivityStatus as updateSubActivityStatusApi,
  updateActivityProgress,
  updateProjectProgress
} from "../api/apiSlice";
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
  PenLine,
  Save,
  Plus,
  Trash2,
  ArrowLeft,
  FileText,
  Info,
  Users,
  UserCheck,
  Eye
} from "lucide-react";
import LoadingModal from "../../components/modals/LoadingModal";



const mapStatusToBackend = (status, unit) => {
  const statusMap = {
    "PENDING": "Pending",
    "ONGOING": "Inprogress",
    "COMPLETED": "Complete",
    "DELAYED": "Inprogress",
    "HOLD": "OnHold"
  };
  return statusMap[status] || "Pending";
};

const mapStatusToFrontend = (backendStatus) => {
  const reverseMap = {
    "Pending": "PENDING",
    "Inprogress": "ONGOING",
    "Complete": "COMPLETED",
    "OnHold": "HOLD"
  };
  return reverseMap[backendStatus] || "PENDING";
};

const mapUnitToBackend = (unit) => {
  const unitMap = {
    'Km': 'Kilometer',
    'Nos.': 'Numbers',
    'Percentage': 'Percentage',
    'status': 'Percentage'
  };
  return unitMap[unit] || 'Kilometer';
};

const mapUnitToFrontend = (backendUnit) => {
  const reverseMap = {
    'Kilometer': 'Km',
    'Numbers': 'Nos.',
    'Percentage': 'Percentage'
  };
  return reverseMap[backendUnit] || backendUnit;
};

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

const getProgressFromStatus = (status) => {
  const statusProgress = {
    "PENDING": 0,
    "ONGOING": 50,
    "COMPLETED": 100,
    "DELAYED": 25,
    "HOLD": 10
  };
  return statusProgress[status] || 0;
};

const calculateActivityProgress = (subActivities) => {
  if (!subActivities || subActivities.length === 0) return 0;
  const total = subActivities.reduce((sum, sub) => sum + (sub.progress || 0), 0);
  return Math.round((total / subActivities.length) * 10) / 10;
};

const calculateProjectProgress = (activities) => {
  if (!activities || activities.length === 0) return 0;
  const total = activities.reduce((sum, a) => sum + (a.progress || 0), 0);
  return Math.round((total / activities.length) * 10) / 10;
};

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { projects: apiProjects = [], loading: apiLoading } = useSelector((state) => state.api);
  const { projects: localProjects = [] } = useSelector((state) => state.projects);
  
  const { 
    companies = [], 
    subCompanies = [], 
    sectors = [], 
    clients = [], 
    activities = [],
    subActivities = [] 
  } = useSelector((state) => state.api);

  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  
  
  const [companyMap, setCompanyMap] = useState({});
  const [subCompanyMap, setSubCompanyMap] = useState({});
  const [sectorMap, setSectorMap] = useState({});
  const [clientMap, setClientMap] = useState({});
  
  
  const [project, setProject] = useState(null);
  const [projectActivities, setProjectActivities] = useState([]);
  
  
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading Project");
  const [loadingSubMessage, setLoadingSubMessage] = useState("Fetching project details...");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  
  const [expandedActivities, setExpandedActivities] = useState({});
  const [editingSubActivity, setEditingSubActivity] = useState(null);
  const [editValue, setEditValue] = useState(0);
  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [selectedActivityForSub, setSelectedActivityForSub] = useState(null);
  const [showActivityExtensionModal, setShowActivityExtensionModal] = useState(false);
  const [selectedActivityForExtension, setSelectedActivityForExtension] = useState(null);
  const [showSubActivityExtensionModal, setShowSubActivityExtensionModal] = useState(false);
  const [selectedSubActivityForExtension, setSelectedSubActivityForExtension] = useState(null);
  const [newSubActivity, setNewSubActivity] = useState({
    name: "",
    unit: "Km",
    plannedQty: 0
  });

  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    window.addEventListener('resize', debounce(handleResize, 250));
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      setLoadingMessage("Loading Project");
      setLoadingSubMessage("Fetching project details...");
      
      try {
        console.log("Loading all project data in parallel...");
        
        
        await Promise.all([
          dispatch(fetchProjects()).unwrap(),
          dispatch(fetchCompanies()).unwrap(),
          dispatch(fetchSubCompanies()).unwrap(),
          dispatch(fetchSectors()).unwrap(),
          dispatch(fetchClients()).unwrap(),
          dispatch(fetchActivities()).unwrap(),
          dispatch(fetchSubActivities()).unwrap()
        ]);
        
        console.log("All data loaded successfully");
      } catch (error) {
        console.error("Error loading data:", error);
        dispatch(showSnackbar({
          message: "Failed to load project data",
          type: "error"
        }));
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, [dispatch]);

  
  useEffect(() => {
    if (companies.length > 0) {
      const map = {};
      companies.forEach(company => { 
        if (company && company.id) map[company.id] = company.name; 
      });
      setCompanyMap(map);
    }
  }, [companies]);

  useEffect(() => {
    if (subCompanies.length > 0) {
      const map = {};
      subCompanies.forEach(sub => { 
        if (sub && sub.id) map[sub.id] = sub.name; 
      });
      setSubCompanyMap(map);
    }
  }, [subCompanies]);

  useEffect(() => {
    if (sectors.length > 0) {
      const map = {};
      sectors.forEach(sector => { 
        if (sector && sector.id) map[sector.id] = sector.name; 
      });
      setSectorMap(map);
    }
  }, [sectors]);

  useEffect(() => {
    if (clients.length > 0) {
      const map = {};
      clients.forEach(client => { 
        if (client && client.id) map[client.id] = client.name; 
      });
      setClientMap(map);
    }
  }, [clients]);

  
  useEffect(() => {
    let foundProject = apiProjects.find(p => p.id === id || p.project_id === id);
    if (!foundProject) {
      foundProject = localProjects.find(p => p.id === id || p.project_id === id);
    }
    if (foundProject) {
      console.log("Project found:", foundProject);
      setProject(foundProject);
    }
  }, [id, apiProjects, localProjects]);

  
  useEffect(() => {
    if (!project) return;
    
    let activitiesList = [];
    
    if (project.activities && Array.isArray(project.activities)) {
      if (project.activities.length > 0) {
        if (typeof project.activities[0] === 'string') {
          
          activitiesList = project.activities
            .map(id => activities.find(act => act.id === id))
            .filter(act => act !== undefined)
            .map(act => ({
              ...act,
              subactivities: act.subactivities?.map(sub => ({
                ...sub,
                status_display: mapStatusToFrontend(sub.status),
                unit_display: mapUnitToFrontend(sub.unit),
                progress: sub.progress || (sub.status === "Complete" ? 100 : 
                         sub.status === "Inprogress" ? 50 : 
                         sub.status === "Pending" ? 0 : sub.progress || 0)
              }))
            }));
        } else if (typeof project.activities[0] === 'object') {
          
          activitiesList = project.activities.map(act => ({
            ...act,
            subactivities: act.subactivities?.map(sub => ({
              ...sub,
              status_display: mapStatusToFrontend(sub.status),
              unit_display: mapUnitToFrontend(sub.unit),
              progress: sub.progress || (sub.status === "Complete" ? 100 : 
                       sub.status === "Inprogress" ? 50 : 
                       sub.status === "Pending" ? 0 : sub.progress || 0)
            }))
          }));
        }
      }
    }
    
    setProjectActivities(activitiesList);
  }, [project, activities]);

  
  const projectStats = useMemo(() => {
    const allUsers = new Map();
    let totalSubs = 0;
    let completedSubs = 0;
    
    projectActivities.forEach(activity => {
      const subs = activity.subactivities || [];
      totalSubs += subs.length;
      
      subs.forEach(sub => {
        if (sub.progress === 100) completedSubs++;
        
        if (sub.picked_at && sub.picked_at.length > 0) {
          sub.picked_at.forEach(pick => {
            if (!allUsers.has(pick.emp_code)) {
              allUsers.set(pick.emp_code, {
                emp_code: pick.emp_code,
                emp_name: pick.emp_name,
                tasks: [],
                completedTasks: 0
              });
            }
            const userData = allUsers.get(pick.emp_code);
            userData.tasks.push({
              subName: sub.subactivity_name,
              activityName: activity.activity_name,
              progress: sub.progress,
              status: pick.status
            });
            if (pick.status === 'COMPLETED') userData.completedTasks++;
          });
        }
      });
    });
    
    return {
      totalUsers: allUsers.size,
      usersList: Array.from(allUsers.values()),
      totalSubActivities: totalSubs,
      completedSubActivities: completedSubs,
      completionRate: totalSubs > 0 ? (completedSubs / totalSubs * 100).toFixed(1) : 0
    };
  }, [projectActivities]);

  const projectProgress = useMemo(() => {
    return calculateProjectProgress(projectActivities);
  }, [projectActivities]);

  const totalSubActivities = useMemo(() => {
    return projectActivities.reduce((acc, act) => acc + (act.subactivities?.length || 0), 0);
  }, [projectActivities]);

  
  const getProjectId = useCallback(() => project?.id || project?.project_id, [project]);
  const getProjectName = useCallback(() => project?.name || project?.project_name || "Unnamed Project", [project]);
  const getProjectCode = useCallback(() => project?.code || project?.project_code || "N/A", [project]);
  const getProjectShortName = useCallback(() => project?.shortName || project?.short_name || "—", [project]);
  
  const getProjectCompany = useCallback(() => {
    const companyId = project?.company || project?.company_id;
    if (!companyId) return "—";
    if (typeof companyId === 'string' && companyMap[companyId]) return companyMap[companyId];
    if (typeof companyId === 'object' && companyId?.name) return companyId.name;
    if (project?.company_detail?.name) return project.company_detail.name;
    return companyId;
  }, [project, companyMap]);

  const getProjectSubCompany = useCallback(() => {
    const subCompanyId = project?.sub_company || project?.sub_company_id;
    if (!subCompanyId) return "—";
    if (typeof subCompanyId === 'string' && subCompanyMap[subCompanyId]) return subCompanyMap[subCompanyId];
    if (typeof subCompanyId === 'object' && subCompanyId?.name) return subCompanyId.name;
    if (project?.sub_company_detail?.name) return project.sub_company_detail.name;
    return subCompanyId;
  }, [project, subCompanyMap]);

  const getProjectLocation = useCallback(() => project?.location || "—", [project]);
  const getProjectSector = useCallback(() => {
    const sectorId = project?.sector || project?.sector_id;
    if (!sectorId) return "—";
    if (typeof sectorId === 'string' && sectorMap[sectorId]) return sectorMap[sectorId];
    if (typeof sectorId === 'object' && sectorId?.name) return sectorId.name;
    if (project?.sector_detail?.name) return project.sector_detail.name;
    return sectorId;
  }, [project, sectorMap]);

  const getProjectClient = useCallback(() => {
    const clientId = project?.client || project?.client_id || project?.department;
    if (!clientId) return "—";
    if (typeof clientId === 'string' && clientMap[clientId]) return clientMap[clientId];
    if (typeof clientId === 'object' && clientId?.name) return clientId.name;
    if (project?.client_detail?.name) return project.client_detail.name;
    return clientId;
  }, [project, clientMap]);

  const getProjectTotalLength = useCallback(() => `${project?.total_length || project?.totalLength || 0} km`, [project]);
  const getProjectCost = useCallback(() => `₹ ${project?.cost || project?.workorder_cost || 0} Lakhs`, [project]);
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
  const getProjectCompletionDate = useCallback(() => project?.completion_date || project?.completionDate, [project]);
  const getProjectStatus = useCallback(() => mapStatusToFrontend(project?.status), [project]);
  const getProjectExtensionRequested = useCallback(() => project?.extensionRequested || false, [project]);
  const getProjectActivities = useCallback(() => projectActivities, [projectActivities]);

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

  const hasAccess = useMemo(() => {
    return user?.role === "SUPER_ADMIN" || 
           user?.role === "ADMIN" || 
           project?.assignedUsers?.includes(user?.id) ||
           project?.createdBy === user?.id;
  }, [user, project]);

  useEffect(() => {
    if (project && !hasAccess && user?.role === "USER") {
      dispatch(showSnackbar({
        message: "You don't have access to this project",
        type: "error"
      }));
      navigate("/dashboard");
    }
  }, [project, hasAccess, user, navigate, dispatch]);

  const toggleActivity = useCallback((activityId) => {
    setExpandedActivities(prev => ({
      ...prev,
      [activityId]: !prev[activityId]
    }));
  }, []);

  const handleProgressUpdate = async (activityId, subId, maxQty) => {
    if (editValue > maxQty) {
      dispatch(showSnackbar({
        message: `Completed quantity cannot exceed planned quantity (${maxQty})`,
        type: "error"
      }));
      return;
    }

    setIsSubmitting(true);
    setLoadingMessage("Updating Progress");
    setLoadingSubMessage("Please wait while we save your changes...");

    try {
      const activity = getProjectActivities().find(a => a.id === activityId);
      const subActivity = activity?.subactivities?.find(s => s.id === subId);
      
      if (!subActivity) throw new Error("Sub-activity not found");

      let progress = 0;
      if (subActivity.unit === "status") {
        progress = getProgressFromStatus(editValue);
      } else {
        progress = Math.round((editValue / maxQty) * 100);
      }
      
      const frontendStatus = progress === 100 ? "COMPLETED" : progress > 0 ? "ONGOING" : "PENDING";
      const backendStatus = mapStatusToBackend(frontendStatus, subActivity.unit);
      const backendUnit = mapUnitToBackend(subActivity.unit);
      
      const subUpdateData = {
        id: subId,
        subactivity_name: subActivity.subactivity_name || subActivity.name,
        unit: backendUnit,
        total_quantity: subActivity.unit === "status" ? 1 : maxQty,
        completed_quantity: subActivity.unit === "status" ? (progress === 100 ? maxQty : 0) : editValue,
        progress: progress,
        status: backendStatus,
        start_date: subActivity.start_date || subActivity.startDate,
        end_date: subActivity.end_date || subActivity.endDate,
        activity: activity.id,
        range: subActivity.unit === "status" ? "status" : null,
        is_completed: frontendStatus === "COMPLETED"
      };

      await dispatch(updateSubActivityProgressApi({
        subActivityId: subId,
        progressData: subUpdateData
      })).unwrap();

      const updatedSubs = activity.subactivities.map(sub => 
        sub.id === subId ? { ...sub, progress, status: frontendStatus, completed_quantity: editValue } : sub
      );
      
      const activityProgress = calculateActivityProgress(updatedSubs);
      
      if (activityProgress !== (activity.progress || 0)) {
        const activityBackendStatus = mapStatusToBackend(
          activityProgress === 100 ? "COMPLETED" : activityProgress > 0 ? "ONGOING" : "PENDING",
          "quantity"
        );
        
        await dispatch(updateActivityProgress({
          activityId: activity.id,
          progressData: {
            id: activity.id,
            activity_name: activity.activity_name || activity.name,
            progress: activityProgress,
            status: activityBackendStatus,
            start_date: activity.start_date || activity.startDate,
            end_date: activity.end_date || activity.endDate,
            weightage: activity.weightage || 0
          }
        })).unwrap();
      }

      const updatedActivities = getProjectActivities().map(a => 
        a.id === activity.id ? { ...a, progress: activityProgress } : a
      );
      
      const projectProgressVal = calculateProjectProgress(updatedActivities);
      const isProjectCompleted = updatedActivities.every(act => act.progress === 100);
      
      const completionDate = getProjectCompletionDate();
      let projectStatus = "ONGOING";
      if (isProjectCompleted) {
        projectStatus = "COMPLETED";
      } else if (projectProgressVal < 100 && completionDate && new Date(completionDate) < new Date()) {
        projectStatus = "DELAYED";
      }
      
      await dispatch(updateProjectProgress({
        projectId: getProjectId(),
        progressData: {
          id: getProjectId(),
          progress: projectProgressVal,
          status: mapStatusToBackend(projectStatus, "quantity")
        }
      })).unwrap();

      dispatch(updateSubActivityProgressLocally({
        projectId: getProjectId(),
        activityId,
        subId,
        completedQty: editValue,
        progress,
        status: frontendStatus
      }));

      // Refresh data to sync UI
      await Promise.all([
        dispatch(fetchActivities()),
        dispatch(fetchSubActivities()),
        dispatch(fetchProjects())
      ]);

      dispatch(showSnackbar({
        message: "Progress updated successfully",
        type: "success"
      }));
      
      setEditingSubActivity(null);
      setEditValue(0);
    } catch (error) {
      console.error("Error updating progress:", error);
      dispatch(showSnackbar({
        message: error.response?.data?.message || error.message || "Failed to update progress",
        type: "error"
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (activityId, subId, status) => {
    setIsSubmitting(true);
    setLoadingMessage("Updating Status");
    setLoadingSubMessage("Please wait while we update the status...");

    try {
      const activity = getProjectActivities().find(a => a.id === activityId);
      const subActivity = activity?.subactivities?.find(s => s.id === subId);
      
      if (!subActivity) throw new Error("Sub-activity not found");

      const progress = getProgressFromStatus(status);
      const backendStatus = mapStatusToBackend(status, subActivity.unit);
      const backendUnit = mapUnitToBackend(subActivity.unit);
      
      const updateData = {
        id: subId,
        subactivity_name: subActivity.subactivity_name || subActivity.name,
        unit: backendUnit,
        total_quantity: subActivity.total_quantity || subActivity.plannedQty || 0,
        completed_quantity: subActivity.completed_quantity || subActivity.completedQty || 0,
        progress: progress,
        status: backendStatus,
        start_date: subActivity.start_date || subActivity.startDate,
        end_date: subActivity.end_date || subActivity.endDate,
        activity: activity.id,
        range: subActivity.unit === "status" ? "status" : null,
        is_completed: status === "COMPLETED"
      };

      await dispatch(updateSubActivityStatusApi({
        subActivityId: subId,
        statusData: updateData
      })).unwrap();

      const updatedSubs = activity.subactivities.map(sub => 
        sub.id === subId ? { ...sub, progress, status } : sub
      );
      
      const activityProgress = calculateActivityProgress(updatedSubs);
      
      if (activityProgress !== (activity.progress || 0)) {
        const activityBackendStatus = mapStatusToBackend(
          activityProgress === 100 ? "COMPLETED" : activityProgress > 0 ? "ONGOING" : "PENDING",
          "quantity"
        );
        
        await dispatch(updateActivityProgress({
          activityId: activity.id,
          progressData: {
            id: activity.id,
            activity_name: activity.activity_name || activity.name,
            progress: activityProgress,
            status: activityBackendStatus,
            start_date: activity.start_date || activity.startDate,
            end_date: activity.end_date || activity.endDate,
            weightage: activity.weightage || 0
          }
        })).unwrap();
      }

      const updatedActivities = getProjectActivities().map(a => 
        a.id === activity.id ? { ...a, progress: activityProgress } : a
      );
      
      const projectProgressVal = calculateProjectProgress(updatedActivities);
      const isProjectCompleted = updatedActivities.every(act => act.progress === 100);
      
      const completionDate = getProjectCompletionDate();
      let projectStatus = "ONGOING";
      if (isProjectCompleted) {
        projectStatus = "COMPLETED";
      } else if (projectProgressVal < 100 && completionDate && new Date(completionDate) < new Date()) {
        projectStatus = "DELAYED";
      }
      
      await dispatch(updateProjectProgress({
        projectId: getProjectId(),
        progressData: {
          id: getProjectId(),
          progress: projectProgressVal,
          status: mapStatusToBackend(projectStatus, "quantity")
        }
      })).unwrap();

      dispatch(updateSubActivityStatusLocally({
        projectId: getProjectId(),
        activityId,
        subId,
        status,
        progress
      }));

      // Refresh data to sync UI
      await Promise.all([
        dispatch(fetchActivities()),
        dispatch(fetchSubActivities()),
        dispatch(fetchProjects())
      ]);

      dispatch(showSnackbar({
        message: `Status updated to ${status}`,
        type: "success"
      }));
    } catch (error) {
      console.error("Error updating status:", error);
      dispatch(showSnackbar({
        message: error.response?.data?.message || error.message || "Failed to update status",
        type: "error"
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSubActivity = (e) => {
    e.preventDefault();
    
    if (!newSubActivity.name.trim()) {
      alert("Please enter sub-activity name");
      return;
    }

    if (newSubActivity.unit !== "status" && (!newSubActivity.plannedQty || newSubActivity.plannedQty <= 0)) {
      alert("Please enter planned quantity");
      return;
    }

    const activity = getProjectActivities().find(a => a.id === selectedActivityForSub);
    
    dispatch(addSubActivity({
      projectId: getProjectId(),
      activityId: selectedActivityForSub,
      subActivity: {
        name: newSubActivity.name,
        unit: newSubActivity.unit,
        plannedQty: newSubActivity.unit !== "status" ? newSubActivity.plannedQty : 1,
        startDate: activity?.start_date || activity?.startDate,
        endDate: activity?.end_date || activity?.endDate
      }
    }));

    dispatch(showSnackbar({
      message: "Sub-activity added successfully",
      type: "success"
    }));

    setShowAddSubModal(false);
    setNewSubActivity({
      name: "",
      unit: "Km",
      plannedQty: 0
    });
  };

  const handleExtendActivity = (activityId, newDate, reason) => {
    dispatch(extendActivityDeadline({
      projectId: getProjectId(),
      activityId,
      newEndDate: newDate,
      reason,
      extendedBy: user?.name
    }));
    dispatch(showSnackbar({ message: "Activity deadline extended successfully", type: "success" }));
    setShowActivityExtensionModal(false);
    setSelectedActivityForExtension(null);
  };

  const handleExtendSubActivity = (activityId, subId, newDate, reason) => {
    dispatch(extendSubActivityDeadline({
      projectId: getProjectId(),
      activityId,
      subId,
      newEndDate: newDate,
      reason,
      extendedBy: user?.name
    }));
    dispatch(showSnackbar({ message: "Sub-activity deadline extended successfully", type: "success" }));
    setShowSubActivityExtensionModal(false);
    setSelectedSubActivityForExtension(null);
  };

  const handleDeleteActivity = (activityId, activityName) => {
    if (user?.role !== "SUPER_ADMIN") {
      dispatch(showSnackbar({ message: "Only Super Admin can delete activities", type: "error" }));
      return;
    }
    if (window.confirm(`Are you sure you want to delete activity "${activityName}"?`)) {
      dispatch(deleteActivity({ projectId: getProjectId(), activityId }));
      dispatch(showSnackbar({ message: "Activity deleted successfully", type: "success" }));
    }
  };

  const handleDeleteSubActivity = (activityId, subId, subName) => {
    if (user?.role !== "SUPER_ADMIN") {
      dispatch(showSnackbar({ message: "Only Super Admin can delete sub-activities", type: "error" }));
      return;
    }
    if (window.confirm(`Are you sure you want to delete sub-activity "${subName}"?`)) {
      dispatch(deleteSubActivity({ projectId: getProjectId(), activityId, subId }));
      dispatch(showSnackbar({ message: "Sub-activity deleted successfully", type: "success" }));
    }
  };

  const getStatusColor = (status) => {
    const frontendStatus = mapStatusToFrontend(status);
    switch(frontendStatus) {
      case "COMPLETED": return "bg-green-100 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400";
      case "ONGOING": return "bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400";
      case "DELAYED": return "bg-red-100 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400";
      case "HOLD": return "bg-yellow-100 text-yellow-600 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400";
      default: return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return "bg-green-500 dark:bg-green-600";
    if (progress >= 75) return "bg-blue-500 dark:bg-blue-600";
    if (progress >= 50) return "bg-yellow-500 dark:bg-yellow-600";
    if (progress >= 25) return "bg-orange-500 dark:bg-orange-600";
    return "bg-red-500 dark:bg-red-600";
  };

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

  const getDeadlineBadge = useCallback((endDate, isCompleted = false) => {
    if (isCompleted) return null;
    const days = calculateDaysLeft(endDate);
    if (days === null) return null;
    if (days < 0) return <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">Overdue</span>;
    if (days === 0) return <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">Due Today</span>;
    if (days <= 2) return <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full">{days} days left</span>;
    if (days <= 7) return <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full">{days} days left</span>;
    return <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">{days} days left</span>;
  }, [calculateDaysLeft]);

  // Show loading modal during initial load or submissions
  const showLoading = isLoading || isSubmitting;

  if (!isLoading && !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center px-4">
          <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 0.5 }}>
            <XCircle size={48} className="text-red-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Project not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Project ID: {id}</p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/projects")} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Back to Projects
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const remaining = 100 - projectProgress;
  const completionDate = getProjectCompletionDate();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Loading Modal - Single loading state for all operations */}
      <LoadingModal 
        isVisible={showLoading} 
        message={loadingMessage}
        submessage={loadingSubMessage}
      />

      {/* Activity Extension Modal */}
      <ActivityExtensionModal
        isOpen={showActivityExtensionModal}
        onClose={() => { setShowActivityExtensionModal(false); setSelectedActivityForExtension(null); }}
        onSubmit={({ newDate, reason }) => handleExtendActivity(selectedActivityForExtension, newDate, reason)}
        item={getProjectActivities().find(a => a.id === selectedActivityForExtension)}
        itemType="activity"
      />

      {/* Sub-Activity Extension Modal */}
      <ActivityExtensionModal
        isOpen={showSubActivityExtensionModal}
        onClose={() => { setShowSubActivityExtensionModal(false); setSelectedSubActivityForExtension(null); }}
        onSubmit={({ newDate, reason }) => { handleExtendSubActivity(selectedSubActivityForExtension.activityId, selectedSubActivityForExtension.subId, newDate, reason); }}
        item={{ name: selectedSubActivityForExtension?.subName, endDate: selectedSubActivityForExtension?.endDate, parentActivity: selectedSubActivityForExtension?.activityName }}
        itemType="subactivity"
      />

      {/* Add Sub-Activity Modal */}
      <AnimatePresence>
        {showAddSubModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddSubModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleAddSubActivity}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Add Sub-Activity</h3>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} type="button" onClick={() => setShowAddSubModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <XCircle size={20} className="text-gray-500 dark:text-gray-400" />
                  </motion.button>
                </div>
                <div className="space-y-4">
                  <input type="text" placeholder="Sub-activity name" value={newSubActivity.name} onChange={(e) => setNewSubActivity({...newSubActivity, name: e.target.value})} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all" required />
                  <select value={newSubActivity.unit} onChange={(e) => setNewSubActivity({...newSubActivity, unit: e.target.value})} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all">
                    <option value="Km">Kilometer (Km) - Track by distance</option>
                    <option value="Nos.">Numbers (Nos.) - Track by count</option>
                    <option value="Percentage">Percentage (%) - Track by completion %</option>
                    <option value="status">Status Based - Track by status</option>
                  </select>
                  {newSubActivity.unit === "Percentage" ? (
                    <div className="space-y-2">
                      <input type="number" placeholder="Target percentage (e.g., 100)" value={newSubActivity.plannedQty} onChange={(e) => setNewSubActivity({...newSubActivity, plannedQty: parseFloat(e.target.value)})} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" min="0" max="100" step="1" required />
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><Info size={12} /> Progress will be tracked as percentage complete.</p>
                    </div>
                  ) : newSubActivity.unit !== "status" ? (
                    <input type="number" placeholder="Planned quantity" value={newSubActivity.plannedQty} onChange={(e) => setNewSubActivity({...newSubActivity, plannedQty: parseFloat(e.target.value)})} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" min="0" step="0.01" required />
                  ) : (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
                      <Info size={16} /> Status-based tracking - No quantity needed.
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
                  <button type="button" onClick={() => setShowAddSubModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">Cancel</button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Add Sub-Activity</motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content - Only show when not loading */}
      {!isLoading && (
        <>
          {/* Header */}
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8">
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <motion.button whileHover={{ scale: 1.1, x: -5 }} whileTap={{ scale: 0.9 }} onClick={() => navigate("/projects")} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors">
                  <ArrowLeft size={isMobile ? 18 : 20} className="text-gray-600 dark:text-gray-400" />
                </motion.button>
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white line-clamp-1">{getProjectName()}</h1>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Code: {getProjectCode()} | Short Name: {getProjectShortName()}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate(`/projects/${id}/logs`)} className="flex-1 sm:flex-none bg-gray-800 dark:bg-gray-700 text-white px-3 sm:px-4 py-2 rounded-xl hover:bg-gray-900 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2 text-sm">
                  <FileText size={16} /> <span className="hidden sm:inline">View Logs</span>
                </motion.button>
                {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN" || project?.assignedUsers?.includes(user?.id)) && (
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate(`/projects/${id}/extend`)} className="flex-1 sm:flex-none bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-sm">
                    <Calendar size={16} /> <span className="hidden sm:inline">Extend Deadline</span>
                  </motion.button>
                )}
              </div>
            </motion.div>

            {/* Status Banner */}
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${getProjectStatus() === "DELAYED" ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800" : getProjectStatus() === "COMPLETED" ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"}`}>
              <div className="flex items-center gap-2 sm:gap-3">
                {getProjectStatus() === "DELAYED" ? <AlertCircle className="text-red-600 dark:text-red-400" size={isMobile ? 20 : 24} /> : getProjectStatus() === "COMPLETED" ? <CheckCircle2 className="text-green-600 dark:text-green-400" size={isMobile ? 20 : 24} /> : <Clock className="text-blue-600 dark:text-blue-400" size={isMobile ? 20 : 24} />}
                <div>
                  <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">Project Status: <span className={getProjectStatus() === "DELAYED" ? "text-red-600 dark:text-red-400" : getProjectStatus() === "COMPLETED" ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"}>{getProjectStatus()}</span></p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{getProjectStatus() === "COMPLETED" ? "Project completed successfully" : getProjectStatus() === "DELAYED" ? "Project is overdue" : "Project is on track"}</p>
                </div>
              </div>
              <div className="text-right w-full sm:w-auto">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{getProjectStatus() === "COMPLETED" ? "Completion Date" : "Deadline"}</p>
                <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">{formatDate(completionDate)}</p>
                {getProjectStatus() !== "COMPLETED" && getDeadlineBadge(completionDate)}
              </div>
            </motion.div>

            
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} whileHover={{ scale: 1.01 }} className="bg-white dark:bg-gray-800 shadow-lg sm:shadow-2xl rounded-xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <Building2 size={isMobile ? 18 : 20} className="text-blue-600 dark:text-blue-400" /> Project Details
                  </h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <DetailItem label="Company" value={getProjectCompany()} />
                    {/* <DetailItem label="Sub Company" value={getProjectSubCompany()} /> */}
                    <DetailItem label="Location" value={getProjectLocation()} icon={<MapPin size={12} />} />
                    <DetailItem label="Sector" value={getProjectSector()} />
                    <DetailItem label="Client" value={getProjectClient()} />
                    <DetailItem label="Total Length" value={getProjectTotalLength()} icon={<Ruler size={12} />} />
                    <DetailItem label="Workorder Cost" value={getProjectCost()} icon={<IndianRupee size={12} />} />
                    <DetailItem label="LOA Date" value={getProjectLoaDate()} icon={<Calendar size={12} />} />
                  </div>
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-sm sm:text-base text-gray-800 dark:text-white mb-2 sm:mb-3">Key Milestones</h4>
                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                      <DetailItem label="Director Proposal" value={getProjectDirectorProposalDate()} />
                      <DetailItem label="Project Confirmation" value={getProjectConfirmationDate()} />
                    </div>
                  </div>
                </div>
                <div className="lg:border-l border-gray-200 dark:border-gray-700 lg:pl-6 sm:pl-0 lg:pl-8">
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Progress Overview</h4>
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <div className="flex justify-between text-xs sm:text-sm mb-2"><span className="font-medium text-gray-700 dark:text-gray-300">Overall Progress</span><span className="text-blue-600 dark:text-blue-400 font-bold">{projectProgress}%</span></div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 sm:h-4 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${projectProgress}%` }} transition={{ delay: 0.7, duration: 1, ease: "easeOut" }} className={`h-full rounded-full ${getProgressColor(projectProgress)}`} /></div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1"><span>{projectProgress}% Completed</span><span>{remaining}% Remaining</span></div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                      <StatCard label="Total Activities" value={getProjectActivities().length} />
                      <StatCard label="Total Tasks" value={totalSubActivities} />
                      <StatCard label="Team Members" value={projectStats.totalUsers} icon={<Users size={14} />} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(getProjectStatus())}`}>{getProjectStatus()}</span>
                      {getProjectExtensionRequested() && <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">Extension Requested</span>}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            
            {projectStats.totalUsers > 0 && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.0 }} className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Users size={isMobile ? 18 : 20} className="text-blue-600 dark:text-blue-400" />
                  Team Members ({projectStats.totalUsers})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projectStats.usersList.map((member, idx) => (
                    <motion.div key={member.emp_code} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.1 + idx * 0.05 }} whileHover={{ scale: 1.02 }} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center"><UserCheck size={20} className="text-blue-600 dark:text-blue-400" /></div>
                        <div><p className="font-medium text-gray-800 dark:text-white">{member.emp_name}</p><p className="text-xs text-gray-500 dark:text-gray-400">ID: {member.emp_code}</p></div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">Assigned Tasks:</span><span className="font-semibold">{member.tasks.length}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Completed:</span><span className="font-semibold text-green-600">{member.completedTasks}</span></div>
                        <button className="mt-2 text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"><Eye size={12} /> View Tasks</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

          
            <div className="space-y-4 sm:space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <ClipboardList size={isMobile ? 20 : 24} className="text-blue-600 dark:text-blue-400" />
                  Activities & Sub-Activities
                </h3>
                {getProjectActivities().length === 0 && <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">No activities found</p>}
              </div>

              {getProjectActivities().length > 0 ? (
                getProjectActivities().map((activity, index) => {
                  if (!activity || !activity.id) return null;
                  const isExpanded = expandedActivities[activity.id];
                  const activityProgress = activity.progress || 0;
                  const isActivityCompleted = activityProgress === 100;
                  const daysLeft = calculateDaysLeft(activity.end_date || activity.endDate);
                  const subActivities = activity.subactivities || [];

                  return (
                    <motion.div key={activity.id} layout initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.1 + index * 0.1 }} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                      <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-full">{activity.activity_name || activity.name}</h4>
                              <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${isActivityCompleted ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400" : daysLeft < 0 ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400" : "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"}`}>
                                {isActivityCompleted ? "Completed" : daysLeft < 0 ? "Delayed" : "Ongoing"}
                              </span>
                              {activity.weightage && <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 rounded-full">{activity.weightage}%</span>}
                              <div className="flex items-center gap-1 ml-auto sm:ml-0">
                                {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
                                  <button onClick={() => { setSelectedActivityForExtension(activity.id); setShowActivityExtensionModal(true); }} className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Extend deadline"><Calendar size={isMobile ? 14 : 16} /></button>
                                )}
                                {user?.role === "SUPER_ADMIN" && (
                                  <button onClick={() => handleDeleteActivity(activity.id, activity.activity_name || activity.name)} className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete activity"><Trash2 size={isMobile ? 14 : 16} /></button>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-1"><Calendar size={12} /><span>Start: {formatDate(activity.start_date || activity.startDate)}</span></div>
                              <div className="flex items-center gap-1"><Calendar size={12} /><span>End: {formatDate(activity.end_date || activity.endDate)}</span></div>
                              {!isActivityCompleted && getDeadlineBadge(activity.end_date || activity.endDate)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6">
                            {!isMobile && <div className="w-24 sm:w-32"><div className="flex justify-between text-xs mb-1"><span>Progress</span><span className="font-bold">{activityProgress}%</span></div><div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"><div className={`h-2 rounded-full ${getProgressColor(activityProgress)}`} style={{ width: `${activityProgress}%` }} /></div></div>}
                            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{subActivities.length} sub</div>
                            <button onClick={() => toggleActivity(activity.id)} className="p-1.5 sm:p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">{isExpanded ? <ChevronUp size={isMobile ? 16 : 20} /> : <ChevronDown size={isMobile ? 16 : 20} />}</button>
                          </div>
                        </div>
                        {isMobile && <div className="mt-3"><div className="flex justify-between text-xs mb-1"><span>Progress</span><span className="font-bold">{activityProgress}%</span></div><div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"><div className={`h-2 rounded-full ${getProgressColor(activityProgress)}`} style={{ width: `${activityProgress}%` }} /></div></div>}
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                            <div className="p-3 sm:p-4 md:p-6">
                              {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
                                <div className="mb-4 flex justify-end">
                                  <button onClick={() => { setSelectedActivityForSub(activity.id); setShowAddSubModal(true); }} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm flex items-center gap-1"><Plus size={14} /> Add Sub-Activity</button>
                                </div>
                              )}

                              {subActivities.length > 0 ? (
                                <div className="space-y-3 sm:space-y-4">
                                  {subActivities.map((sub, subIndex) => {
                                    if (!sub || !sub.id) return null;
                                    const subDaysLeft = calculateDaysLeft(sub.end_date || sub.endDate);
                                    const isEditing = editingSubActivity === sub.id;
                                    const subProgress = sub.progress || 0;
                                    const isSubCompleted = subProgress === 100;
                                    const subStatus = sub.status_display || mapStatusToFrontend(sub.status) || "PENDING";
                                    const subUnit = sub.unit_display || mapUnitToFrontend(sub.unit) || "Km";
                                    const subPlannedQty = sub.total_quantity || sub.plannedQty || 0;
                                    const subCompletedQty = sub.completed_quantity || sub.completedQty || 0;
                                    
                                    const pickedInfo = sub.picked_at && sub.picked_at.length > 0 ? sub.picked_at[0] : null;
                                    const isPicked = !!pickedInfo;
                                    const pickedByMe = isPicked && pickedInfo.emp_code === user?.id;
                                    
                                    return (
                                      <div key={sub.id} className={`bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-sm border ${isSubCompleted ? "border-green-200 dark:border-green-800" : isPicked ? "border-blue-200 dark:border-blue-800" : "border-gray-200 dark:border-gray-700"}`}>
                                        <div className="flex flex-col space-y-3">
                                          <div className="flex flex-wrap items-center gap-2">
                                            <h5 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">{sub.subactivity_name || sub.name}</h5>
                                            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300">{subUnit === "status" ? "Status" : subUnit}</span>
                                            {subUnit === "status" ? (
                                              <select value={subStatus} onChange={(e) => handleStatusUpdate(activity.id, sub.id, e.target.value)} className={`text-xs px-2 py-1 rounded-full border font-semibold ${getStatusColor(subStatus)}`}>
                                                <option value="PENDING">Pending</option><option value="ONGOING">Ongoing</option><option value="COMPLETED">Completed</option><option value="DELAYED">Delayed</option><option value="HOLD">Hold</option>
                                              </select>
                                            ) : (
                                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(subStatus)}`}>{subStatus}</span>
                                            )}
                                            {isPicked && !isSubCompleted && (
                                              <div className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${pickedByMe ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400" : "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"}`}>
                                                <UserCheck size={12} /> {pickedByMe ? "Picked by you" : `Picked by ${pickedInfo.emp_name}`}
                                              </div>
                                            )}
                                            {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
                                              <div className="flex items-center gap-1 ml-auto">
                                                <button onClick={() => { setSelectedSubActivityForExtension({ activityId: activity.id, activityName: activity.activity_name || activity.name, subId: sub.id, subName: sub.subactivity_name || sub.name, endDate: sub.end_date || sub.endDate }); setShowSubActivityExtensionModal(true); }} className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Extend deadline"><Calendar size={14} /></button>
                                                {user?.role === "SUPER_ADMIN" && (<button onClick={() => handleDeleteSubActivity(activity.id, sub.id, sub.subactivity_name || sub.name)} className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete"><Trash2 size={14} /></button>)}
                                              </div>
                                            )}
                                          </div>

                                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-500 dark:text-gray-400">
                                            <span>Start: {formatDate(sub.start_date || sub.startDate)}</span>
                                            <span>End: {formatDate(sub.end_date || sub.endDate)}</span>
                                            {!isSubCompleted && subDaysLeft !== null && subDaysLeft > 0 && <span className={`${subDaysLeft <= 2 ? "text-red-600 dark:text-red-400 font-semibold" : subDaysLeft <= 7 ? "text-yellow-600 dark:text-yellow-400" : "text-blue-600 dark:text-blue-400"}`}>{subDaysLeft} days left</span>}
                                          </div>

                                          {subUnit !== "status" && (
                                            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                              <span>Planned: {subPlannedQty} {subUnit === "Percentage" ? "%" : subUnit}</span>
                                              <span className="mx-2">|</span>
                                              <span>Completed: {subCompletedQty} {subUnit === "Percentage" ? "%" : subUnit}</span>
                                            </div>
                                          )}

                                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                            <div className="flex-1">
                                              <div className="flex justify-between text-xs mb-1"><span>Progress</span><span className={`font-bold ${isSubCompleted ? "text-green-600" : "text-blue-600"}`}>{subProgress}%</span></div>
                                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden"><div className={`h-2 rounded-full ${isSubCompleted ? "bg-green-500" : getProgressColor(subProgress)}`} style={{ width: `${subProgress}%` }} /></div>
                                            </div>
                                            {isEditing ? (
                                              <div className="flex items-center gap-2">
                                                {subUnit !== "status" ? (
                                                  <input type="number" value={editValue} onChange={(e) => setEditValue(parseFloat(e.target.value) || 0)} className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" min="0" max={subPlannedQty} step="0.01" autoFocus />
                                                ) : (
                                                  <select value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" autoFocus>
                                                    <option value="PENDING">Pending</option><option value="ONGOING">Ongoing</option><option value="COMPLETED">Completed</option><option value="DELAYED">Delayed</option><option value="HOLD">Hold</option>
                                                  </select>
                                                )}
                                                <button onClick={() => { if (subUnit !== "status") { handleProgressUpdate(activity.id, sub.id, subPlannedQty); } else { handleStatusUpdate(activity.id, sub.id, editValue); } }} className="p-1 bg-green-500 text-white rounded hover:bg-green-600" title="Save"><Save size={14} /></button>
                                                <button onClick={() => setEditingSubActivity(null)} className="p-1 bg-gray-500 text-white rounded hover:bg-gray-600" title="Cancel"><XCircle size={14} /></button>
                                              </div>
                                            ) : (
                                              <button onClick={() => { setEditingSubActivity(sub.id); setEditValue(subUnit !== "status" ? subCompletedQty : subStatus); }} className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors self-end sm:self-auto" title="Update Progress"><PenLine size={16} /></button>
                                            )}
                                          </div>

                                          {isPicked && (
                                            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                              <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
                                                <Users size={12} />
                                                <span className="font-medium">Assigned to:</span>
                                                <span>{pickedInfo.emp_name}</span>
                                                <span className="text-blue-500">•</span>
                                                <span>Picked on: {new Date(pickedInfo.picked_at).toLocaleDateString()}</span>
                                                {pickedInfo.started_at && (<><span className="text-blue-500">•</span><span>Started: {new Date(pickedInfo.started_at).toLocaleDateString()}</span></>)}
                                                {pickedInfo.status === 'COMPLETED' && (<><span className="text-blue-500">•</span><span className="text-green-600">Completed ✓</span></>)}
                                              </div>
                                              {pickedInfo.completed_quantity > 0 && (<div className="text-xs text-blue-600 mt-1">Completed: {pickedInfo.completed_quantity} {subUnit !== "status" ? subUnit : ""} {pickedInfo.total_time_spent > 0 && ` • Time: ${pickedInfo.total_time_spent.toFixed(1)} hrs`}</div>)}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">No sub-activities found</p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center border border-gray-200 dark:border-gray-700">
                  <ClipboardList size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No Activities Found</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This project doesn't have any activities yet.</p>
                  {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
                    <button onClick={() => navigate(`/projects/${id}/edit`)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center gap-2 text-sm"><Plus size={16} /> Add Activities</button>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};


const DetailItem = ({ label, value, icon = null }) => (
  <div className="space-y-0.5 sm:space-y-1">
    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">{icon && icon}{label}</p>
    <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white break-words">{value}</p>
  </div>
);

const StatCard = ({ label, value, icon = null }) => (
  <div className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 rounded-xl">
    <div className="flex items-center gap-1 mb-1">{icon && <span className="text-gray-500">{icon}</span>}<p className="text-xs text-gray-500 dark:text-gray-400">{label}</p></div>
    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
  </div>
);

export default ProjectDetails;