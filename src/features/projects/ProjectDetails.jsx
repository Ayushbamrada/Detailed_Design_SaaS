import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  updateSubActivityProgress,
  updateSubActivityStatus,
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
  fetchActivities
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
  Loader2
} from "lucide-react";

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

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { projects = [], loading: apiLoading } = useSelector((state) => state.api);
  
  // Reference data from API slice
  const { 
    companies = [], 
    subCompanies = [], 
    sectors = [], 
    clients = [], 
    activities = [] 
  } = useSelector((state) => state.api);

  // Create lookup maps for IDs to names
  const [companyMap, setCompanyMap] = useState({});
  const [subCompanyMap, setSubCompanyMap] = useState({});
  const [sectorMap, setSectorMap] = useState({});
  const [clientMap, setClientMap] = useState({});
  
  // Find project from API
  const project = projects.find(p => p.id === id || p.project_id === id);

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
  const [loading, setLoading] = useState(false);

  // Fetch all reference data and projects
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          dispatch(fetchCompanies()),
          dispatch(fetchSubCompanies()),
          dispatch(fetchSectors()),
          dispatch(fetchClients()),
          dispatch(fetchActivities()),
          dispatch(fetchProjects())
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [dispatch]);

  // Create lookup maps when reference data loads
  useEffect(() => {
    if (companies.length > 0) {
      const map = {};
      companies.forEach(company => {
        map[company.id] = company.name;
      });
      setCompanyMap(map);
    }
  }, [companies]);

  useEffect(() => {
    if (subCompanies.length > 0) {
      const map = {};
      subCompanies.forEach(sub => {
        map[sub.id] = sub.name;
      });
      setSubCompanyMap(map);
    }
  }, [subCompanies]);

  useEffect(() => {
    if (sectors.length > 0) {
      const map = {};
      sectors.forEach(sector => {
        map[sector.id] = sector.name;
      });
      setSectorMap(map);
    }
  }, [sectors]);

  useEffect(() => {
    if (clients.length > 0) {
      const map = {};
      clients.forEach(client => {
        map[client.id] = client.name;
      });
      setClientMap(map);
    }
  }, [clients]);

  useEffect(() => {
    if (project) {
      console.log("Project loaded:", project);
    }
  }, [project]);

  // Helper functions to handle API data format with mapping
  const getProjectId = () => {
    return project?.id || project?.project_id;
  };

  const getProjectName = () => {
    return project?.name || project?.project_name || "Unnamed Project";
  };

  const getProjectCode = () => {
    return project?.code || project?.project_code || "N/A";
  };

  const getProjectShortName = () => {
    return project?.shortName || project?.short_name || "—";
  };

  const getProjectCompany = () => {
    // Try to get from company field first, then from company_id
    const companyId = project?.company || project?.company_id;
    if (!companyId) return "—";
    
    // If it's already a string and in our map, return the name
    if (typeof companyId === 'string' && companyMap[companyId]) {
      return companyMap[companyId];
    }
    
    // If it's an object with name, return that
    if (typeof companyId === 'object' && companyId?.name) {
      return companyId.name;
    }
    
    return companyId;
  };

  const getProjectSubCompany = () => {
    const subCompanyId = project?.sub_company || project?.sub_company_id;
    if (!subCompanyId) return "—";
    
    if (typeof subCompanyId === 'string' && subCompanyMap[subCompanyId]) {
      return subCompanyMap[subCompanyId];
    }
    
    if (typeof subCompanyId === 'object' && subCompanyId?.name) {
      return subCompanyId.name;
    }
    
    return subCompanyId;
  };

  const getProjectLocation = () => {
    return project?.location || "—";
  };

  const getProjectSector = () => {
    const sectorId = project?.sector || project?.sector_id;
    if (!sectorId) return "—";
    
    if (typeof sectorId === 'string' && sectorMap[sectorId]) {
      return sectorMap[sectorId];
    }
    
    if (typeof sectorId === 'object' && sectorId?.name) {
      return sectorId.name;
    }
    
    return sectorId;
  };

  const getProjectDepartment = () => {
    const clientId = project?.client || project?.client_id || project?.department;
    if (!clientId) return "—";
    
    if (typeof clientId === 'string' && clientMap[clientId]) {
      return clientMap[clientId];
    }
    
    if (typeof clientId === 'object' && clientId?.name) {
      return clientId.name;
    }
    
    return clientId;
  };

  const getProjectTotalLength = () => {
    const value = project?.total_length || project?.totalLength || 0;
    return `${value} km`;
  };

  const getProjectCost = () => {
    const value = project?.cost || project?.workorder_cost || 0;
    return `₹ ${value} Lakhs`;
  };

  const getProjectLoaDate = () => {
    const date = project?.loa_date || project?.loaDate;
    return date ? formatDate(date) : "Not set";
  };

  const getProjectDirectorProposalDate = () => {
    const date = project?.director_proposal_date || project?.directorProposalDate;
    return date ? formatDate(date) : "Not set";
  };

  const getProjectConfirmationDate = () => {
    const date = project?.project_confirmation_date || project?.projectConfirmationDate;
    return date ? formatDate(date) : "Not set";
  };

  const getProjectCompletionDate = () => {
    return project?.completion_date || project?.completionDate;
  };

  const getProjectProgress = () => {
    return project?.progress || 0;
  };

  const getProjectStatus = () => {
    return project?.status || "ONGOING";
  };

  const getProjectExtensionRequested = () => {
    return project?.extensionRequested || false;
  };

  const getProjectActivities = () => {
    return project?.activities || [];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Check if user has access to this project
  const hasAccess = 
    user?.role === "SUPER_ADMIN" || 
    user?.role === "ADMIN" || 
    project?.assignedUsers?.includes(user?.id) ||
    project?.createdBy === user?.id;

  useEffect(() => {
    if (project && !hasAccess && user?.role === "USER") {
      dispatch(showSnackbar({
        message: "You don't have access to this project",
        type: "error"
      }));
      navigate("/dashboard");
    }
  }, [project, hasAccess, user, navigate, dispatch]);

  if (loading || apiLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl flex items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <div>
            <p className="text-lg font-semibold text-gray-800">Loading Project</p>
            <p className="text-sm text-gray-500">Fetching project details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle size={48} className="text-red-500 mx-auto mb-4" />
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

  const remaining = 100 - getProjectProgress();
  const completionDate = getProjectCompletionDate();

  const toggleActivity = (activityId) => {
    setExpandedActivities({
      ...expandedActivities,
      [activityId]: !expandedActivities[activityId]
    });
  };

  const handleProgressUpdate = (activityId, subId, maxQty) => {
    if (editValue > maxQty) {
      alert(`Completed quantity cannot exceed planned quantity (${maxQty})`);
      return;
    }

    dispatch(updateSubActivityProgress({
      projectId: getProjectId(),
      activityId,
      subId,
      completedQty: editValue
    }));
    
    dispatch(showSnackbar({
      message: "Progress updated successfully",
      type: "success"
    }));
    
    setEditingSubActivity(null);
    setEditValue(0);
  };

  const handleStatusUpdate = (activityId, subId, status) => {
    dispatch(updateSubActivityStatus({
      projectId: getProjectId(),
      activityId,
      subId,
      status
    }));
    
    dispatch(showSnackbar({
      message: `Status updated to ${status}`,
      type: "success"
    }));
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
        startDate: activity?.startDate,
        endDate: activity?.endDate
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

    dispatch(showSnackbar({
      message: "Activity deadline extended successfully",
      type: "success"
    }));

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

    dispatch(showSnackbar({
      message: "Sub-activity deadline extended successfully",
      type: "success"
    }));

    setShowSubActivityExtensionModal(false);
    setSelectedSubActivityForExtension(null);
  };

  const handleDeleteActivity = (activityId, activityName) => {
    if (user?.role !== "SUPER_ADMIN") {
      dispatch(showSnackbar({
        message: "Only Super Admin can delete activities",
        type: "error"
      }));
      return;
    }

    if (window.confirm(`Are you sure you want to delete activity "${activityName}"?`)) {
      dispatch(deleteActivity({
        projectId: getProjectId(),
        activityId
      }));

      dispatch(showSnackbar({
        message: "Activity deleted successfully",
        type: "success"
      }));
    }
  };

  const handleDeleteSubActivity = (activityId, subId, subName) => {
    if (user?.role !== "SUPER_ADMIN") {
      dispatch(showSnackbar({
        message: "Only Super Admin can delete sub-activities",
        type: "error"
      }));
      return;
    }

    if (window.confirm(`Are you sure you want to delete sub-activity "${subName}"?`)) {
      dispatch(deleteSubActivity({
        projectId: getProjectId(),
        activityId,
        subId
      }));

      dispatch(showSnackbar({
        message: "Sub-activity deleted successfully",
        type: "success"
      }));
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "COMPLETED": return "bg-green-100 text-green-600 border-green-200";
      case "ONGOING": return "bg-blue-100 text-blue-600 border-blue-200";
      case "DELAYED": return "bg-red-100 text-red-600 border-red-200";
      case "HOLD": return "bg-yellow-100 text-yellow-600 border-yellow-200";
      case "PENDING": return "bg-gray-100 text-gray-600 border-gray-200";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return "bg-green-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    if (progress >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  const calculateDaysLeft = (endDate) => {
    if (!endDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDeadlineBadge = (endDate) => {
    const days = calculateDaysLeft(endDate);
    if (days === null) return null;
    if (days < 0) return <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">Overdue</span>;
    if (days === 0) return <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">Due Today</span>;
    if (days <= 2) return <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full">{days} days left</span>;
    if (days <= 7) return <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full">{days} days left</span>;
    return <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">{days} days left</span>;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto space-y-8 px-4 py-6"
    >
      {/* Activity Extension Modal */}
      <ActivityExtensionModal
        isOpen={showActivityExtensionModal}
        onClose={() => {
          setShowActivityExtensionModal(false);
          setSelectedActivityForExtension(null);
        }}
        onSubmit={({ newDate, reason }) => handleExtendActivity(selectedActivityForExtension, newDate, reason)}
        item={getProjectActivities().find(a => a.id === selectedActivityForExtension)}
        itemType="activity"
      />

      {/* Sub-Activity Extension Modal */}
      <ActivityExtensionModal
        isOpen={showSubActivityExtensionModal}
        onClose={() => {
          setShowSubActivityExtensionModal(false);
          setSelectedSubActivityForExtension(null);
        }}
        onSubmit={({ newDate, reason }) => {
          const sub = getProjectActivities()
            .find(a => a.id === selectedSubActivityForExtension?.activityId)
            ?.subActivities?.find(s => s.id === selectedSubActivityForExtension?.subId);
          handleExtendSubActivity(
            selectedSubActivityForExtension.activityId,
            selectedSubActivityForExtension.subId,
            newDate,
            reason
          );
        }}
        item={{
          name: selectedSubActivityForExtension?.subName,
          endDate: selectedSubActivityForExtension?.endDate,
          parentActivity: selectedSubActivityForExtension?.activityName
        }}
        itemType="subactivity"
      />

      {/* Add Sub-Activity Modal */}
      <AnimatePresence>
        {showAddSubModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddSubModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleAddSubActivity}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Add Sub-Activity</h3>
                  <button
                    type="button"
                    onClick={() => setShowAddSubModal(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Sub-activity name"
                    value={newSubActivity.name}
                    onChange={(e) => setNewSubActivity({...newSubActivity, name: e.target.value})}
                    className="w-full p-3 border rounded-xl"
                    required
                  />
                  
                  <select
                    value={newSubActivity.unit}
                    onChange={(e) => setNewSubActivity({...newSubActivity, unit: e.target.value})}
                    className="w-full p-3 border rounded-xl"
                  >
                    <option value="Km">Kilometer (Km) - Track by distance</option>
                    <option value="Nos.">Numbers (Nos.) - Track by count</option>
                    <option value="Percentage">Percentage (%) - Track by completion %</option>
                    <option value="status">Status Based - Track by status (Pending/Ongoing/Completed)</option>
                  </select>
                  
                  {newSubActivity.unit === "Percentage" ? (
                    <div className="space-y-2">
                      <input
                        type="number"
                        placeholder="Target percentage (e.g., 100)"
                        value={newSubActivity.plannedQty}
                        onChange={(e) => setNewSubActivity({...newSubActivity, plannedQty: parseFloat(e.target.value)})}
                        className="w-full p-3 border rounded-xl"
                        min="0"
                        max="100"
                        step="1"
                        required
                      />
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Info size={12} />
                        Progress will be tracked as percentage complete. Target is typically 100%.
                      </p>
                    </div>
                  ) : newSubActivity.unit !== "status" ? (
                    <input
                      type="number"
                      placeholder="Planned quantity"
                      value={newSubActivity.plannedQty}
                      onChange={(e) => setNewSubActivity({...newSubActivity, plannedQty: parseFloat(e.target.value)})}
                      className="w-full p-3 border rounded-xl"
                      min="0"
                      step="0.01"
                      required
                    />
                  ) : (
                    <div className="p-3 bg-blue-50 rounded-xl text-sm text-blue-600 flex items-center gap-2">
                      <Info size={16} />
                      Status-based tracking - No quantity needed. Will track as Pending, Ongoing, Completed, etc.
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddSubModal(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Sub-Activity
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/projects")}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{getProjectName()}</h1>
            <p className="text-sm text-gray-500">
              Code: {getProjectCode()} | Short Name: {getProjectShortName()}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/projects/${id}/logs`)}
            className="bg-gray-800 text-white px-4 py-2 rounded-xl hover:bg-gray-900 transition-all flex items-center gap-2"
          >
            <FileText size={18} />
            View Logs
          </button>

          {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN" || project?.assignedUsers?.includes(user?.id)) && (
            <button
              onClick={() => navigate(`/projects/${id}/extend`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <Calendar size={18} />
              Extend Project Deadline
            </button>
          )}
        </div>
      </div>

      {/* Status Banner */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`rounded-2xl p-4 flex items-center justify-between ${
          getProjectStatus() === "DELAYED" ? "bg-red-50 border border-red-200" :
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
              {getDeadlineStatus(completionDate) === "OVERDUE" ? "Project is overdue" :
               getDeadlineStatus(completionDate) === "TODAY" ? "Project due today!" :
               getDeadlineStatus(completionDate) === "CRITICAL" ? "Project deadline critical" :
               getProjectStatus() === "COMPLETED" ? "Project completed successfully" :
               "Project is on track"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Completion Date</p>
          <p className="font-semibold">{formatDate(completionDate)}</p>
          {getDeadlineBadge(completionDate)}
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
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Company</p>
                <p className="font-medium text-gray-800">{getProjectCompany()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Sub Company</p>
                <p className="font-medium text-gray-800">{getProjectSubCompany()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin size={12} /> Location
                </p>
                <p className="font-medium text-gray-800">{getProjectLocation()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Sector</p>
                <p className="font-medium text-gray-800">{getProjectSector()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Department</p>
                <p className="font-medium text-gray-800">{getProjectDepartment()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Ruler size={12} /> Total Length
                </p>
                <p className="font-medium text-gray-800">{getProjectTotalLength()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <IndianRupee size={12} /> Workorder Cost
                </p>
                <p className="font-medium text-gray-800">{getProjectCost()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar size={12} /> LOA Date
                </p>
                <p className="font-medium text-gray-800">{getProjectLoaDate()}</p>
              </div>
            </div>

            {/* Additional Dates */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="font-semibold text-gray-700 mb-3">Key Milestones</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Director Proposal</p>
                  <p className="font-medium text-gray-800">{getProjectDirectorProposalDate()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Project Confirmation</p>
                  <p className="font-medium text-gray-800">{getProjectConfirmationDate()}</p>
                </div>
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
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{getProjectProgress()}% Completed</span>
                  <span>{remaining}% Remaining</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500">Total Activities</p>
                  <p className="text-2xl font-bold text-gray-800">{getProjectActivities().length}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500">Sub Activities</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {getProjectActivities().reduce((acc, act) => acc + (act.subActivities?.length || 0), 0)}
                  </p>
                </div>
              </div>

              {/* Status Tags */}
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(getProjectStatus())}`}>
                  {getProjectStatus()}
                </span>
                {getProjectExtensionRequested() && (
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
            Activities & Sub-Activities
          </h3>
        </div>

        {getProjectActivities().map((activity) => {
          const isExpanded = expandedActivities[activity.id];
          const activityProgress = activity.progress || 0;
          const daysLeft = calculateDaysLeft(activity.endDate);

          return (
            <motion.div
              key={activity.id}
              layout
              className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100"
            >
              {/* Activity Header */}
              <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-800">{activity.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activityProgress === 100 ? "bg-green-100 text-green-600" : 
                        daysLeft < 0 ? "bg-red-100 text-red-600" : 
                        "bg-blue-100 text-blue-600"
                      }`}>
                        {activityProgress === 100 ? "Completed" : 
                         daysLeft < 0 ? "Delayed" : "Ongoing"}
                      </span>
                      
                      {/* ACTIVITY EXTENSION BUTTON - FOR ADMINS */}
                      {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
                        <button
                          onClick={() => {
                            setSelectedActivityForExtension(activity.id);
                            setShowActivityExtensionModal(true);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ml-2"
                          title="Extend activity deadline"
                        >
                          <Calendar size={16} />
                        </button>
                      )}
                      
                      {user?.role === "SUPER_ADMIN" && (
                        <button
                          onClick={() => handleDeleteActivity(activity.id, activity.name)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete activity"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    {/* Activity Dates */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>Start: {formatDate(activity.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>End: {formatDate(activity.endDate)}</span>
                      </div>
                      {getDeadlineBadge(activity.endDate)}
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Activity Progress */}
                    <div className="w-32">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span className="font-bold">{activityProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${activityProgress}%` }}
                          className={`h-2 rounded-full ${getProgressColor(activityProgress)}`}
                        />
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      {activity.subActivities?.length || 0} sub-activities
                    </div>
                    
                    <button
                      onClick={() => toggleActivity(activity.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
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
                      {/* Add Sub-Activity Button */}
                      {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
                        <div className="mb-4 flex justify-end">
                          <button
                            onClick={() => {
                              setSelectedActivityForSub(activity.id);
                              setShowAddSubModal(true);
                            }}
                            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-1"
                          >
                            <Plus size={16} />
                            Add Sub-Activity
                          </button>
                        </div>
                      )}

                      {/* Sub Activities List */}
                      <div className="space-y-4">
                        {activity.subActivities?.map((sub) => {
                          const subDaysLeft = calculateDaysLeft(sub.endDate);
                          const isEditing = editingSubActivity === sub.id;
                          
                          return (
                            <div
                              key={sub.id}
                              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                            >
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                {/* Sub Activity Info */}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <h5 className="font-medium text-gray-800">{sub.name}</h5>
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                      {sub.unit === "status" ? "Status Based" : sub.unit}
                                    </span>
                                    
                                    {/* Status Dropdown for status-based items */}
                                    {sub.unit === "status" ? (
                                      <select
                                        value={sub.status || "PENDING"}
                                        onChange={(e) => {
                                          handleStatusUpdate(activity.id, sub.id, e.target.value);
                                        }}
                                        className={`text-xs px-2 py-1 rounded-full border font-semibold ${getStatusColor(sub.status)}`}
                                      >
                                        <option value="PENDING">Pending</option>
                                        <option value="ONGOING">Ongoing</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="DELAYED">Delayed</option>
                                        <option value="HOLD">On Hold</option>
                                      </select>
                                    ) : (
                                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(sub.status)}`}>
                                        {sub.status || "PENDING"}
                                      </span>
                                    )}

                                    {/* SUB-ACTIVITY EXTENSION BUTTON - FOR ADMINS */}
                                    {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
                                      <button
                                        onClick={() => {
                                          setSelectedSubActivityForExtension({
                                            activityId: activity.id,
                                            activityName: activity.name,
                                            subId: sub.id,
                                            subName: sub.name,
                                            endDate: sub.endDate
                                          });
                                          setShowSubActivityExtensionModal(true);
                                        }}
                                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Extend sub-activity deadline"
                                      >
                                        <Calendar size={14} />
                                      </button>
                                    )}

                                    {user?.role === "SUPER_ADMIN" && (
                                      <button
                                        onClick={() => handleDeleteSubActivity(activity.id, sub.id, sub.name)}
                                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete sub-activity"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    )}
                                  </div>

                                  {/* Sub Activity Dates */}
                                  <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <span>Start: {formatDate(sub.startDate)}</span>
                                    <span>End: {formatDate(sub.endDate)}</span>
                                    {subDaysLeft !== null && subDaysLeft > 0 && sub.status !== "COMPLETED" && (
                                      <span className={`${
                                        subDaysLeft <= 2 ? "text-red-600 font-semibold" : 
                                        subDaysLeft <= 7 ? "text-yellow-600" : "text-blue-600"
                                      }`}>
                                        {subDaysLeft} days left
                                      </span>
                                    )}
                                  </div>

                                  {/* Quantity Info - Only show for non-status units */}
                                  {sub.unit !== "status" && (
                                    <div className="mt-2 text-sm">
                                      <span className="text-gray-600">Planned: {sub.plannedQty} {sub.unit}</span>
                                      <span className="mx-2">|</span>
                                      <span className="text-gray-600">Completed: {sub.completedQty || 0} {sub.unit}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Progress and Edit */}
                                <div className="flex items-center gap-4">
                                  {/* Progress Bar */}
                                  <div className="w-32">
                                    <div className="flex justify-between text-xs mb-1">
                                      <span>Progress</span>
                                      <span className="font-bold">{sub.progress || 0}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${sub.progress || 0}%` }}
                                        className={`h-2 rounded-full ${
                                          sub.progress === 100 ? "bg-green-500" :
                                          sub.progress >= 75 ? "bg-blue-500" :
                                          sub.progress >= 50 ? "bg-yellow-500" :
                                          sub.progress >= 25 ? "bg-orange-500" :
                                          "bg-red-500"
                                        }`}
                                      />
                                    </div>
                                  </div>

                                  {/* Edit Button or Input */}
                                  {isEditing ? (
                                    <div className="flex items-center gap-2">
                                      {sub.unit !== "status" ? (
                                        <input
                                          type="number"
                                          value={editValue}
                                          onChange={(e) => setEditValue(parseFloat(e.target.value) || 0)}
                                          className="w-20 px-2 py-1 border rounded text-sm"
                                          min="0"
                                          max={sub.plannedQty}
                                          step="0.01"
                                          autoFocus
                                        />
                                      ) : (
                                        <select
                                          value={editValue}
                                          onChange={(e) => setEditValue(e.target.value)}
                                          className="w-24 px-2 py-1 border rounded text-sm"
                                          autoFocus
                                        >
                                          <option value="PENDING">Pending</option>
                                          <option value="ONGOING">Ongoing</option>
                                          <option value="COMPLETED">Completed</option>
                                          <option value="DELAYED">Delayed</option>
                                          <option value="HOLD">Hold</option>
                                        </select>
                                      )}
                                      <button
                                        onClick={() => {
                                          if (sub.unit !== "status") {
                                            handleProgressUpdate(activity.id, sub.id, sub.plannedQty);
                                          } else {
                                            handleStatusUpdate(activity.id, sub.id, editValue);
                                            setEditingSubActivity(null);
                                          }
                                        }}
                                        className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                                        title="Save"
                                      >
                                        <Save size={16} />
                                      </button>
                                      <button
                                        onClick={() => setEditingSubActivity(null)}
                                        className="p-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                                        title="Cancel"
                                      >
                                        <XCircle size={16} />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setEditingSubActivity(sub.id);
                                        setEditValue(sub.unit !== "status" ? sub.completedQty || 0 : sub.status || "PENDING");
                                      }}
                                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                      title="Update Progress"
                                    >
                                      <PenLine size={18} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ProjectDetails;