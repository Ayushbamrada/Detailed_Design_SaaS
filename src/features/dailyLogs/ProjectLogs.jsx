
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
  ChevronRight,
  Info
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


  const project = useMemo(() =>
    [...apiProjects, ...localProjects].find(p => p.id === id || p.project_id === id),
    [apiProjects, localProjects, id]
  );


  const [expandedLogs, setExpandedLogs] = useState({});
  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [newLog, setNewLog] = useState({
    event_type: "MANUAL_LOG",
    message: ""
  });


  const getDefaultDate = useCallback(() => {

    if (project?.created_at) {
      return project.created_at.split('T')[0];
    }

    return new Date().toISOString().split('T')[0];
  }, [project]);


  useEffect(() => {
    if (!filters.date || filters.date === new Date().toISOString().split('T')[0]) {
      const defaultDate = getDefaultDate();
      if (defaultDate !== filters.date) {
        dispatch(setLogFilters({ date: defaultDate }));
      }
    }
  }, [dispatch, filters.date, getDefaultDate]);


  useEffect(() => {
    if (!project && apiProjects.length === 0) {
      dispatch(fetchProjects());
    }
  }, [dispatch, project, apiProjects.length]);


  useEffect(() => {
    if (!id) return;

    const fetchDate = filters.date || getDefaultDate();

    dispatch(fetchProjectLogs({
      projectId: id,
      date: fetchDate,
      eventType: filters.eventType,
      search: filters.search
    }));
  }, [dispatch, id, filters.date, filters.eventType, filters.search, getDefaultDate]);


  useEffect(() => {
    if (projectLogs.length > 0) {
      dispatch(calculateStats());
    }
  }, [projectLogs, dispatch]);


  const currentLogs = useMemo(() => {
    const start = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const end = start + pagination.itemsPerPage;
    return projectLogs.slice(start, end);
  }, [projectLogs, pagination.currentPage, pagination.itemsPerPage]);


  const handleFilterChange = (key, value) => {
    dispatch(setLogFilters({ [key]: value }));
    dispatch(setPage(1));
  };

  const handleClearFilters = () => {
    dispatch(resetFilters());

    const defaultDate = getDefaultDate();
    dispatch(setLogFilters({ date: defaultDate, eventType: 'all', search: '' }));
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
    if (user?.role !== "ACCOUNT") {
      dispatch(showSnackbar({
        message: "Only Account can delete logs",
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
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
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
    filters.date !== getDefaultDate();

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
                    onChange={(e) => setNewLog({ ...newLog, event_type: e.target.value })}
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
                    onChange={(e) => setNewLog({ ...newLog, message: e.target.value })}
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
              <p className="text-sm text-gray-600">Created</p>
              <p className="text-lg font-semibold text-gray-800">
                {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}
              </p>
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
          <p className="text-sm text-green-600">Selected Date</p>
          <p className="text-2xl font-bold text-green-700">
            {filters.date ? new Date(filters.date).toLocaleDateString() : 'N/A'}
          </p>
        </div>

        <div className="bg-purple-50 rounded-xl p-4 shadow-md border border-purple-100">
          <p className="text-sm text-purple-600">Project Progress</p>
          <p className="text-2xl font-bold text-purple-700">
            {project?.progress || 0}%
          </p>
        </div>
      </div>


      {projectLogs.length === 0 && !loading && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <Info size={20} className="text-yellow-600 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800">No logs found for {filters.date}</p>
            <p className="text-sm text-yellow-700">
              Try selecting a different date or add a new log. The project was created on {project?.created_at ? new Date(project.created_at).toLocaleDateString() : 'an unknown date'}.
            </p>
          </div>
        </div>
      )}


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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={filters.date}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tip: Try {project?.created_at ? new Date(project.created_at).toLocaleDateString() : 'the project creation date'}
                  </p>
                </div>


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


      {projectLogs.length > 0 && (
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
      )}


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
                  : `No logs found for ${filters.date}. Try selecting a different date.`}
              </p>
              <button
                onClick={() => {

                  if (project?.created_at) {
                    handleFilterChange('date', project.created_at.split('T')[0]);
                  } else {
                    setShowAddLogModal(true);
                  }
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 inline-flex items-center gap-2"
              >
                {project?.created_at ? (
                  <>
                    <Calendar size={18} />
                    Try {new Date(project.created_at).toLocaleDateString()}
                  </>
                ) : (
                  <>
                    <FileText size={18} />
                    Add First Log
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ProjectLogs;