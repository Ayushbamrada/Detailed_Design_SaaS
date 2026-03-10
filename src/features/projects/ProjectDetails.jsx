

// // export default ProjectDetails;
// import { useParams, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { motion } from "framer-motion";
// import { toggleSubActivity } from "./projectSlice";
// import { Calendar, ClipboardList } from "lucide-react";

// const ProjectDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { user } = useSelector((state) => state.auth);

//   const project = useSelector((state) =>
//     state.projects.projects.find((p) => p.id === id)
//   );

//   if (!project) {
//     return <div className="p-6">Project not found</div>;
//   }

//   const remaining = 100 - project.progress;

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="space-y-8"
//     >
//       {/* ===== HEADER ===== */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-3xl font-bold">{project.name}</h2>

//         <div className="flex gap-3">
//           <button
//             onClick={() =>
//               navigate(`/projects/${project.id}/logs`)
//             }
//             className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
//           >
//             View Logs
//           </button>

//           {(user.role === "ADMIN" ||
//             user.role === "SUPER_ADMIN") && (
//             <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition">
//               Extend Deadline
//             </button>
//           )}
//         </div>
//       </div>

//       {/* ===== SUMMARY CARD ===== */}
//       <motion.div
//         whileHover={{ scale: 1.02 }}
//         className="bg-white shadow-xl rounded-2xl p-8 grid md:grid-cols-2 gap-8"
//       >
//         <div className="space-y-4 text-sm">
//           <p><strong>Contractor:</strong> {project.contractor}</p>
//           <p><strong>Start Date:</strong> {project.startDate}</p>
//           <p><strong>Deadline:</strong> {project.deadline}</p>
//           <p>
//             <strong>Status:</strong>{" "}
//             <span
//               className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                 project.status === "DELAYED"
//                   ? "bg-red-100 text-red-600"
//                   : project.status === "COMPLETED"
//                   ? "bg-green-100 text-green-600"
//                   : "bg-blue-100 text-blue-600"
//               }`}
//             >
//               {project.status}
//             </span>
//           </p>
//         </div>

//         {/* Progress */}
//         <div>
//           <h4 className="font-semibold mb-3">Progress</h4>

//           <div className="flex justify-between text-sm mb-1">
//             <span>{project.progress}% Completed</span>
//             <span>{remaining}% Remaining</span>
//           </div>

//           <div className="w-full bg-gray-200 rounded-full h-4">
//             <motion.div
//               initial={{ width: 0 }}
//               animate={{ width: `${project.progress}%` }}
//               transition={{ duration: 1 }}
//               className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full"
//             />
//           </div>
//         </div>
//       </motion.div>

//       {/* ===== ACTIVITIES SECTION ===== */}
//       <div className="space-y-6">
//         <h3 className="text-xl font-semibold">
//           Activities & Sub-Activities
//         </h3>

//         {project.activities?.map((activity) => (
//           <motion.div
//             key={activity.id}
//             whileHover={{ scale: 1.01 }}
//             className="bg-white shadow-lg rounded-xl p-6"
//           >
//             <h4 className="font-semibold mb-4">
//               {activity.name}
//             </h4>

//             {activity.subActivities.map((sub) => (
//               <div
//                 key={sub.id}
//                 className="flex items-center justify-between mb-2"
//               >
//                 <div className="flex items-center gap-3">
//                   <input
//                     type="checkbox"
//                     checked={sub.completed}
//                     onChange={() =>
//                       dispatch(
//                         toggleSubActivity({
//                           projectId: project.id,
//                           activityId: activity.id,
//                           subId: sub.id,
//                         })
//                       )
//                     }
//                   />
//                   <span>{sub.name}</span>
//                 </div>

//                 {sub.completed && (
//                   <span className="text-green-600 text-xs">
//                     Completed
//                   </span>
//                 )}
//               </div>
//             ))}
//           </motion.div>
//         ))}
//       </div>
//     </motion.div>
//   );
// };

// export default ProjectDetails;

import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  updateSubActivityProgress, 
  updateSubActivityDates,
  updateActivityDates 
} from "./projectSlice";
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
  Save
} from "lucide-react";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const project = useSelector((state) =>
    state.projects.projects.find((p) => p.id === id)
  );

  const [expandedActivities, setExpandedActivities] = useState({});
  const [editingSubActivity, setEditingSubActivity] = useState(null);
  const [editValue, setEditValue] = useState(0);

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

  const remaining = 100 - (project.progress || 0);

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
      projectId: project.id,
      activityId,
      subId,
      completedQty: editValue
    }));
    setEditingSubActivity(null);
    setEditValue(0);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "COMPLETED": return "text-green-600 bg-green-100";
      case "DELAYED": return "text-red-600 bg-red-100";
      case "ONGOING": return "text-blue-600 bg-blue-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return "bg-green-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    if (progress >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDaysLeft = (endDate) => {
    if (!endDate) return null;
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto space-y-8 px-4 py-6"
    >
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">{project.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm text-gray-500">Code: {project.code}</span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span className="text-sm text-gray-500">Short Name: {project.shortName}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/projects/${project.id}/logs`)}
            className="bg-gray-800 text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition-all flex items-center gap-2 shadow-lg"
          >
            <ClipboardList size={18} />
            View Logs
          </motion.button>

          {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg"
            >
              <Calendar size={18} />
              Extend Deadline
            </motion.button>
          )}
        </div>
      </div>

      {/* ===== STATUS BANNER ===== */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`rounded-2xl p-4 flex items-center justify-between ${
          project.status === "DELAYED" ? "bg-red-50 border border-red-200" :
          project.status === "COMPLETED" ? "bg-green-50 border border-green-200" :
          "bg-blue-50 border border-blue-200"
        }`}
      >
        <div className="flex items-center gap-3">
          {project.status === "DELAYED" ? (
            <AlertCircle className="text-red-600" size={24} />
          ) : project.status === "COMPLETED" ? (
            <CheckCircle2 className="text-green-600" size={24} />
          ) : (
            <Clock className="text-blue-600" size={24} />
          )}
          <div>
            <p className="font-semibold">
              Project Status: <span className={
                project.status === "DELAYED" ? "text-red-600" :
                project.status === "COMPLETED" ? "text-green-600" :
                "text-blue-600"
              }>{project.status}</span>
            </p>
            <p className="text-sm text-gray-600">
              {project.status === "DELAYED" ? "Project is behind schedule" :
               project.status === "COMPLETED" ? "Project completed successfully" :
               "Project is on track"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Completion Date</p>
          <p className="font-semibold">{formatDate(project.completionDate)}</p>
        </div>
      </motion.div>

      {/* ===== SUMMARY CARD ===== */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white shadow-2xl rounded-3xl p-8 border border-gray-100"
      >
        <div className="grid md:grid-cols-2 gap-8">
          {/* LEFT DETAILS */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Building2 size={20} className="text-blue-600" />
              Project Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Company</p>
                <p className="font-medium text-gray-800">{project.company || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Sub Company</p>
                <p className="font-medium text-gray-800">{project.subCompany || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin size={12} /> Location
                </p>
                <p className="font-medium text-gray-800">{project.location || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Sector</p>
                <p className="font-medium text-gray-800">{project.sector || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Department</p>
                <p className="font-medium text-gray-800">{project.department || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Ruler size={12} /> Total Length
                </p>
                <p className="font-medium text-gray-800">{project.totalLength || "0"} km</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <IndianRupee size={12} /> Workorder Cost
                </p>
                <p className="font-medium text-gray-800">₹ {project.cost || "0"} Lakhs</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar size={12} /> LOA Date
                </p>
                <p className="font-medium text-gray-800">{formatDate(project.loaDate)}</p>
              </div>
            </div>

            {/* Additional Dates */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="font-semibold text-gray-700 mb-3">Key Milestones</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Director Proposal</p>
                  <p className="font-medium text-gray-800">{formatDate(project.directorProposalDate)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Project Confirmation</p>
                  <p className="font-medium text-gray-800">{formatDate(project.projectConfirmationDate)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PROGRESS */}
          <div className="border-l border-gray-100 pl-8">
            <h4 className="text-xl font-semibold text-gray-800 mb-6">Progress Overview</h4>
            
            <div className="space-y-6">
              {/* Main Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Overall Progress</span>
                  <span className="text-blue-600 font-bold">{project.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress || 0}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-4 rounded-full ${getProgressColor(project.progress || 0)}`}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{project.progress || 0}% Completed</span>
                  <span>{remaining}% Remaining</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500">Total Activities</p>
                  <p className="text-2xl font-bold text-gray-800">{project.activities?.length || 0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500">Sub Activities</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {project.activities?.reduce((acc, act) => acc + (act.subActivities?.length || 0), 0) || 0}
                  </p>
                </div>
              </div>

              {/* Status Tags */}
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                {project.extensionRequested && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-600">
                    Extension Requested
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ===== ACTIVITIES SECTION ===== */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <ClipboardList size={24} className="text-blue-600" />
          Activities & Sub-Activities
        </h3>

        {project.activities?.map((activity) => {
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
              <div
                onClick={() => toggleActivity(activity.id)}
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-800">{activity.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                        activityProgress === 100 ? "COMPLETED" : 
                        daysLeft < 0 ? "DELAYED" : "ONGOING"
                      )}`}>
                        {activityProgress === 100 ? "Completed" : 
                         daysLeft < 0 ? "Delayed" : "Ongoing"}
                      </span>
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
                      {daysLeft !== null && daysLeft > 0 && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <Clock size={14} />
                          <span>{daysLeft} days left</span>
                        </div>
                      )}
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
                    
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
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
                    <div className="p-6 space-y-4">
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
                                <div className="flex items-center gap-2 mb-2">
                                  <h5 className="font-medium text-gray-800">{sub.name}</h5>
                                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {sub.unit}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(sub.status || "PENDING")}`}>
                                    {sub.status || "PENDING"}
                                  </span>
                                </div>

                                {/* Sub Activity Dates */}
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                  <span>Start: {formatDate(sub.startDate)}</span>
                                  <span>End: {formatDate(sub.endDate)}</span>
                                  {subDaysLeft !== null && subDaysLeft > 0 && sub.status !== "COMPLETED" && (
                                    <span className="text-blue-600">{subDaysLeft} days left</span>
                                  )}
                                </div>

                                {/* Quantity Info */}
                                <div className="mt-2 text-sm">
                                  <span className="text-gray-600">Planned: {sub.plannedQty} {sub.unit}</span>
                                  <span className="mx-2">|</span>
                                  <span className="text-gray-600">Completed: {sub.completedQty || 0} {sub.unit}</span>
                                </div>
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
                                      className={`h-2 rounded-full ${getProgressColor(sub.progress || 0)}`}
                                    />
                                  </div>
                                </div>

                                {/* Edit Button or Input */}
                                {isEditing ? (
                                  <div className="flex items-center gap-2">
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
                                    <button
                                      onClick={() => handleProgressUpdate(activity.id, sub.id, sub.plannedQty)}
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
                                      setEditValue(sub.completedQty || 0);
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