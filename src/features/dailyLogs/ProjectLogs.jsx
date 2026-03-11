import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  FileText,
  ArrowLeft,
  Download,
  Filter
} from "lucide-react";
import { addDailyLog } from "../projects/projectSlice";

const ProjectLogs = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const project = useSelector((state) =>
    state.projects.projects.find((p) => p.id === id)
  );

  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showAddLog, setShowAddLog] = useState(false);
  const [newLog, setNewLog] = useState({
    status: "WORKED",
    reason: "",
    description: ""
  });

  useEffect(() => {
    if (project) {
      const generatedLogs = [];

      // Project creation
      generatedLogs.push({
        id: "creation",
        type: "PROJECT_CREATED",
        date: project.loaDate || new Date().toISOString().split('T')[0],
        description: `Project ${project.name} created`,
        user: "System"
      });

      // Activity updates
      project.activities?.forEach(activity => {
        generatedLogs.push({
          id: `activity_${activity.id}`,
          type: "ACTIVITY_UPDATE",
          date: new Date().toISOString().split('T')[0],
          description: `Activity ${activity.name} progress: ${activity.progress}%`,
          user: "System"
        });

        activity.subActivities?.forEach(sub => {
          if (sub.status === "COMPLETED") {
            generatedLogs.push({
              id: `sub_${sub.id}`,
              type: "SUBACTIVITY_COMPLETED",
              date: new Date().toISOString().split('T')[0],
              description: `${sub.name} completed in ${activity.name}`,
              user: "System"
            });
          }
        });
      });

      // Daily logs
      project.dailyLogs?.forEach(log => {
        generatedLogs.push(log);
      });

      setLogs(generatedLogs.sort((a, b) => new Date(b.date) - new Date(a.date)));
    }
  }, [project]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Project not found</h2>
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

  const handleAddLog = () => {
    const logEntry = {
      type: "MANUAL_LOG",
      date: new Date().toISOString().split('T')[0],
      status: newLog.status,
      reason: newLog.reason,
      description: newLog.description,
      user: "Admin"
    };

    dispatch(addDailyLog({
      projectId: project.id,
      log: logEntry
    }));

    setShowAddLog(false);
    setNewLog({
      status: "WORKED",
      reason: "",
      description: ""
    });
  };

  const filteredLogs = filter === "all" 
    ? logs 
    : logs.filter(log => log.type === filter);

  const getLogIcon = (type) => {
    switch(type) {
      case "PROJECT_CREATED": return <FileText className="text-blue-500" size={20} />;
      case "ACTIVITY_UPDATE": return <Clock className="text-green-500" size={20} />;
      case "SUBACTIVITY_COMPLETED": return <CheckCircle className="text-green-500" size={20} />;
      case "EXTENSION_REQUEST": return <AlertCircle className="text-yellow-500" size={20} />;
      case "MANUAL_LOG": return <FileText className="text-purple-500" size={20} />;
      default: return <FileText className="text-gray-500" size={20} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto space-y-8 px-4 py-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/projects/${project.id}`)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{project.name}</h1>
            <p className="text-sm text-gray-500">Project Logs & History</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowAddLog(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2"
        >
          <FileText size={18} />
          Add Log
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 flex items-center gap-4">
        <Filter size={18} className="text-gray-400" />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border-0 bg-gray-50 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Logs</option>
          <option value="PROJECT_CREATED">Project Created</option>
          <option value="ACTIVITY_UPDATE">Activity Updates</option>
          <option value="SUBACTIVITY_COMPLETED">Subactivity Completed</option>
          <option value="EXTENSION_REQUEST">Extension Requests</option>
          <option value="MANUAL_LOG">Manual Logs</option>
        </select>
      </div>

      {/* Logs List */}
      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-start gap-4">
              {getLogIcon(log.type)}
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-gray-800">
                    {log.type?.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {log.date}
                  </span>
                </div>
                
                <p className="text-gray-600">{log.description}</p>
                
                {log.reason && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg text-sm text-red-600">
                    <span className="font-medium">Reason:</span> {log.reason}
                  </div>
                )}
                
                <div className="mt-3 text-xs text-gray-400">
                  By: {log.user || 'System'}
                </div>
              </div>

              {log.status && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  log.status === "WORKED" ? "bg-green-100 text-green-600" :
                  log.status === "NOT_WORKED" ? "bg-red-100 text-red-600" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {log.status}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Log Modal */}
      {showAddLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add Manual Log</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newLog.status}
                  onChange={(e) => setNewLog({...newLog, status: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                >
                  <option value="WORKED">Worked</option>
                  <option value="NOT_WORKED">Not Worked</option>
                  <option value="DELAYED">Delayed</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              {newLog.status === "NOT_WORKED" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <input
                    type="text"
                    value={newLog.reason}
                    onChange={(e) => setNewLog({...newLog, reason: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newLog.description}
                  onChange={(e) => setNewLog({...newLog, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAddLog(false)}
                className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLog}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                Add Log
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProjectLogs;