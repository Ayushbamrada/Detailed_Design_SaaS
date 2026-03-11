// import { useSelector } from "react-redux";
// import { useState } from "react";

// const DailyLogs = () => {
//   const { user } = useSelector((state) => state.auth);

//   const today = new Date().toISOString().split("T")[0];
//   const [selectedDate, setSelectedDate] = useState(today);

//   const mockLogs = [
//     {
//       id: 1,
//       project: "100 KM Highway",
//       user: "Site Engineer A",
//       date: today,
//       status: "WORKED",
//     },
//     {
//       id: 2,
//       project: "State Road Widening",
//       user: "Site Engineer B",
//       date: today,
//       status: "NOT_WORKED",
//     },
//   ];

//   const filteredLogs = mockLogs.filter(
//     (log) => log.date === selectedDate
//   );

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-semibold">
//         Daily Logs
//       </h2>

//       {/* Date Filter */}
//       <div className="flex items-center gap-4">
//         <input
//           type="date"
//           value={selectedDate}
//           onChange={(e) => setSelectedDate(e.target.value)}
//           className="border p-2 rounded-md"
//         />
//       </div>

//       {/* USER VIEW */}
//       {user.role === "USER" && (
//         <div className="bg-white p-6 rounded-xl shadow space-y-4">
//           <h4 className="font-semibold">
//             Your Logs — {selectedDate}
//           </h4>

//           {filteredLogs
//             .filter((log) => log.user === user.name)
//             .map((log) => (
//               <div
//                 key={log.id}
//                 className="flex justify-between p-4 bg-gray-50 rounded-md"
//               >
//                 <span>{log.project}</span>
//                 <span
//                   className={
//                     log.status === "WORKED"
//                       ? "text-green-600 font-semibold"
//                       : "text-red-600 font-semibold"
//                   }
//                 >
//                   {log.status}
//                 </span>
//               </div>
//             ))}

//           <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
//             Update Today’s Log
//           </button>
//         </div>
//       )}

//       {/* ADMIN VIEW */}
//       {(user.role === "ADMIN" ||
//         user.role === "SUPER_ADMIN") && (
//         <div className="bg-white p-6 rounded-xl shadow space-y-4">
//           <h4 className="font-semibold">
//             All Logs — {selectedDate}
//           </h4>

//           {filteredLogs.map((log) => (
//             <div
//               key={log.id}
//               className="flex justify-between items-center p-4 bg-gray-50 rounded-md"
//             >
//               <div>
//                 <p className="font-semibold">
//                   {log.project}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   Updated by: {log.user}
//                 </p>
//               </div>

//               <span
//                 className={
//                   log.status === "WORKED"
//                     ? "text-green-600 font-semibold"
//                     : "text-red-600 font-semibold"
//                 }
//               >
//                 {log.status}
//               </span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DailyLogs;

import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  User,
  Building,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from "lucide-react";
import { addDailyLog } from "../projects/projectSlice";

const DailyLogs = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { projects } = useSelector((state) => state.projects);
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedProject, setSelectedProject] = useState("all");
  const [expandedLogs, setExpandedLogs] = useState({});
  const [logs, setLogs] = useState([]);
  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [newLog, setNewLog] = useState({
    projectId: "",
    status: "WORKED",
    reason: "",
    description: ""
  });

  // Generate logs from projects data
  useEffect(() => {
    const generatedLogs = [];
    
    projects.forEach(project => {
      // Add project creation log
      generatedLogs.push({
        id: `project_created_${project.id}`,
        projectId: project.id,
        projectName: project.name,
        type: "PROJECT_CREATED",
        date: project.loaDate || new Date().toISOString().split('T')[0],
        description: `Project ${project.name} created`,
        user: "System",
        details: { project }
      });

      // Add activity logs
      project.activities?.forEach(activity => {
        generatedLogs.push({
          id: `activity_${activity.id}`,
          projectId: project.id,
          projectName: project.name,
          type: "ACTIVITY_UPDATE",
          date: new Date().toISOString().split('T')[0],
          description: `Activity ${activity.name} progress updated to ${activity.progress}%`,
          user: "System",
          details: { activity }
        });

        // Add sub-activity logs
        activity.subActivities?.forEach(sub => {
          if (sub.status === "COMPLETED") {
            generatedLogs.push({
              id: `sub_completed_${sub.id}`,
              projectId: project.id,
              projectName: project.name,
              type: "SUBACTIVITY_COMPLETED",
              date: new Date().toISOString().split('T')[0],
              description: `${sub.name} completed in ${activity.name}`,
              user: "System",
              details: { activity, sub }
            });
          }
        });
      });

      // Add daily logs from project
      project.dailyLogs?.forEach(log => {
        generatedLogs.push({
          ...log,
          projectId: project.id,
          projectName: project.name
        });
      });
    });

    setLogs(generatedLogs.sort((a, b) => new Date(b.date) - new Date(a.date)));
  }, [projects]);

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesDate = !selectedDate || log.date === selectedDate;
    const matchesSearch = log.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || log.type === filterType;
    const matchesProject = selectedProject === "all" || log.projectId === selectedProject;
    
    return matchesDate && matchesSearch && matchesType && matchesProject;
  });

  const handleAddLog = () => {
    if (!newLog.projectId) {
      alert("Please select a project");
      return;
    }

    const logEntry = {
      type: "MANUAL_LOG",
      date: selectedDate,
      status: newLog.status,
      reason: newLog.reason,
      description: newLog.description,
      user: user?.name || "Admin"
    };

    dispatch(addDailyLog({
      projectId: newLog.projectId,
      log: logEntry
    }));

    setShowAddLogModal(false);
    setNewLog({
      projectId: "",
      status: "WORKED",
      reason: "",
      description: ""
    });
  };

  const getLogIcon = (type) => {
    switch(type) {
      case "PROJECT_CREATED": return <FileText className="text-blue-500" size={20} />;
      case "ACTIVITY_UPDATE": return <RefreshCw className="text-green-500" size={20} />;
      case "SUBACTIVITY_COMPLETED": return <CheckCircle className="text-green-500" size={20} />;
      case "EXTENSION_REQUEST": return <Clock className="text-yellow-500" size={20} />;
      case "EXTENSION_APPROVED": return <CheckCircle className="text-green-500" size={20} />;
      case "EXTENSION_REJECTED": return <XCircle className="text-red-500" size={20} />;
      case "MANUAL_LOG": return newLog.status === "WORKED" ? 
        <CheckCircle className="text-green-500" size={20} /> : 
        <AlertCircle className="text-red-500" size={20} />;
      default: return <FileText className="text-gray-500" size={20} />;
    }
  };

  const getLogColor = (type) => {
    switch(type) {
      case "PROJECT_CREATED": return "border-blue-200 bg-blue-50";
      case "ACTIVITY_UPDATE": return "border-green-200 bg-green-50";
      case "SUBACTIVITY_COMPLETED": return "border-green-200 bg-green-50";
      case "EXTENSION_REQUEST": return "border-yellow-200 bg-yellow-50";
      case "EXTENSION_APPROVED": return "border-green-200 bg-green-50";
      case "EXTENSION_REJECTED": return "border-red-200 bg-red-50";
      case "MANUAL_LOG": return newLog.status === "WORKED" ? 
        "border-green-200 bg-green-50" : "border-red-200 bg-red-50";
      default: return "border-gray-200 bg-gray-50";
    }
  };

  const stats = {
    total: filteredLogs.length,
    byType: {
      PROJECT_CREATED: filteredLogs.filter(l => l.type === "PROJECT_CREATED").length,
      ACTIVITY_UPDATE: filteredLogs.filter(l => l.type === "ACTIVITY_UPDATE").length,
      SUBACTIVITY_COMPLETED: filteredLogs.filter(l => l.type === "SUBACTIVITY_COMPLETED").length,
      EXTENSION_REQUEST: filteredLogs.filter(l => l.type === "EXTENSION_REQUEST").length,
      MANUAL_LOG: filteredLogs.filter(l => l.type === "MANUAL_LOG").length
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto space-y-8 px-4 py-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Daily Logs Management
          </h1>
          <p className="text-gray-500 mt-2">Track all project activities and events</p>
        </div>
        
        <button
          onClick={() => setShowAddLogModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg"
        >
          <FileText size={20} />
          Add Manual Log
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
        >
          <p className="text-sm text-gray-500">Total Logs</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-blue-50 rounded-2xl p-4 shadow-lg border border-blue-100"
        >
          <p className="text-sm text-blue-600">Project Created</p>
          <p className="text-2xl font-bold text-blue-700">{stats.byType.PROJECT_CREATED}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-green-50 rounded-2xl p-4 shadow-lg border border-green-100"
        >
          <p className="text-sm text-green-600">Updates</p>
          <p className="text-2xl font-bold text-green-700">{stats.byType.ACTIVITY_UPDATE}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-yellow-50 rounded-2xl p-4 shadow-lg border border-yellow-100"
        >
          <p className="text-sm text-yellow-600">Extensions</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.byType.EXTENSION_REQUEST}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-purple-50 rounded-2xl p-4 shadow-lg border border-purple-100"
        >
          <p className="text-sm text-purple-600">Manual Logs</p>
          <p className="text-2xl font-bold text-purple-700">{stats.byType.MANUAL_LOG}</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Date Filter */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <Calendar size={14} />
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Project Filter */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <Building size={14} />
              Project
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Projects</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <Filter size={14} />
              Log Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="PROJECT_CREATED">Project Created</option>
              <option value="ACTIVITY_UPDATE">Activity Updates</option>
              <option value="SUBACTIVITY_COMPLETED">Subactivity Completed</option>
              <option value="EXTENSION_REQUEST">Extension Requests</option>
              <option value="MANUAL_LOG">Manual Logs</option>
            </select>
          </div>

          {/* Search */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <Search size={14} />
              Search
            </label>
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => {
              const isExpanded = expandedLogs[log.id];
              
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`bg-white rounded-2xl shadow-lg border-2 ${getLogColor(log.type)} overflow-hidden`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {getLogIcon(log.type)}
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-800">{log.projectName}</h3>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                              {log.type?.replace(/_/g, ' ')}
                            </span>
                          </div>
                          
                          <p className="text-gray-600">{log.description}</p>
                          
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {new Date(log.date).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <User size={14} />
                              {log.user || 'System'}
                            </span>
                          </div>

                          {log.reason && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
                              <span className="font-medium">Reason:</span> {log.reason}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => setExpandedLogs({
                          ...expandedLogs,
                          [log.id]: !isExpanded
                        })}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && log.details && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 pt-4 border-t border-gray-200"
                        >
                          <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl">
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No logs found for the selected filters</p>
            </div>
          )}
        </AnimatePresence>
      </div>

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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project *</label>
                  <select
                    value={newLog.projectId}
                    onChange={(e) => setNewLog({...newLog, projectId: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                  >
                    <option value="">Select Project</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

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
                      placeholder="Reason for not working"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newLog.description}
                    onChange={(e) => setNewLog({...newLog, description: e.target.value})}
                    placeholder="Log description"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl"
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  Add Log
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DailyLogs;