// import { useParams, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { motion, AnimatePresence } from "framer-motion";
// import { useState, useEffect } from "react";
// import { 
//   updateSubActivityProgressLocally,
//   updateSubActivityStatusLocally,
//   addSubActivity,
//   deleteActivity,
//   deleteSubActivity,
//   extendActivityDeadline,
//   extendSubActivityDeadline
// } from "./projectSlice";
// import { showSnackbar } from "../notifications/notificationSlice";
// import ActivityExtensionModal from "./ActivityExtensionModal";
// import { 
//   updateSubActivityProgress as updateSubActivityProgressApi,
//   updateSubActivityStatus as updateSubActivityStatusApi,
//   updateActivityProgress,
//   updateProjectProgress
// } from "../api/apiSlice";
// import { 
//   Calendar, 
//   ClipboardList, 
//   ChevronDown, 
//   ChevronUp,
//   Clock,
//   MapPin,
//   Building2,
//   IndianRupee,
//   Ruler,
//   AlertCircle,
//   CheckCircle2,
//   XCircle,
//   PenLine,
//   Save,
//   Plus,
//   Trash2,
//   ArrowLeft,
//   FileText,
//   Info,
//   Loader2
// } from "lucide-react";

// // Helper function to calculate days until deadline
// const getDaysUntilDeadline = (deadline) => {
//   if (!deadline) return null;
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   const deadlineDate = new Date(deadline);
//   deadlineDate.setHours(0, 0, 0, 0);
  
//   const diffTime = deadlineDate - today;
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   return diffDays;
// };

// // Get deadline status
// const getDeadlineStatus = (deadline) => {
//   const days = getDaysUntilDeadline(deadline);
//   if (days === null) return "UNKNOWN";
//   if (days < 0) return "OVERDUE";
//   if (days === 0) return "TODAY";
//   if (days <= 2) return "CRITICAL";
//   if (days <= 7) return "WARNING";
//   if (days <= 14) return "UPCOMING";
//   return "SAFE";
// };

// const UserProjectDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { user } = useSelector((state) => state.auth);
//   const project = useSelector((state) =>
//     state.projects.projects.find((p) => p.id === id)
//   );

//   const [expandedActivities, setExpandedActivities] = useState({});
//   const [editingSubActivity, setEditingSubActivity] = useState(null);
//   const [editValue, setEditValue] = useState(0);
//   const [showAddSubModal, setShowAddSubModal] = useState(false);
//   const [selectedActivityForSub, setSelectedActivityForSub] = useState(null);
//   const [showActivityExtensionModal, setShowActivityExtensionModal] = useState(false);
//   const [selectedActivityForExtension, setSelectedActivityForExtension] = useState(null);
//   const [showSubActivityExtensionModal, setShowSubActivityExtensionModal] = useState(false);
//   const [selectedSubActivityForExtension, setSelectedSubActivityForExtension] = useState(null);
//   const [newSubActivity, setNewSubActivity] = useState({
//     name: "",
//     unit: "Km",
//     plannedQty: 0
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     if (project) {
//       console.log("Project loaded:", project);
//     }
//   }, [project]);

//   // Check if user has access to this project
//   const hasAccess = 
//     user?.role === "SUPER_ADMIN" || 
//     user?.role === "ADMIN" || 
//     project?.assignedUsers?.includes(user?.id) ||
//     project?.createdBy === user?.id;

//   useEffect(() => {
//     if (project && !hasAccess && user?.role === "USER") {
//       dispatch(showSnackbar({
//         message: "You don't have access to this project",
//         type: "error"
//       }));
//       navigate("/dashboard");
//     }
//   }, [project, hasAccess, user, navigate, dispatch]);

//   if (!project) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <XCircle size={48} className="text-red-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-800">Project not found</h2>
//           <p className="text-gray-600 mb-4">Project ID: {id}</p>
//           <button
//             onClick={() => navigate("/projects")}
//             className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Back to Projects
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const remaining = 100 - (project.progress || 0);

//   const toggleActivity = (activityId) => {
//     setExpandedActivities({
//       ...expandedActivities,
//       [activityId]: !expandedActivities[activityId]
//     });
//   };

//   const handleProgressUpdate = async (activityId, subId, maxQty) => {
//     if (editValue > maxQty) {
//       dispatch(showSnackbar({
//         message: `Completed quantity cannot exceed planned quantity (${maxQty})`,
//         type: "error"
//       }));
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       // Find the sub-activity to get its current data
//       const activity = project.activities.find(a => a.id === activityId);
//       const subActivity = activity?.subActivities?.find(s => s.id === subId);
      
//       if (!subActivity) {
//         throw new Error("Sub-activity not found");
//       }

//       // Calculate progress percentage
//       const progress = Math.round((editValue / maxQty) * 100);
      
//       // Determine status based on progress
//       let status = subActivity.status;
//       if (progress === 100) {
//         status = "COMPLETED";
//       } else if (progress > 0 && progress < 100) {
//         status = "ONGOING";
//       } else if (progress === 0) {
//         status = "PENDING";
//       }
      
//       // Prepare update data for sub-activity
//       const subUpdateData = {
//         completed_quantity: editValue,
//         progress: progress,
//         status: status
//       };

//       console.log("Updating sub-activity progress:", { subId, subUpdateData });

//       // STEP 1: Update the sub-activity in backend
//       const updatedSub = await dispatch(updateSubActivityProgressApi({
//         subActivityId: subId,
//         progressData: subUpdateData
//       })).unwrap();

//       console.log("Sub-activity updated successfully:", updatedSub);
      
//       // STEP 2: Recalculate activity progress based on all sub-activities
//       const allSubs = activity.subActivities || [];
//       const totalSubProgress = allSubs.reduce((sum, sub) => {
//         // Use the updated sub's progress if it's the one we just updated
//         if (sub.id === subId) {
//           return sum + progress;
//         }
//         return sum + (sub.progress || 0);
//       }, 0);
      
//       const activityProgress = Math.round((totalSubProgress / allSubs.length) * 10) / 10;
      
//       // Determine activity status
//       let activityStatus = "ONGOING";
//       if (activityProgress === 100) {
//         activityStatus = "COMPLETED";
//       } else if (activityProgress === 0) {
//         activityStatus = "PENDING";
//       }
      
//       // STEP 3: Update activity progress in backend
//       if (activityProgress !== (activity.progress || 0)) {
//         await dispatch(updateActivityProgress({
//           activityId: activity.id,
//           progressData: {
//             progress: activityProgress,
//             status: activityStatus
//           }
//         })).unwrap();
//       }
      
//       // STEP 4: Recalculate project progress
//       const allActivities = project.activities || [];
//       const totalActivityProgress = allActivities.reduce((sum, act) => {
//         if (act.id === activity.id) {
//           return sum + activityProgress;
//         }
//         return sum + (act.progress || 0);
//       }, 0);
      
//       const projectProgress = Math.round((totalActivityProgress / allActivities.length) * 10) / 10;
      
//       // Determine project status
//       const completionDate = project.completionDate;
//       let projectStatus = "ONGOING";
//       if (projectProgress === 100) {
//         projectStatus = "COMPLETED";
//       } else if (projectProgress < 100 && completionDate && new Date(completionDate) < new Date()) {
//         projectStatus = "DELAYED";
//       }
      
//       // STEP 5: Update project progress in backend
//       await dispatch(updateProjectProgress({
//         projectId: project.id,
//         progressData: {
//           progress: projectProgress,
//           status: projectStatus
//         }
//       })).unwrap();
      
//       // STEP 6: Update local state
//       dispatch(updateSubActivityProgressLocally({
//         projectId: project.id,
//         activityId,
//         subId,
//         completedQty: editValue,
//         progress,
//         status
//       }));
      
//       dispatch(showSnackbar({
//         message: "Progress updated successfully",
//         type: "success"
//       }));
      
//       setEditingSubActivity(null);
//       setEditValue(0);
//     } catch (error) {
//       console.error("Error updating progress:", error);
//       dispatch(showSnackbar({
//         message: error.response?.data?.message || error.message || "Failed to update progress",
//         type: "error"
//       }));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleStatusUpdate = async (activityId, subId, status) => {
//     setIsSubmitting(true);

//     try {
//       // Find the sub-activity to get its current data
//       const activity = project.activities.find(a => a.id === activityId);
//       const subActivity = activity?.subActivities?.find(s => s.id === subId);
      
//       if (!subActivity) {
//         throw new Error("Sub-activity not found");
//       }

//       // Calculate progress based on status for status-based items
//       let progress = subActivity.progress || 0;
//       if (subActivity.unit === "status") {
//         const statusProgress = {
//           "PENDING": 0,
//           "ONGOING": 50,
//           "COMPLETED": 100,
//           "DELAYED": 25,
//           "HOLD": 10
//         };
//         progress = statusProgress[status] || 0;
//       }
      
//       // Prepare update data
//       const updateData = {
//         status: status,
//         progress: progress
//       };

//       console.log("Updating sub-activity status:", { subId, updateData });

//       // STEP 1: Update the sub-activity in backend
//       const updatedSub = await dispatch(updateSubActivityStatusApi({
//         subActivityId: subId,
//         statusData: updateData
//       })).unwrap();

//       console.log("Sub-activity status updated successfully:", updatedSub);
      
//       // STEP 2: Recalculate activity progress based on all sub-activities
//       const allSubs = activity.subActivities || [];
//       const totalSubProgress = allSubs.reduce((sum, sub) => {
//         if (sub.id === subId) {
//           return sum + progress;
//         }
//         return sum + (sub.progress || 0);
//       }, 0);
      
//       const activityProgress = Math.round((totalSubProgress / allSubs.length) * 10) / 10;
      
//       // Determine activity status
//       let activityStatus = "ONGOING";
//       if (activityProgress === 100) {
//         activityStatus = "COMPLETED";
//       } else if (activityProgress === 0) {
//         activityStatus = "PENDING";
//       }
      
//       // STEP 3: Update activity progress in backend if needed
//       if (activityProgress !== (activity.progress || 0)) {
//         await dispatch(updateActivityProgress({
//           activityId: activity.id,
//           progressData: {
//             progress: activityProgress,
//             status: activityStatus
//           }
//         })).unwrap();
//       }
      
//       // STEP 4: Recalculate project progress
//       const allActivities = project.activities || [];
//       const totalActivityProgress = allActivities.reduce((sum, act) => {
//         if (act.id === activity.id) {
//           return sum + activityProgress;
//         }
//         return sum + (act.progress || 0);
//       }, 0);
      
//       const projectProgress = Math.round((totalActivityProgress / allActivities.length) * 10) / 10;
      
//       // Determine project status
//       const completionDate = project.completionDate;
//       let projectStatus = "ONGOING";
//       if (projectProgress === 100) {
//         projectStatus = "COMPLETED";
//       } else if (projectProgress < 100 && completionDate && new Date(completionDate) < new Date()) {
//         projectStatus = "DELAYED";
//       }
      
//       // STEP 5: Update project progress in backend
//       await dispatch(updateProjectProgress({
//         projectId: project.id,
//         progressData: {
//           progress: projectProgress,
//           status: projectStatus
//         }
//       })).unwrap();
      
//       // STEP 6: Update local state
//       dispatch(updateSubActivityStatusLocally({
//         projectId: project.id,
//         activityId,
//         subId,
//         status,
//         progress
//       }));
      
//       dispatch(showSnackbar({
//         message: `Status updated to ${status}`,
//         type: "success"
//       }));
//     } catch (error) {
//       console.error("Error updating status:", error);
//       dispatch(showSnackbar({
//         message: error.response?.data?.message || error.message || "Failed to update status",
//         type: "error"
//       }));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleAddSubActivity = (e) => {
//     e.preventDefault();
    
//     if (!newSubActivity.name.trim()) {
//       alert("Please enter sub-activity name");
//       return;
//     }

//     if (newSubActivity.unit !== "status" && (!newSubActivity.plannedQty || newSubActivity.plannedQty <= 0)) {
//       alert("Please enter planned quantity");
//       return;
//     }

//     const activity = project.activities.find(a => a.id === selectedActivityForSub);
    
//     dispatch(addSubActivity({
//       projectId: project.id,
//       activityId: selectedActivityForSub,
//       subActivity: {
//         name: newSubActivity.name,
//         unit: newSubActivity.unit,
//         plannedQty: newSubActivity.unit !== "status" ? newSubActivity.plannedQty : 1,
//         startDate: activity?.startDate,
//         endDate: activity?.endDate
//       }
//     }));

//     dispatch(showSnackbar({
//       message: "Sub-activity added successfully",
//       type: "success"
//     }));

//     setShowAddSubModal(false);
//     setNewSubActivity({
//       name: "",
//       unit: "Km",
//       plannedQty: 0
//     });
//   };

//   const handleExtendActivity = (activityId, newDate, reason) => {
//     dispatch(extendActivityDeadline({
//       projectId: project.id,
//       activityId,
//       newEndDate: newDate,
//       reason,
//       extendedBy: user?.name
//     }));

//     dispatch(showSnackbar({
//       message: "Activity deadline extended successfully",
//       type: "success"
//     }));

//     setShowActivityExtensionModal(false);
//     setSelectedActivityForExtension(null);
//   };

//   const handleExtendSubActivity = (activityId, subId, newDate, reason) => {
//     dispatch(extendSubActivityDeadline({
//       projectId: project.id,
//       activityId,
//       subId,
//       newEndDate: newDate,
//       reason,
//       extendedBy: user?.name
//     }));

//     dispatch(showSnackbar({
//       message: "Sub-activity deadline extended successfully",
//       type: "success"
//     }));

//     setShowSubActivityExtensionModal(false);
//     setSelectedSubActivityForExtension(null);
//   };

//   const handleDeleteActivity = (activityId, activityName) => {
//     if (user?.role !== "SUPER_ADMIN") {
//       dispatch(showSnackbar({
//         message: "Only Super Admin can delete activities",
//         type: "error"
//       }));
//       return;
//     }

//     if (window.confirm(`Are you sure you want to delete activity "${activityName}"?`)) {
//       dispatch(deleteActivity({
//         projectId: project.id,
//         activityId
//       }));

//       dispatch(showSnackbar({
//         message: "Activity deleted successfully",
//         type: "success"
//       }));
//     }
//   };

//   const handleDeleteSubActivity = (activityId, subId, subName) => {
//     if (user?.role !== "SUPER_ADMIN") {
//       dispatch(showSnackbar({
//         message: "Only Super Admin can delete sub-activities",
//         type: "error"
//       }));
//       return;
//     }

//     if (window.confirm(`Are you sure you want to delete sub-activity "${subName}"?`)) {
//       dispatch(deleteSubActivity({
//         projectId: project.id,
//         activityId,
//         subId
//       }));

//       dispatch(showSnackbar({
//         message: "Sub-activity deleted successfully",
//         type: "success"
//       }));
//     }
//   };

//   const getStatusColor = (status) => {
//     switch(status) {
//       case "COMPLETED": return "bg-green-100 text-green-600 border-green-200";
//       case "ONGOING": return "bg-blue-100 text-blue-600 border-blue-200";
//       case "DELAYED": return "bg-red-100 text-red-600 border-red-200";
//       case "HOLD": return "bg-yellow-100 text-yellow-600 border-yellow-200";
//       case "PENDING": return "bg-gray-100 text-gray-600 border-gray-200";
//       default: return "bg-gray-100 text-gray-600";
//     }
//   };

//   const getProgressColor = (progress) => {
//     if (progress === 100) return "bg-green-500";
//     if (progress >= 75) return "bg-blue-500";
//     if (progress >= 50) return "bg-yellow-500";
//     if (progress >= 25) return "bg-orange-500";
//     return "bg-red-500";
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "Not set";
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const calculateDaysLeft = (endDate) => {
//     if (!endDate) return null;
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const end = new Date(endDate);
//     end.setHours(0, 0, 0, 0);
//     const diffTime = end - today;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays;
//   };

//   const getDeadlineBadge = (endDate) => {
//     const days = calculateDaysLeft(endDate);
//     if (days === null) return null;
//     if (days < 0) return <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">Overdue</span>;
//     if (days === 0) return <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">Due Today</span>;
//     if (days <= 2) return <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full">{days} days left</span>;
//     if (days <= 7) return <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full">{days} days left</span>;
//     return <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">{days} days left</span>;
//   };

//   if (isSubmitting) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="bg-white rounded-2xl p-8 shadow-xl flex items-center gap-4">
//           <Loader2 className="animate-spin text-blue-600" size={32} />
//           <div>
//             <p className="text-lg font-semibold text-gray-800">Updating Progress</p>
//             <p className="text-sm text-gray-500">Please wait...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="max-w-7xl mx-auto space-y-8 px-4 py-6"
//     >
//       {/* Activity Extension Modal */}
//       <ActivityExtensionModal
//         isOpen={showActivityExtensionModal}
//         onClose={() => {
//           setShowActivityExtensionModal(false);
//           setSelectedActivityForExtension(null);
//         }}
//         onSubmit={({ newDate, reason }) => handleExtendActivity(selectedActivityForExtension, newDate, reason)}
//         item={project.activities?.find(a => a.id === selectedActivityForExtension)}
//         itemType="activity"
//       />

//       {/* Sub-Activity Extension Modal */}
//       <ActivityExtensionModal
//         isOpen={showSubActivityExtensionModal}
//         onClose={() => {
//           setShowSubActivityExtensionModal(false);
//           setSelectedSubActivityForExtension(null);
//         }}
//         onSubmit={({ newDate, reason }) => {
//           const sub = project.activities
//             .find(a => a.id === selectedSubActivityForExtension?.activityId)
//             ?.subActivities.find(s => s.id === selectedSubActivityForExtension?.subId);
//           handleExtendSubActivity(
//             selectedSubActivityForExtension.activityId,
//             selectedSubActivityForExtension.subId,
//             newDate,
//             reason
//           );
//         }}
//         item={{
//           name: selectedSubActivityForExtension?.subName,
//           endDate: selectedSubActivityForExtension?.endDate,
//           parentActivity: selectedSubActivityForExtension?.activityName
//         }}
//         itemType="subactivity"
//       />

//       {/* Add Sub-Activity Modal */}
//       <AnimatePresence>
//         {showAddSubModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//             onClick={() => setShowAddSubModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.9 }}
//               className="bg-white rounded-2xl p-6 max-w-md w-full"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <form onSubmit={handleAddSubActivity}>
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-xl font-bold">Add Sub-Activity</h3>
//                   <button
//                     type="button"
//                     onClick={() => setShowAddSubModal(false)}
//                     className="p-1 hover:bg-gray-100 rounded-lg"
//                   >
//                     <XCircle size={20} />
//                   </button>
//                 </div>
                
//                 <div className="space-y-4">
//                   <input
//                     type="text"
//                     placeholder="Sub-activity name"
//                     value={newSubActivity.name}
//                     onChange={(e) => setNewSubActivity({...newSubActivity, name: e.target.value})}
//                     className="w-full p-3 border rounded-xl"
//                     required
//                   />
                  
//                   <select
//                     value={newSubActivity.unit}
//                     onChange={(e) => setNewSubActivity({...newSubActivity, unit: e.target.value})}
//                     className="w-full p-3 border rounded-xl"
//                   >
//                     <option value="Km">Kilometer (Km) - Track by distance</option>
//                     <option value="Nos.">Numbers (Nos.) - Track by count</option>
//                     <option value="Percentage">Percentage (%) - Track by completion %</option>
//                     <option value="status">Status Based - Track by status (Pending/Ongoing/Completed)</option>
//                   </select>
                  
//                   {newSubActivity.unit === "Percentage" ? (
//                     <div className="space-y-2">
//                       <input
//                         type="number"
//                         placeholder="Target percentage (e.g., 100)"
//                         value={newSubActivity.plannedQty}
//                         onChange={(e) => setNewSubActivity({...newSubActivity, plannedQty: parseFloat(e.target.value)})}
//                         className="w-full p-3 border rounded-xl"
//                         min="0"
//                         max="100"
//                         step="1"
//                         required
//                       />
//                       <p className="text-xs text-gray-500 flex items-center gap-1">
//                         <Info size={12} />
//                         Progress will be tracked as percentage complete. Target is typically 100%.
//                       </p>
//                     </div>
//                   ) : newSubActivity.unit !== "status" ? (
//                     <input
//                       type="number"
//                       placeholder="Planned quantity"
//                       value={newSubActivity.plannedQty}
//                       onChange={(e) => setNewSubActivity({...newSubActivity, plannedQty: parseFloat(e.target.value)})}
//                       className="w-full p-3 border rounded-xl"
//                       min="0"
//                       step="0.01"
//                       required
//                     />
//                   ) : (
//                     <div className="p-3 bg-blue-50 rounded-xl text-sm text-blue-600 flex items-center gap-2">
//                       <Info size={16} />
//                       Status-based tracking - No quantity needed. Will track as Pending, Ongoing, Completed, etc.
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="flex justify-end gap-2 mt-6">
//                   <button
//                     type="button"
//                     onClick={() => setShowAddSubModal(false)}
//                     className="px-4 py-2 border rounded-lg hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                   >
//                     Add Sub-Activity
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate("/projects")}
//             className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
//           >
//             <ArrowLeft size={20} />
//           </button>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">{project.name}</h1>
//             <p className="text-sm text-gray-500">Code: {project.code} | Short Name: {project.shortName}</p>
//           </div>
//         </div>

//         <div className="flex gap-3">
//           <button
//             onClick={() => navigate(`/projects/${project.id}/logs`)}
//             className="bg-gray-800 text-white px-4 py-2 rounded-xl hover:bg-gray-900 transition-all flex items-center gap-2"
//           >
//             <FileText size={18} />
//             View Logs
//           </button>

//           {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN" || project.assignedUsers?.includes(user?.id)) && (
//             <button
//               onClick={() => navigate(`/projects/${project.id}/extend`)}
//               className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2"
//             >
//               <Calendar size={18} />
//               Extend Project Deadline
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Status Banner */}
//       <motion.div
//         initial={{ y: -20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         className={`rounded-2xl p-4 flex items-center justify-between ${
//           project.status === "DELAYED" ? "bg-red-50 border border-red-200" :
//           project.status === "COMPLETED" ? "bg-green-50 border border-green-200" :
//           "bg-blue-50 border border-blue-200"
//         }`}
//       >
//         <div className="flex items-center gap-3">
//           {project.status === "DELAYED" ? (
//             <AlertCircle className="text-red-600" size={24} />
//           ) : project.status === "COMPLETED" ? (
//             <CheckCircle2 className="text-green-600" size={24} />
//           ) : (
//             <Clock className="text-blue-600" size={24} />
//           )}
//           <div>
//             <p className="font-semibold">
//               Project Status: <span className={
//                 project.status === "DELAYED" ? "text-red-600" :
//                 project.status === "COMPLETED" ? "text-green-600" :
//                 "text-blue-600"
//               }>{project.status}</span>
//             </p>
//             <p className="text-sm text-gray-600">
//               {getDeadlineStatus(project.completionDate) === "OVERDUE" ? "Project is overdue" :
//                getDeadlineStatus(project.completionDate) === "TODAY" ? "Project due today!" :
//                getDeadlineStatus(project.completionDate) === "CRITICAL" ? "Project deadline critical" :
//                project.status === "COMPLETED" ? "Project completed successfully" :
//                "Project is on track"}
//             </p>
//           </div>
//         </div>
//         <div className="text-right">
//           <p className="text-sm text-gray-600">Completion Date</p>
//           <p className="font-semibold">{formatDate(project.completionDate)}</p>
//           {getDeadlineBadge(project.completionDate)}
//         </div>
//       </motion.div>

//       {/* Summary Card */}
//       <motion.div
//         whileHover={{ scale: 1.01 }}
//         className="bg-white shadow-2xl rounded-3xl p-8 border border-gray-100"
//       >
//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Left Details */}
//           <div className="space-y-4">
//             <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
//               <Building2 size={20} className="text-blue-600" />
//               Project Details
//             </h3>
            
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-1">
//                 <p className="text-xs text-gray-500">Company</p>
//                 <p className="font-medium text-gray-800">{project.company || "—"}</p>
//               </div>
//               <div className="space-y-1">
//                 <p className="text-xs text-gray-500">Sub Company</p>
//                 <p className="font-medium text-gray-800">{project.subCompany || "—"}</p>
//               </div>
//               <div className="space-y-1">
//                 <p className="text-xs text-gray-500 flex items-center gap-1">
//                   <MapPin size={12} /> Location
//                 </p>
//                 <p className="font-medium text-gray-800">{project.location || "—"}</p>
//               </div>
//               <div className="space-y-1">
//                 <p className="text-xs text-gray-500">Sector</p>
//                 <p className="font-medium text-gray-800">{project.sector || "—"}</p>
//               </div>
//               <div className="space-y-1">
//                 <p className="text-xs text-gray-500">Department</p>
//                 <p className="font-medium text-gray-800">{project.department || "—"}</p>
//               </div>
//               <div className="space-y-1">
//                 <p className="text-xs text-gray-500 flex items-center gap-1">
//                   <Ruler size={12} /> Total Length
//                 </p>
//                 <p className="font-medium text-gray-800">{project.totalLength || "0"} km</p>
//               </div>
//               <div className="space-y-1">
//                 <p className="text-xs text-gray-500 flex items-center gap-1">
//                   <IndianRupee size={12} /> Workorder Cost
//                 </p>
//                 <p className="font-medium text-gray-800">₹ {project.cost || "0"} Lakhs</p>
//               </div>
//               <div className="space-y-1">
//                 <p className="text-xs text-gray-500 flex items-center gap-1">
//                   <Calendar size={12} /> LOA Date
//                 </p>
//                 <p className="font-medium text-gray-800">{formatDate(project.loaDate)}</p>
//               </div>
//             </div>

//             {/* Additional Dates */}
//             <div className="mt-6 pt-6 border-t border-gray-100">
//               <h4 className="font-semibold text-gray-700 mb-3">Key Milestones</h4>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-1">
//                   <p className="text-xs text-gray-500">Director Proposal</p>
//                   <p className="font-medium text-gray-800">{formatDate(project.directorProposalDate)}</p>
//                 </div>
//                 <div className="space-y-1">
//                   <p className="text-xs text-gray-500">Project Confirmation</p>
//                   <p className="font-medium text-gray-800">{formatDate(project.projectConfirmationDate)}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Progress */}
//           <div className="border-l border-gray-100 pl-8">
//             <h4 className="text-xl font-semibold text-gray-800 mb-6">Progress Overview</h4>
            
//             <div className="space-y-6">
//               {/* Main Progress Bar */}
//               <div>
//                 <div className="flex justify-between text-sm mb-2">
//                   <span className="font-medium">Overall Progress</span>
//                   <span className="text-blue-600 font-bold">{project.progress || 0}%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
//                   <motion.div
//                     initial={{ width: 0 }}
//                     animate={{ width: `${project.progress || 0}%` }}
//                     transition={{ duration: 1, ease: "easeOut" }}
//                     className={`h-4 rounded-full ${getProgressColor(project.progress || 0)}`}
//                   />
//                 </div>
//                 <div className="flex justify-between text-xs text-gray-500 mt-1">
//                   <span>{project.progress || 0}% Completed</span>
//                   <span>{remaining}% Remaining</span>
//                 </div>
//               </div>

//               {/* Stats */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="bg-gray-50 p-4 rounded-xl">
//                   <p className="text-xs text-gray-500">Total Activities</p>
//                   <p className="text-2xl font-bold text-gray-800">{project.activities?.length || 0}</p>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded-xl">
//                   <p className="text-xs text-gray-500">Sub Activities</p>
//                   <p className="text-2xl font-bold text-gray-800">
//                     {project.activities?.reduce((acc, act) => acc + (act.subActivities?.length || 0), 0) || 0}
//                   </p>
//                 </div>
//               </div>

//               {/* Status Tags */}
//               <div className="flex flex-wrap gap-2">
//                 <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
//                   {project.status}
//                 </span>
//                 {project.extensionRequested && (
//                   <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-600">
//                     Extension Requested
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </motion.div>

//       {/* Activities Section */}
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
//             <ClipboardList size={24} className="text-blue-600" />
//             Activities & Sub-Activities
//           </h3>
//         </div>

//         {project.activities?.map((activity) => {
//           const isExpanded = expandedActivities[activity.id];
//           const activityProgress = activity.progress || 0;
//           const daysLeft = calculateDaysLeft(activity.endDate);

//           return (
//             <motion.div
//               key={activity.id}
//               layout
//               className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100"
//             >
//               {/* Activity Header */}
//               <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
//                 <div className="flex items-center justify-between">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-2">
//                       <h4 className="text-lg font-semibold text-gray-800">{activity.name}</h4>
//                       <span className={`text-xs px-2 py-1 rounded-full ${
//                         activityProgress === 100 ? "bg-green-100 text-green-600" : 
//                         daysLeft < 0 ? "bg-red-100 text-red-600" : 
//                         "bg-blue-100 text-blue-600"
//                       }`}>
//                         {activityProgress === 100 ? "Completed" : 
//                          daysLeft < 0 ? "Delayed" : "Ongoing"}
//                       </span>
                      
//                       {/* Activity Extension Button - Only for admins */}
//                       {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
//                         <button
//                           onClick={() => {
//                             setSelectedActivityForExtension(activity.id);
//                             setShowActivityExtensionModal(true);
//                           }}
//                           className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ml-2"
//                           title="Extend activity deadline"
//                         >
//                           <Calendar size={16} />
//                         </button>
//                       )}
                      
//                       {user?.role === "SUPER_ADMIN" && (
//                         <button
//                           onClick={() => handleDeleteActivity(activity.id, activity.name)}
//                           className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                           title="Delete activity"
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       )}
//                     </div>

//                     {/* Activity Dates */}
//                     <div className="flex items-center gap-4 text-sm text-gray-500">
//                       <div className="flex items-center gap-1">
//                         <Calendar size={14} />
//                         <span>Start: {formatDate(activity.startDate)}</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Calendar size={14} />
//                         <span>End: {formatDate(activity.endDate)}</span>
//                       </div>
//                       {getDeadlineBadge(activity.endDate)}
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-6">
//                     {/* Activity Progress */}
//                     <div className="w-32">
//                       <div className="flex justify-between text-xs mb-1">
//                         <span>Progress</span>
//                         <span className="font-bold">{activityProgress}%</span>
//                       </div>
//                       <div className="w-full bg-gray-200 rounded-full h-2">
//                         <motion.div
//                           initial={{ width: 0 }}
//                           animate={{ width: `${activityProgress}%` }}
//                           className={`h-2 rounded-full ${getProgressColor(activityProgress)}`}
//                         />
//                       </div>
//                     </div>
                    
//                     <div className="text-sm text-gray-500">
//                       {activity.subActivities?.length || 0} sub-activities
//                     </div>
                    
//                     <button
//                       onClick={() => toggleActivity(activity.id)}
//                       className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                     >
//                       {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Expanded Sub Activities */}
//               <AnimatePresence>
//                 {isExpanded && (
//                   <motion.div
//                     initial={{ height: 0, opacity: 0 }}
//                     animate={{ height: "auto", opacity: 1 }}
//                     exit={{ height: 0, opacity: 0 }}
//                     className="border-t border-gray-100 bg-gray-50"
//                   >
//                     <div className="p-6">
//                       {/* Add Sub-Activity Button - Only for admins */}
//                       {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
//                         <div className="mb-4 flex justify-end">
//                           <button
//                             onClick={() => {
//                               setSelectedActivityForSub(activity.id);
//                               setShowAddSubModal(true);
//                             }}
//                             className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-1"
//                           >
//                             <Plus size={16} />
//                             Add Sub-Activity
//                           </button>
//                         </div>
//                       )}

//                       {/* Sub Activities List */}
//                       <div className="space-y-4">
//                         {activity.subActivities?.map((sub) => {
//                           const subDaysLeft = calculateDaysLeft(sub.endDate);
//                           const isEditing = editingSubActivity === sub.id;
                          
//                           return (
//                             <div
//                               key={sub.id}
//                               className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
//                             >
//                               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                                 {/* Sub Activity Info */}
//                                 <div className="flex-1">
//                                   <div className="flex items-center gap-2 mb-2 flex-wrap">
//                                     <h5 className="font-medium text-gray-800">{sub.name}</h5>
//                                     <span className="text-xs bg-gray-100 px-2 py-1 rounded">
//                                       {sub.unit === "status" ? "Status Based" : sub.unit}
//                                     </span>
                                    
//                                     {/* Status Dropdown for status-based items */}
//                                     {sub.unit === "status" ? (
//                                       <select
//                                         value={sub.status || "PENDING"}
//                                         onChange={(e) => {
//                                           handleStatusUpdate(activity.id, sub.id, e.target.value);
//                                         }}
//                                         className={`text-xs px-2 py-1 rounded-full border font-semibold ${getStatusColor(sub.status)}`}
//                                       >
//                                         <option value="PENDING">Pending</option>
//                                         <option value="ONGOING">Ongoing</option>
//                                         <option value="COMPLETED">Completed</option>
//                                         <option value="DELAYED">Delayed</option>
//                                         <option value="HOLD">On Hold</option>
//                                       </select>
//                                     ) : (
//                                       <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(sub.status)}`}>
//                                         {sub.status || "PENDING"}
//                                       </span>
//                                     )}

//                                     {/* Sub-Activity Extension Button - Only for admins */}
//                                     {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
//                                       <button
//                                         onClick={() => {
//                                           setSelectedSubActivityForExtension({
//                                             activityId: activity.id,
//                                             activityName: activity.name,
//                                             subId: sub.id,
//                                             subName: sub.name,
//                                             endDate: sub.endDate
//                                           });
//                                           setShowSubActivityExtensionModal(true);
//                                         }}
//                                         className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                                         title="Extend sub-activity deadline"
//                                       >
//                                         <Calendar size={14} />
//                                       </button>
//                                     )}

//                                     {user?.role === "SUPER_ADMIN" && (
//                                       <button
//                                         onClick={() => handleDeleteSubActivity(activity.id, sub.id, sub.name)}
//                                         className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                                         title="Delete sub-activity"
//                                       >
//                                         <Trash2 size={14} />
//                                       </button>
//                                     )}
//                                   </div>

//                                   {/* Sub Activity Dates */}
//                                   <div className="flex items-center gap-3 text-xs text-gray-500">
//                                     <span>Start: {formatDate(sub.startDate)}</span>
//                                     <span>End: {formatDate(sub.endDate)}</span>
//                                     {subDaysLeft !== null && subDaysLeft > 0 && sub.status !== "COMPLETED" && (
//                                       <span className={`${
//                                         subDaysLeft <= 2 ? "text-red-600 font-semibold" : 
//                                         subDaysLeft <= 7 ? "text-yellow-600" : "text-blue-600"
//                                       }`}>
//                                         {subDaysLeft} days left
//                                       </span>
//                                     )}
//                                   </div>

//                                   {/* Quantity Info - Only show for non-status units */}
//                                   {sub.unit !== "status" && (
//                                     <div className="mt-2 text-sm">
//                                       <span className="text-gray-600">Planned: {sub.plannedQty} {sub.unit}</span>
//                                       <span className="mx-2">|</span>
//                                       <span className="text-gray-600">Completed: {sub.completedQty || 0} {sub.unit}</span>
//                                     </div>
//                                   )}
//                                 </div>

//                                 {/* Progress and Edit */}
//                                 <div className="flex items-center gap-4">
//                                   {/* Progress Bar */}
//                                   <div className="w-32">
//                                     <div className="flex justify-between text-xs mb-1">
//                                       <span>Progress</span>
//                                       <span className="font-bold">{sub.progress || 0}%</span>
//                                     </div>
//                                     <div className="w-full bg-gray-200 rounded-full h-2">
//                                       <motion.div
//                                         initial={{ width: 0 }}
//                                         animate={{ width: `${sub.progress || 0}%` }}
//                                         className={`h-2 rounded-full ${
//                                           sub.progress === 100 ? "bg-green-500" :
//                                           sub.progress >= 75 ? "bg-blue-500" :
//                                           sub.progress >= 50 ? "bg-yellow-500" :
//                                           sub.progress >= 25 ? "bg-orange-500" :
//                                           "bg-red-500"
//                                         }`}
//                                       />
//                                     </div>
//                                   </div>

//                                   {/* Edit Button or Input */}
//                                   {isEditing ? (
//                                     <div className="flex items-center gap-2">
//                                       {sub.unit !== "status" ? (
//                                         <input
//                                           type="number"
//                                           value={editValue}
//                                           onChange={(e) => setEditValue(parseFloat(e.target.value) || 0)}
//                                           className="w-20 px-2 py-1 border rounded text-sm"
//                                           min="0"
//                                           max={sub.plannedQty}
//                                           step="0.01"
//                                           autoFocus
//                                         />
//                                       ) : (
//                                         <select
//                                           value={editValue}
//                                           onChange={(e) => setEditValue(e.target.value)}
//                                           className="w-24 px-2 py-1 border rounded text-sm"
//                                           autoFocus
//                                         >
//                                           <option value="PENDING">Pending</option>
//                                           <option value="ONGOING">Ongoing</option>
//                                           <option value="COMPLETED">Completed</option>
//                                           <option value="DELAYED">Delayed</option>
//                                           <option value="HOLD">Hold</option>
//                                         </select>
//                                       )}
//                                       <button
//                                         onClick={() => {
//                                           if (sub.unit !== "status") {
//                                             handleProgressUpdate(activity.id, sub.id, sub.plannedQty);
//                                           } else {
//                                             handleStatusUpdate(activity.id, sub.id, editValue);
//                                             setEditingSubActivity(null);
//                                           }
//                                         }}
//                                         className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
//                                         title="Save"
//                                       >
//                                         <Save size={16} />
//                                       </button>
//                                       <button
//                                         onClick={() => setEditingSubActivity(null)}
//                                         className="p-1 bg-gray-500 text-white rounded hover:bg-gray-600"
//                                         title="Cancel"
//                                       >
//                                         <XCircle size={16} />
//                                       </button>
//                                     </div>
//                                   ) : (
//                                     <button
//                                       onClick={() => {
//                                         setEditingSubActivity(sub.id);
//                                         setEditValue(sub.unit !== "status" ? sub.completedQty || 0 : sub.status || "PENDING");
//                                       }}
//                                       className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                                       title="Update Progress"
//                                     >
//                                       <PenLine size={18} />
//                                     </button>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.div>
//           );
//         })}
//       </div>
//     </motion.div>
//   );
// };

// export default UserProjectDetails;
// src/features/projects/UserProjectDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useMemo } from "react";
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
  ArrowLeft,
  FileText,
  Briefcase,
  User,
  Layers,
  Target,
  Info,
  Loader2
} from "lucide-react";
import { showSnackbar } from "../notifications/notificationSlice";
import TaskPickerModal from "../tasks/TaskPickerModal";
import { fetchProjects } from "../api/apiSlice";

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

// Map backend status to frontend
const mapStatusToFrontend = (backendStatus) => {
  const map = {
    "Pending": "PENDING",
    "Inprogress": "ONGOING",
    "Complete": "COMPLETED",
    "OnHold": "HOLD"
  };
  return map[backendStatus] || "PENDING";
};

// Map backend unit to frontend
const mapUnitToFrontend = (backendUnit) => {
  const map = {
    'Kilometer': 'Km',
    'Numbers': 'Nos.',
    'Percentage': 'Percentage'
  };
  return map[backendUnit] || backendUnit;
};

// Calculate progress based on status for status-based items
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

const UserProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  
  // FIXED: Get projects from api slice, not projects slice
  const { projects = [], loading: apiLoading } = useSelector((state) => state.api);
  const localProjects = useSelector((state) => state.projects?.projects || []);
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedActivities, setExpandedActivities] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskPicker, setShowTaskPicker] = useState(false);
  const [companyMap, setCompanyMap] = useState({});
  const [sectorMap, setSectorMap] = useState({});
  const [clientMap, setClientMap] = useState({});

  // Fetch projects if not loaded
  useEffect(() => {
    if (projects.length === 0) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects.length]);

  // Find the project from either api or local projects
  useEffect(() => {
    setLoading(true);
    
    // Try to find in api projects first
    let foundProject = projects.find(p => p.id === id || p.project_id === id);
    
    // If not found, try local projects
    if (!foundProject) {
      foundProject = localProjects.find(p => p.id === id || p.project_id === id);
    }
    
    if (foundProject) {
      console.log("Project found:", foundProject);
      setProject(foundProject);
      
      // Extract names from project_detail if available
      if (foundProject.project_detail) {
        setCompanyMap({
          [foundProject.company]: foundProject.project_detail.company_detail?.name
        });
        setSectorMap({
          [foundProject.sector]: foundProject.project_detail.sector_detail?.name
        });
        setClientMap({
          [foundProject.client]: foundProject.project_detail.client_detail?.name
        });
      }
    } else {
      console.log("Project not found with ID:", id);
    }
    
    setLoading(false);
  }, [id, projects, localProjects]);

  // Helper functions to get display names
  const getCompanyName = useCallback(() => {
    if (project?.company_detail?.name) return project.company_detail.name;
    if (project?.project_detail?.company_detail?.name) return project.project_detail.company_detail.name;
    if (companyMap[project?.company]) return companyMap[project?.company];
    return project?.company || "—";
  }, [project, companyMap]);

  const getSectorName = useCallback(() => {
    if (project?.sector_detail?.name) return project.sector_detail.name;
    if (project?.project_detail?.sector_detail?.name) return project.project_detail.sector_detail.name;
    if (sectorMap[project?.sector]) return sectorMap[project?.sector];
    return project?.sector || "—";
  }, [project, sectorMap]);

  const getClientName = useCallback(() => {
    if (project?.client_detail?.name) return project.client_detail.name;
    if (project?.project_detail?.client_detail?.name) return project.project_detail.client_detail.name;
    if (clientMap[project?.client]) return clientMap[project?.client];
    return project?.client || project?.department || "—";
  }, [project, clientMap]);

  const getProjectName = useCallback(() => {
    return project?.name || project?.project_name || "Unnamed Project";
  }, [project]);

  const getProjectCode = useCallback(() => {
    return project?.code || project?.project_code || "N/A";
  }, [project]);

  const getProjectStatus = useCallback(() => {
    return mapStatusToFrontend(project?.status);
  }, [project]);

  const getProjectProgress = useCallback(() => {
    return project?.progress || 0;
  }, [project]);

  const getProjectLocation = useCallback(() => {
    return project?.location || "—";
  }, [project]);

  const getProjectTotalLength = useCallback(() => {
    const value = project?.total_length || project?.totalLength || 0;
    return `${value} km`;
  }, [project]);

  const getProjectCost = useCallback(() => {
    const value = project?.cost || project?.workorder_cost || 0;
    return `₹ ${value} Lakhs`;
  }, [project]);

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

  const getProjectCompletionDate = useCallback(() => {
    return project?.completion_date || project?.completionDate;
  }, [project]);

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

  const toggleActivity = (activityId) => {
    setExpandedActivities(prev => ({
      ...prev,
      [activityId]: !prev[activityId]
    }));
  };

  const handlePickTask = (activity, subActivity) => {
    setSelectedTask({ project, activity, subActivity });
    setShowTaskPicker(true);
  };

  const calculateDaysLeft = (endDate) => {
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
  };

  const getDeadlineBadge = (endDate, isCompleted = false) => {
    if (isCompleted) return null;
    const days = calculateDaysLeft(endDate);
    if (days === null) return null;
    if (days < 0) return <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">Overdue</span>;
    if (days === 0) return <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">Due Today</span>;
    if (days <= 2) return <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full">{days} days left</span>;
    if (days <= 7) return <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full">{days} days left</span>;
    return <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">{days} days left</span>;
  };

  const getStatusColor = (status) => {
    const frontendStatus = mapStatusToFrontend(status);
    switch(frontendStatus) {
      case "COMPLETED": return "bg-green-100 text-green-600 border-green-200";
      case "ONGOING": return "bg-blue-100 text-blue-600 border-blue-200";
      case "DELAYED": return "bg-red-100 text-red-600 border-red-200";
      case "HOLD": return "bg-yellow-100 text-yellow-600 border-yellow-200";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return "bg-green-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    if (progress >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  if (loading || apiLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white rounded-2xl p-8 shadow-xl flex items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <div>
            <p className="text-lg font-semibold text-gray-800">Loading Project</p>
            <p className="text-sm text-gray-500">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center px-4">
          <XCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Project not found</h2>
          <p className="text-gray-600 mb-6">Project ID: {id}</p>
          <button
            onClick={() => navigate("/all-projects")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const activities = project.activities_detail || project.activities || [];
  const totalSubActivities = activities.reduce((acc, act) => 
    acc + (act.subactivities?.length || act.subActivities?.length || 0), 0
  );
  const availableTasks = activities.reduce((acc, act) => {
    const subs = act.subactivities || act.subActivities || [];
    return acc + subs.filter(s => {
      const status = s.status_display || mapStatusToFrontend(s.status);
      return status !== "COMPLETED";
    }).length;
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
    >
      {/* Task Picker Modal */}
      <AnimatePresence>
        {showTaskPicker && selectedTask && (
          <TaskPickerModal
            project={selectedTask.project}
            activity={selectedTask.activity}
            subActivity={selectedTask.subActivity}
            onClose={() => {
              setShowTaskPicker(false);
              setSelectedTask(null);
            }}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/all-projects")}
              className="p-2 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{getProjectName()}</h1>
              <p className="text-sm text-gray-500">
                Code: {getProjectCode()} | {project.short_name && `Short Name: ${project.short_name}`}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/projects/${id}/logs`)}
            className="bg-gray-800 text-white px-4 py-2 rounded-xl hover:bg-gray-900 transition-all flex items-center gap-2"
          >
            <FileText size={18} />
            View Logs
          </button>
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
                {getDeadlineStatus(getProjectCompletionDate()) === "OVERDUE" ? "Project is overdue" :
                 getDeadlineStatus(getProjectCompletionDate()) === "TODAY" ? "Project due today!" :
                 getDeadlineStatus(getProjectCompletionDate()) === "CRITICAL" ? "Project deadline critical" :
                 getProjectStatus() === "COMPLETED" ? "Project completed successfully" :
                 "Project is on track"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Completion Date</p>
            <p className="font-semibold">{formatDate(getProjectCompletionDate())}</p>
            {getDeadlineBadge(getProjectCompletionDate(), getProjectStatus() === "COMPLETED")}
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
                <DetailItem label="Company" value={getCompanyName()} />
                <DetailItem label="Sub Company" value={project.sub_company || project.subCompany || "—"} />
                <DetailItem label="Location" value={getProjectLocation()} icon={<MapPin size={12} />} />
                <DetailItem label="Sector" value={getSectorName()} />
                <DetailItem label="Client/Dept" value={getClientName()} />
                <DetailItem label="Total Length" value={getProjectTotalLength()} icon={<Ruler size={12} />} />
                <DetailItem label="Workorder Cost" value={getProjectCost()} icon={<IndianRupee size={12} />} />
                <DetailItem label="LOA Date" value={getProjectLoaDate()} icon={<Calendar size={12} />} />
              </div>

              {/* Additional Dates */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="font-semibold text-gray-700 mb-3">Key Milestones</h4>
                <div className="grid grid-cols-2 gap-4">
                  <DetailItem label="Director Proposal" value={getProjectDirectorProposalDate()} />
                  <DetailItem label="Project Confirmation" value={getProjectConfirmationDate()} />
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
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <StatCard label="Total Activities" value={activities.length} />
                  <StatCard label="Total Tasks" value={totalSubActivities} />
                </div>

                {/* Available Tasks */}
                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Target size={16} className="text-green-600" />
                    <span className="text-sm font-semibold text-green-700">Available to Pick</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">{availableTasks}</p>
                  <p className="text-xs text-green-600 mt-1">Tasks you can pick to work on</p>
                </div>

                {/* Status Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(getProjectStatus())}`}>
                    {getProjectStatus()}
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

        {/* Activities Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <ClipboardList size={24} className="text-blue-600" />
              Available Tasks to Pick
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User size={16} />
              <span>{user?.name}</span>
            </div>
          </div>

          {activities.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
              <Layers size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Activities Yet</h3>
              <p className="text-gray-500">This project doesn't have any activities defined.</p>
            </div>
          ) : (
            activities.map((activity) => {
              const isExpanded = expandedActivities[activity.id];
              const activityName = activity.activity_name || activity.name;
              const activityProgress = activity.progress || 0;
              const isActivityCompleted = activityProgress === 100;
              const subList = activity.subactivities || activity.subActivities || [];
              const availableInActivity = subList.filter(s => {
                const status = s.status_display || mapStatusToFrontend(s.status);
                return status !== "COMPLETED";
              }).length;

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
                          <h4 className="text-lg font-semibold text-gray-800">{activityName}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            isActivityCompleted ? "bg-green-100 text-green-600" : 
                            "bg-blue-100 text-blue-600"
                          }`}>
                            {isActivityCompleted ? "Completed" : "Ongoing"}
                          </span>
                          {availableInActivity > 0 && (
                            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full flex items-center gap-1">
                              <Target size={12} />
                              {availableInActivity} available
                            </span>
                          )}
                        </div>

                        {/* Activity Dates */}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>Start: {formatDate(activity.start_date || activity.startDate)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>End: {formatDate(activity.end_date || activity.endDate)}</span>
                          </div>
                          {!isActivityCompleted && getDeadlineBadge(activity.end_date || activity.endDate)}
                        </div>
                      </div>

                      <button
                        onClick={() => toggleActivity(activity.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>

                    {/* Activity Progress */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Activity Progress</span>
                        <span className="font-semibold text-blue-600">{activityProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${activityProgress}%` }}
                          className={`h-2 rounded-full ${getProgressColor(activityProgress)}`}
                        />
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
                          {subList.length === 0 ? (
                            <p className="text-center text-gray-500 py-4">No tasks in this activity</p>
                          ) : (
                            <div className="space-y-4">
                              {subList.map((sub) => {
                                const subName = sub.subactivity_name || sub.name;
                                const subProgress = sub.progress || 0;
                                const isSubCompleted = subProgress === 100;
                                const subStatus = sub.status_display || mapStatusToFrontend(sub.status);
                                const subUnit = sub.unit_display || mapUnitToFrontend(sub.unit);
                                const subPlannedQty = sub.total_quantity || sub.plannedQty || 0;
                                const subCompletedQty = sub.completed_quantity || sub.completedQty || 0;
                                const subDaysLeft = calculateDaysLeft(sub.end_date || sub.endDate);

                                return (
                                  <div
                                    key={sub.id}
                                    className={`bg-white p-4 rounded-xl shadow-sm border ${
                                      isSubCompleted ? 'border-green-200 bg-green-50/30' : 'border-gray-100'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      {/* Sub Activity Info */}
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                          <h5 className="font-medium text-gray-800">{subName}</h5>
                                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                            {subUnit === "status" ? "Status Based" : subUnit}
                                          </span>
                                          
                                          {isSubCompleted ? (
                                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600 flex items-center gap-1">
                                              <CheckCircle2 size={12} />
                                              Completed
                                            </span>
                                          ) : (
                                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(subStatus)}`}>
                                              {subStatus}
                                            </span>
                                          )}
                                        </div>

                                        {/* Sub Activity Dates */}
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                          <span>Start: {formatDate(sub.start_date || sub.startDate)}</span>
                                          <span>End: {formatDate(sub.end_date || sub.endDate)}</span>
                                          {!isSubCompleted && subDaysLeft !== null && subDaysLeft > 0 && (
                                            <span className={`${
                                              subDaysLeft <= 2 ? "text-red-600 font-semibold" : 
                                              subDaysLeft <= 7 ? "text-yellow-600" : "text-blue-600"
                                            }`}>
                                              {subDaysLeft} days left
                                            </span>
                                          )}
                                        </div>

                                        {/* Quantity Info */}
                                        {subUnit !== "status" && (
                                          <div className="mt-2 text-sm">
                                            <span className="text-gray-600">Planned: {subPlannedQty} {subUnit === "Percentage" ? "%" : subUnit}</span>
                                            {subCompletedQty > 0 && (
                                              <>
                                                <span className="mx-2">|</span>
                                                <span className="text-green-600">Completed: {subCompletedQty} {subUnit === "Percentage" ? "%" : subUnit}</span>
                                              </>
                                            )}
                                          </div>
                                        )}
                                      </div>

                                      {/* Pick Task Button */}
                                      {!isSubCompleted && (
                                        <button
                                          onClick={() => handlePickTask(activity, sub)}
                                          className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all hover:scale-105 shadow-lg flex items-center gap-2"
                                          title="Pick this task"
                                        >
                                          <Briefcase size={18} />
                                          <span className="text-sm font-medium">Pick Task</span>
                                        </button>
                                      )}
                                    </div>

                                    {/* Progress Bar */}
                                    {!isSubCompleted && subUnit !== "status" && (
                                      <div className="mt-3">
                                        <div className="flex justify-between text-xs mb-1">
                                          <span className="text-gray-600">Progress</span>
                                          <span className="font-semibold text-blue-600">{subProgress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                          <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${subProgress}%` }}
                                            className={`h-1.5 rounded-full ${getProgressColor(subProgress)}`}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-start gap-3">
          <Briefcase size={20} className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">How to pick tasks</h4>
            <p className="text-sm text-blue-700">
              Click the <span className="font-bold">"Pick Task"</span> button on any available task to add it to your personal task list. 
              You can then track your progress and time in the <span className="font-bold">"My Tasks"</span> section.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Helper Components
const DetailItem = ({ label, value, icon }) => (
  <div className="space-y-1">
    <p className="text-xs text-gray-500 flex items-center gap-1">
      {icon && icon}
      {label}
    </p>
    <p className="font-medium text-sm text-gray-800 break-words">{value}</p>
  </div>
);

const StatCard = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-xl">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

export default UserProjectDetails;