
// import { useEffect, useState, useMemo } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Clock, 
//   CheckCircle, 
//   Calendar,
//   Timer,
//   ChevronDown,
//   ChevronUp,
//   Search,
//   Filter,
//   Briefcase,
//   Loader2,
//   Save,
//   X,
//   RefreshCw,
//   TrendingUp,
//   History,
//   Edit3,
//   Play,
//   StopCircle,
//   AlertCircle,
//   Eye
// } from 'lucide-react';
// import { 
//   fetchUserTasks, 
//   saveDailyWorkLog,
//   updateTaskProgress,
//   calculateStats,
//   updateTaskLocally
// } from './taskSlice';
// import { showSnackbar } from '../notifications/notificationSlice';
// import { useNavigate } from 'react-router-dom';
// import { fetchProjects, fetchActivities } from '../api/apiSlice';

// const MyTasks = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.auth);
//   const { userTasks = [], loading = false, updating = false, stats = { total: 0, inProgress: 0, completed: 0, pending: 0, totalTimeSpent: 0 } } = useSelector((state) => state.tasks || {});
//   const { projects = [], activities = [] } = useSelector((state) => state.api || {});
  
//   const [expandedTasks, setExpandedTasks] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [showTimeLogModal, setShowTimeLogModal] = useState(false);
//   const [showProgressModal, setShowProgressModal] = useState(false);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [progressValue, setProgressValue] = useState(0);
//   const [isDataLoaded, setIsDataLoaded] = useState(false);
//   const [timeLogData, setTimeLogData] = useState({
//     date: new Date().toISOString().split('T')[0],
//     startTime: '',
//     endTime: '',
//     note: '',
//     status: 'WORKED'
//   });
//   const [isSaving, setIsSaving] = useState(false);

//   // Load all necessary data first
//   useEffect(() => {
//     const loadInitialData = async () => {
      
//       // First, load projects and activities
//       // if (projects.length === 0) {
//       //   await dispatch(fetchProjects());
//       // }
      
//       // if (activities.length === 0) {
//       //   await dispatch(fetchActivities());
//       // }
      
//       setIsDataLoaded(true);
//     };
    
//     loadInitialData();
//   }, [dispatch, projects.length, activities.length]);

//   // Then fetch user tasks only after data is loaded
//   useEffect(() => {
//     const fetchTasks = async () => {
//       if (isDataLoaded && user?.id) {
//         await dispatch(fetchUserTasks(user.id));
//       }
//     };
    
//     fetchTasks();
//   }, [dispatch, user?.id, isDataLoaded]);

//   useEffect(() => {
//     if (userTasks.length > 0) {
//       dispatch(calculateStats());
//     }
//   }, [userTasks, dispatch]);

//   const handleSaveProgress = async () => {
//     if (!selectedTask) return;
    
//     setIsSaving(true);
//     try {
//       await dispatch(updateTaskProgress({ 
//         subActivityId: selectedTask.id, 
//         empCode: user?.id,
//         completedQuantity: progressValue
//       })).unwrap();
      
//       dispatch(showSnackbar({
//         message: 'Progress updated successfully!',
//         type: 'success'
//       }));
      
//       setShowProgressModal(false);
//       setSelectedTask(null);
//       setProgressValue(0);
//       // Refresh tasks after update
//       await dispatch(fetchUserTasks(user.id));
//     } catch (error) {
//       dispatch(showSnackbar({
//         message: error.message || 'Failed to update progress',
//         type: 'error'
//       }));
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleSaveTimeLog = async () => {
//     if (!selectedTask) return;
    
//     // Validate
//     if (timeLogData.status === 'NOT_WORKED') {
//       if (!timeLogData.note.trim()) {
//         dispatch(showSnackbar({
//           message: 'Please provide a reason for not working',
//           type: 'error'
//         }));
//         return;
//       }
//     } else {
//       if (!timeLogData.startTime || !timeLogData.endTime) {
//         dispatch(showSnackbar({
//           message: 'Please enter both start and end time',
//           type: 'error'
//         }));
//         return;
//       }
      
//       if (timeLogData.startTime >= timeLogData.endTime) {
//         dispatch(showSnackbar({
//           message: 'End time must be after start time',
//           type: 'error'
//         }));
//         return;
//       }
//     }
    
//     setIsSaving(true);
//     try {
//       await dispatch(saveDailyWorkLog({
//         subActivityId: selectedTask.id,
//         empCode: user?.id,
//         date: timeLogData.date,
//         startTime: timeLogData.status === 'WORKED' ? timeLogData.startTime : null,
//         endTime: timeLogData.status === 'WORKED' ? timeLogData.endTime : null,
//         note: timeLogData.note,
//         status: timeLogData.status
//       })).unwrap();
      
//       dispatch(showSnackbar({
//         message: timeLogData.status === 'WORKED' ? 'Work hours saved successfully!' : 'Leave record saved successfully!',
//         type: 'success'
//       }));
      
//       setShowTimeLogModal(false);
//       setSelectedTask(null);
//       setTimeLogData({
//         date: new Date().toISOString().split('T')[0],
//         startTime: '',
//         endTime: '',
//         note: '',
//         status: 'WORKED'
//       });
//       // Refresh tasks after update
//       await dispatch(fetchUserTasks(user.id));
//     } catch (error) {
//       dispatch(showSnackbar({
//         message: error.message || 'Failed to save record',
//         type: 'error'
//       }));
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleRefresh = async () => {
//     if (projects.length === 0) {
//       await dispatch(fetchProjects());
//     }
//     if (activities.length === 0) {
//       await dispatch(fetchActivities());
//     }
//     await dispatch(fetchUserTasks(user.id));
//   };

//   const toggleTaskExpand = (taskId) => {
//     setExpandedTasks(prev => ({
//       ...prev,
//       [taskId]: !prev[taskId]
//     }));
//   };

//   const filteredTasks = userTasks.filter(task => {
//     const matchesSearch = 
//       task.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       task.activity_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       task.subactivity_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesFilter = filterStatus === 'all' || task.status === filterStatus;
    
//     return matchesSearch && matchesFilter;
//   });

//   // Group filtered tasks by project
//   const groupedTasks = useMemo(() => {
//     const groups = {};
    
//     filteredTasks.forEach(task => {
//       // Use project_id as key, but ensure it's not undefined
//       const projectId = task.project_id || 'unknown';
      
//       if (!groups[projectId]) {
//         groups[projectId] = {
//           project_id: projectId,
//           project_name: task.project_name || 'Unknown Project',
//           project_code: task.project_code || 'N/A',
//           tasks: []
//         };
//       }
//       groups[projectId].tasks.push(task);
//     });
    
//     // Log for debugging
//     Object.entries(groups).forEach(([id, group]) => {
//       console.log(`- ${group.project_name} (${id}): ${group.tasks.length} tasks`);
//     });
    
//     return groups;
//   }, [filteredTasks]);

//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'COMPLETED': return 'bg-green-100 text-green-600 border-green-200';
//       case 'IN_PROGRESS': return 'bg-blue-100 text-blue-600 border-blue-200';
//       case 'PENDING': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
//       default: return 'bg-gray-100 text-gray-600';
//     }
//   };

//   const getProgressColor = (progress) => {
//     if (progress === 100) return 'bg-green-500';
//     if (progress >= 75) return 'bg-blue-500';
//     if (progress >= 50) return 'bg-yellow-500';
//     if (progress >= 25) return 'bg-orange-500';
//     return 'bg-red-500';
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleDateString('en-IN', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     } catch {
//       return dateString;
//     }
//   };

//   const formatTime = (hours) => {
//     if (!hours) return '0h';
//     const hrs = Math.floor(hours);
//     const mins = Math.round((hours - hrs) * 60);
//     if (mins === 0) return `${hrs}h`;
//     return `${hrs}h ${mins}m`;
//   };

//   const calculateHours = (start, end) => {
//     if (!start || !end) return 0;
//     const [startH, startM] = start.split(':').map(Number);
//     const [endH, endM] = end.split(':').map(Number);
//     let hours = endH - startH;
//     let minutes = endM - startM;
//     if (minutes < 0) {
//       hours--;
//       minutes += 60;
//     }
//     return hours + minutes / 60;
//   };

//   // Show loading state while initial data is loading
//   if ((!isDataLoaded || loading) && userTasks.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="bg-white rounded-2xl p-8 shadow-xl flex items-center gap-4">
//           <Loader2 className="animate-spin text-blue-600" size={32} />
//           <div>
//             <p className="text-lg font-semibold text-gray-800">Loading My Tasks</p>
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
//       className="max-w-7xl mx-auto px-4 py-6"
//     >
//       {/* Progress Update Modal */}
//       <AnimatePresence>
//         {showProgressModal && selectedTask && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//             onClick={() => setShowProgressModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               className="bg-white rounded-2xl p-6 max-w-md w-full"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-bold text-gray-800">Update Progress</h3>
//                 <button onClick={() => setShowProgressModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
//                   <X size={20} />
//                 </button>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Task</label>
//                 <p className="text-gray-800 font-medium">{selectedTask.subactivity_name}</p>
//                 <p className="text-sm text-gray-500">{selectedTask.project_name}</p>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Completed Quantity ({selectedTask.unit_display || selectedTask.unit})
//                 </label>
//                 <input
//                   type="number"
//                   min="0"
//                   max={selectedTask.total_quantity}
//                   step="0.01"
//                   value={progressValue}
//                   onChange={(e) => setProgressValue(parseFloat(e.target.value) || 0)}
//                   className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   Max: {selectedTask.total_quantity} {selectedTask.unit_display || selectedTask.unit} | Current: {selectedTask.completed_quantity || 0}
//                 </p>
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setShowProgressModal(false)}
//                   className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSaveProgress}
//                   disabled={isSaving}
//                   className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
//                 >
//                   {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
//                   Save Progress
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Time Log Modal */}
//       <AnimatePresence>
//         {showTimeLogModal && selectedTask && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//             onClick={() => setShowTimeLogModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               className="bg-white rounded-2xl p-6 max-w-md w-full"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-bold text-gray-800">Daily Work Log</h3>
//                 <button onClick={() => setShowTimeLogModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
//                   <X size={20} />
//                 </button>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Task</label>
//                 <p className="text-gray-800 font-medium">{selectedTask.subactivity_name}</p>
//                 <p className="text-sm text-gray-500">{selectedTask.project_name}</p>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
//                 <input
//                   type="date"
//                   value={timeLogData.date}
//                   onChange={(e) => setTimeLogData({ ...timeLogData, date: e.target.value })}
//                   max={new Date().toISOString().split('T')[0]}
//                   className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//                 <div className="grid grid-cols-2 gap-3">
//                   <button
//                     type="button"
//                     onClick={() => setTimeLogData({ ...timeLogData, status: 'WORKED' })}
//                     className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
//                       timeLogData.status === 'WORKED'
//                         ? 'border-green-500 bg-green-50 text-green-700'
//                         : 'border-gray-200 hover:border-gray-300 text-gray-600'
//                     }`}
//                   >
//                     <Play size={18} />
//                     <span>Worked</span>
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setTimeLogData({ ...timeLogData, status: 'NOT_WORKED' })}
//                     className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
//                       timeLogData.status === 'NOT_WORKED'
//                         ? 'border-red-500 bg-red-50 text-red-700'
//                         : 'border-gray-200 hover:border-gray-300 text-gray-600'
//                     }`}
//                   >
//                     <StopCircle size={18} />
//                     <span>Not Worked</span>
//                   </button>
//                 </div>
//               </div>

//               {timeLogData.status === 'WORKED' ? (
//                 <>
//                   <div className="grid grid-cols-2 gap-4 mb-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
//                       <input
//                         type="time"
//                         value={timeLogData.startTime}
//                         onChange={(e) => setTimeLogData({ ...timeLogData, startTime: e.target.value })}
//                         className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
//                       <input
//                         type="time"
//                         value={timeLogData.endTime}
//                         onChange={(e) => setTimeLogData({ ...timeLogData, endTime: e.target.value })}
//                         className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>
//                   </div>
                  
//                   {timeLogData.startTime && timeLogData.endTime && (
//                     <div className="mb-4 p-3 bg-blue-50 rounded-lg">
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-blue-700">Total Hours:</span>
//                         <span className="text-lg font-bold text-blue-700">
//                           {calculateHours(timeLogData.startTime, timeLogData.endTime).toFixed(2)} hrs
//                         </span>
//                       </div>
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Reason for not working *</label>
//                   <textarea
//                     value={timeLogData.note}
//                     onChange={(e) => setTimeLogData({ ...timeLogData, note: e.target.value })}
//                     placeholder="Please explain why you couldn't work today..."
//                     rows={3}
//                     className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500"
//                   />
//                 </div>
//               )}

//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
//                 <textarea
//                   value={timeLogData.note}
//                   onChange={(e) => setTimeLogData({ ...timeLogData, note: e.target.value })}
//                   placeholder="Any additional notes about your work..."
//                   rows={2}
//                   className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setShowTimeLogModal(false)}
//                   className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSaveTimeLog}
//                   disabled={isSaving}
//                   className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
//                 >
//                   {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
//                   Save Record
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">My Tasks</h1>
//           <p className="text-gray-500">Track your tasks and log daily work hours</p>
//         </div>
//         <button
//           onClick={handleRefresh}
//           disabled={loading}
//           className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 flex items-center gap-2"
//         >
//           <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
//           <span className="text-sm">Refresh</span>
//         </button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
//           <p className="text-sm text-gray-500">Total Tasks</p>
//           <p className="text-2xl font-bold text-gray-800">{stats.total || 0}</p>
//         </motion.div>
        
//         <motion.div whileHover={{ scale: 1.02 }} className="bg-blue-50 rounded-xl p-4 shadow-md border border-blue-100">
//           <p className="text-sm text-blue-600">In Progress</p>
//           <p className="text-2xl font-bold text-blue-700">{stats.inProgress || 0}</p>
//         </motion.div>

//         <motion.div whileHover={{ scale: 1.02 }} className="bg-green-50 rounded-xl p-4 shadow-md border border-green-100">
//           <p className="text-sm text-green-600">Completed</p>
//           <p className="text-2xl font-bold text-green-700">{stats.completed || 0}</p>
//         </motion.div>

//         <motion.div whileHover={{ scale: 1.02 }} className="bg-purple-50 rounded-xl p-4 shadow-md border border-purple-100">
//           <p className="text-sm text-purple-600">Total Time</p>
//           <p className="text-2xl font-bold text-purple-700">
//             {formatTime(stats.totalTimeSpent || 0)}
//           </p>
//         </motion.div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search tasks by project or name..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="relative">
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white min-w-[160px]"
//             >
//               <option value="all">All Status</option>
//               <option value="PENDING">Pending</option>
//               <option value="IN_PROGRESS">In Progress</option>
//               <option value="COMPLETED">Completed</option>
//             </select>
//             <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//           </div>
//         </div>
//       </div>

//       {/* Tasks List - Grouped by Project */}
//       {Object.keys(groupedTasks).length === 0 ? (
//         <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
//           <Briefcase size={64} className="mx-auto mb-4 text-gray-300" />
//           <h2 className="text-xl font-semibold text-gray-700 mb-2">No Tasks Found</h2>
//           <p className="text-gray-500 mb-4">
//             {searchTerm || filterStatus !== 'all' 
//               ? 'No tasks match your filters' 
//               : "You haven't picked any tasks yet."}
//           </p>
//           <button
//             onClick={() => navigate('/all-projects')}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Browse Projects
//           </button>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {Object.entries(groupedTasks).map(([projectId, project]) => (
//             <div key={projectId} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
//               {/* Project Header */}
//               <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
//                 <div className="flex items-center gap-3">
//                   <Briefcase size={20} className="text-blue-600" />
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-gray-800">{project.project_name}</h3>
//                     <p className="text-xs text-gray-500">Code: {project.project_code}</p>
//                   </div>
//                   <button
//                     onClick={() => navigate(`/my-picked-projects/${projectId}`)}
//                     className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm"
//                   >
//                     <Eye size={16} />
//                     View Project
//                   </button>
//                   <span className="text-sm text-gray-500">
//                     {project.tasks.length} tasks
//                   </span>
//                 </div>
//               </div>

//               {/* Tasks List */}
//               <div className="divide-y divide-gray-100">
//                 {project.tasks.map((task) => {
//                   const isExpanded = expandedTasks[task.id];
//                   const taskProgress = task.progress || 0;
//                   const isCompleted = task.status === 'COMPLETED';
//                   const latestWorkLog = task.work_logs?.[task.work_logs.length - 1];
                  
//                   return (
//                     <motion.div
//                       key={task.id}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -20 }}
//                       className="p-4 hover:bg-gray-50 transition-colors"
//                     >
//                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                         {/* Task Info */}
//                         <div className="flex-1">
//                           <div className="flex items-center gap-2 mb-2 flex-wrap">
//                             <h4 className="font-semibold text-gray-800">{task.subactivity_name}</h4>
//                             <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
//                               {task.status}
//                             </span>
//                           </div>
                          
//                           <div className="text-sm text-gray-600 mb-2">
//                             {task.activity_name}
//                           </div>

//                           <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
//                             <span className="flex items-center gap-1">
//                               <Calendar size={12} />
//                               Picked: {formatDate(task.picked_at)}
//                             </span>
//                             {/* {task.unit !== 'status' && task.unit !== null && (
//                               <span>
//                                 Progress: {task.completed_quantity || 0}/{task.total_quantity || 0} {task.unit_display || task.unit}
//                               </span>
//                             )} */}
//                             {task.total_time_spent > 0 && (
//                               <span className="flex items-center gap-1">
//                                 <Timer size={12} />
//                                 Total: {formatTime(task.total_time_spent)}
//                               </span>
//                             )}
//                             {/* {latestWorkLog && (
//                               <span className="flex items-center gap-1 text-blue-600">
//                                 <History size={12} />
//                                 Last: {latestWorkLog.date}
//                               </span>
//                             )} */}
//                           </div>
//                         </div>

//                         {/* Action Buttons */}
//                         <div className="flex items-center gap-2">
//                           {!isCompleted && (
//                             <>
//                               {/* <button
//                                 onClick={() => {
//                                   setSelectedTask(task);
//                                   setProgressValue(task.completed_quantity || 0);
//                                   setShowProgressModal(true);
//                                 }}
//                                 className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//                                 title="Update progress"
//                               >
//                                 <Edit3 size={18} />
//                               </button> */}
//                               <button
//                                 onClick={() => {
//                                   setSelectedTask(task);
//                                   setTimeLogData({
//                                     date: new Date().toISOString().split('T')[0],
//                                     startTime: '',
//                                     endTime: '',
//                                     note: '',
//                                     status: 'WORKED'
//                                   });
//                                   setShowTimeLogModal(true);
//                                 }}
//                                 className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
//                                 title="Log daily work"
//                               >
//                                 <Clock size={18} />
//                               </button>
//                             </>
//                           )}

//                           {/* <button
//                             onClick={() => toggleTaskExpand(task.id)}
//                             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                           >
//                             {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                           </button> */}
//                         </div>
//                       </div>

//                       {/* Progress Bar */}
//                       {/* {task.unit !== 'status' && task.unit !== null && !isCompleted && (
//                         <div className="mt-3">
//                           <div className="flex justify-between text-xs mb-1">
//                             <span className="text-gray-600">Progress</span>
//                             <span className="font-semibold text-blue-600">{taskProgress}%</span>
//                           </div>
//                           <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
//                             <motion.div
//                               initial={{ width: 0 }}
//                               animate={{ width: `${taskProgress}%` }}
//                               className={`h-2 rounded-full ${getProgressColor(taskProgress)}`}
//                             />
//                           </div>
//                         </div>
//                       )} */}

//                       {/* Expanded Details */}
//                       <AnimatePresence>
//                         {isExpanded && (
//                           <motion.div
//                             initial={{ height: 0, opacity: 0 }}
//                             animate={{ height: 'auto', opacity: 1 }}
//                             exit={{ height: 0, opacity: 0 }}
//                             className="mt-4 pt-4 border-t border-gray-100"
//                           >
//                             <div className="grid md:grid-cols-2 gap-4">
//                               <div>
//                                 <h4 className="font-medium text-gray-700 mb-2 text-sm">Task Details</h4>
//                                 <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
//                                   <p><span className="text-gray-500">Unit:</span> {task.unit_display || task.unit || 'status'}</p>
//                                   {task.unit !== 'status' && task.unit !== null && (
//                                     <>
//                                       <p><span className="text-gray-500">Planned Quantity:</span> {task.total_quantity}</p>
//                                       <p><span className="text-gray-500">Completed Quantity:</span> {task.completed_quantity || 0}</p>
//                                     </>
//                                   )}
//                                   <p><span className="text-gray-500">Total Time Spent:</span> {formatTime(task.total_time_spent || 0)}</p>
//                                   <p><span className="text-gray-500">Deadline:</span> {formatDate(task.end_date)}</p>
//                                 </div>
//                               </div>
//                               <div>
//                                 <h4 className="font-medium text-gray-700 mb-2 text-sm">Work History</h4>
//                                 <div className="bg-gray-50 p-3 rounded-lg space-y-2 max-h-48 overflow-y-auto">
//                                   {task.work_logs && task.work_logs.length > 0 ? (
//                                     task.work_logs.slice().reverse().map((log, idx) => (
//                                       <div key={idx} className="text-xs border-b border-gray-200 pb-2 last:border-0">
//                                         <div className="font-medium text-gray-700">{log.date}</div>
//                                         {log.status === 'WORKED' ? (
//                                           <>
//                                             <div className="text-gray-600">
//                                               {log.start_time?.split('T')[1]?.substring(0, 5)} - {log.end_time?.split('T')[1]?.substring(0, 5)}
//                                               <span className="ml-2 text-blue-600">{log.hours_worked?.toFixed(2)}h</span>
//                                             </div>
//                                             {log.completed_quantity > 0 && (
//                                               <div className="text-green-600">Completed: {log.completed_quantity}</div>
//                                             )}
//                                           </>
//                                         ) : (
//                                           <div className="text-red-600 flex items-center gap-1">
//                                             <AlertCircle size={12} />
//                                             Not Worked
//                                           </div>
//                                         )}
//                                         {log.note && <div className="text-gray-500 italic">"{log.note.substring(0, 60)}"</div>}
//                                       </div>
//                                     ))
//                                   ) : (
//                                     <p className="text-gray-500 text-center py-2">No work logs yet</p>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           </motion.div>
//                         )}
//                       </AnimatePresence>
//                     </motion.div>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default MyTasks;

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Calendar, 
  Search,
  Filter,
  Loader2,
  RefreshCw,
  Briefcase,
  Building2,
  Users,
  TrendingUp,
  Timer,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import { fetchUserWorkSummary, calculateWorkLogStats } from './taskSlice';
import { useNavigate } from 'react-router-dom';
import LoadingModal from '../../components/modals/LoadingModal';

const MyTasks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { userWorkSummary = null, loading = false } = useSelector((state) => state.tasks || {});
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState('all');
  const [expandedProjects, setExpandedProjects] = useState({});
  const [expandedActivities, setExpandedActivities] = useState({});

  useEffect(() => {
    if (user?.id) {
      fetchWorkSummary();
    }
  }, [dispatch, user?.id]);

  const fetchWorkSummary = async () => {
    await dispatch(fetchUserWorkSummary(user?.id));
  };

  const toggleProjectExpand = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const toggleActivityExpand = (activityId) => {
    setExpandedActivities(prev => ({
      ...prev,
      [activityId]: !prev[activityId]
    }));
  };

  const formatDuration = (timeString) => {
    if (!timeString || timeString === '00:00:00') return '0h';
    const parts = timeString.split(':');
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const handleViewProject = (projectId, e) => {
    e.stopPropagation(); 
    navigate(`/my-projects/${projectId}`); 
  };

  
  let filteredProjects = userWorkSummary?.projects || [];
  
  if (searchTerm) {
    filteredProjects = filteredProjects.filter(project => 
      project.project_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  if (filterProject !== 'all') {
    filteredProjects = filteredProjects.filter(project => 
      project.project_name === filterProject
    );
  }

  
  const uniqueProjects = [...new Set((userWorkSummary?.projects || []).map(p => p.project_name))];

  
  const totalHours = userWorkSummary?.projects?.reduce((sum, project) => {
    const activityHours = project.activities?.reduce((actSum, activity) => {
      const parts = activity.total_time_spent?.split(':') || ['0', '0', '0'];
      const hours = parseInt(parts[0]);
      return actSum + hours;
    }, 0) || 0;
    return sum + activityHours;
  }, 0) || 0;


  const totalActivities = userWorkSummary?.projects?.reduce((sum, p) => 
    sum + (p.activities?.length || 0), 0) || 0;

  
  const totalTasks = userWorkSummary?.projects?.reduce((sum, p) => 
    sum + (p.activities?.reduce((actSum, a) => 
      actSum + (a.subactivities?.length || 0), 0) || 0), 0) || 0;

  if (loading && !userWorkSummary) {
    return <LoadingModal isVisible={true} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Work Summary</h1>
          <p className="text-gray-500">Track your work hours across all projects</p>
        </div>
        <button
          onClick={fetchWorkSummary}
          disabled={loading}
          className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 flex items-center gap-2"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          <span className="text-sm">Refresh</span>
        </button>
      </div>

    
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase size={18} className="text-blue-600" />
            <p className="text-sm text-gray-500">Total Projects</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{filteredProjects.length}</p>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02 }} className="bg-green-50 rounded-xl p-4 shadow-md border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <Timer size={18} className="text-green-600" />
            <p className="text-sm text-green-600">Total Hours Worked</p>
          </div>
          <p className="text-2xl font-bold text-green-700">{totalHours} hrs</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-purple-50 rounded-xl p-4 shadow-md border border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={18} className="text-purple-600" />
            <p className="text-sm text-purple-600">Activities Worked</p>
          </div>
          <p className="text-2xl font-bold text-purple-700">{totalActivities}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-orange-50 rounded-xl p-4 shadow-md border border-orange-100">
          <div className="flex items-center gap-2 mb-2">
            <Users size={18} className="text-orange-600" />
            <p className="text-sm text-orange-600">Total Tasks</p>
          </div>
          <p className="text-2xl font-bold text-orange-700">{totalTasks}</p>
        </motion.div>
      </div>

      
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by project name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white min-w-[180px]"
            >
              <option value="all">All Projects</option>
              {uniqueProjects.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      </div>

    
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
          <Briefcase size={64} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Work Records Found</h2>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterProject !== 'all' 
              ? 'No projects match your filters' 
              : "You haven't logged any work hours yet."}
          </p>
          <button
            onClick={() => navigate('/all-projects')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Projects
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredProjects.map((project) => {
            const isProjectExpanded = expandedProjects[project.project_id];
            const projectHours = project.activities?.reduce((sum, act) => {
              const parts = act.total_time_spent?.split(':') || ['0', '0', '0'];
              const hours = parseInt(parts[0]);
              return sum + hours;
            }, 0) || 0;

            return (
              <div key={project.project_id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                
                <div 
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex items-center gap-3 flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => toggleProjectExpand(project.project_id)}
                    >
                      <Building2 size={20} className="text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-gray-800">{project.project_name}</h3>
                        <p className="text-xs text-gray-500">ID: {project.project_id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Total Hours</p>
                        <p className="text-sm font-semibold text-blue-600">{projectHours}h</p>
                      </div>
                      
                
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleViewProject(project.project_id, e)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                        title="View project details and work on other tasks"
                      >
                        <Eye size={16} />
                        <span className="text-sm font-medium hidden sm:inline">View Project</span>
                      </motion.button>
                      
                      <button 
                        onClick={() => toggleProjectExpand(project.project_id)}
                        className="p-1 hover:bg-white/50 rounded-lg transition-colors"
                      >
                        {isProjectExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                
                <AnimatePresence>
                  {isProjectExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="divide-y divide-gray-100"
                    >
                      
                      <div className="bg-blue-50 p-3 border-b border-blue-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertCircle size={16} className="text-blue-600" />
                            <p className="text-sm text-blue-700">
                              Want to work on other tasks in this project?
                            </p>
                          </div>
                          <button
                            onClick={() => navigate(`/my-projects/${project.project_id}`)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                          >
                            <Eye size={14} />
                            View Full Project
                          </button>
                        </div>
                      </div>

                      {project.activities?.map((activity) => {
                        const isActivityExpanded = expandedActivities[activity.activity_id];
                        const activityHours = formatDuration(activity.total_time_spent);
                        
                        return (
                          <div key={activity.activity_id} className="bg-gray-50">
                          
                            <div 
                              className="p-3 cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-between"
                              onClick={() => toggleActivityExpand(activity.activity_id)}
                            >
                              <div className="flex items-center gap-2">
                                <Clock size={16} className="text-purple-500" />
                                <h4 className="font-medium text-gray-800">{activity.activity_name}</h4>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-xs text-gray-500">{activityHours}</span>
                                <button className="p-1 hover:bg-white rounded">
                                  {isActivityExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                              </div>
                            </div>

                          
                            <AnimatePresence>
                              {isActivityExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="bg-white p-3 space-y-2"
                                >
                                  {activity.subactivities?.length === 0 ? (
                                    <p className="text-sm text-gray-500 text-center py-4">No tasks logged in this activity</p>
                                  ) : (
                                    activity.subactivities?.map((sub) => (
                                      <div key={sub.subactivity_id} className="border border-gray-100 rounded-lg p-3 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start">
                                          <div className="flex-1">
                                            <h5 className="font-medium text-gray-800">{sub.subactivity_name}</h5>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                              <span className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                Deadline: {formatDate(sub.deadline)}
                                              </span>
                                              {sub.completion_status && (
                                                <span className={`flex items-center gap-1 ${sub.completion_status === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                  <CheckCircle size={12} />
                                                  {sub.completion_status}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-lg font-semibold text-blue-600">{formatDuration(sub.total_time_spent)}</p>
                                            <p className="text-xs text-gray-400">Total Time</p>
                                          </div>
                                        </div>
                                        
                                        
                                        <div className="mt-2 pt-2 border-t border-gray-100 flex justify-end">
                                          <button
                                            onClick={() => navigate(`/my-projects/${project.project_id}`)}
                                            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                          >
                                            <Clock size={12} />
                                            Log more time for this task
                                          </button>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                      
                      {(!project.activities || project.activities.length === 0) && (
                        <div className="p-6 text-center text-gray-500">
                          <AlertCircle size={32} className="mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No activities found for this project</p>
                          <button
                            onClick={() => navigate(`/my-projects/${project.project_id}`)}
                            className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            View Project Details
                          </button>
                        </div>
                      )}

                      {/* Footer with Quick Action */}
                      <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                        <button
                          onClick={() => navigate(`/my-projects/${project.project_id}`)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <Eye size={14} />
                          View complete project details and all tasks
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      
      {filteredProjects.length > 0 && (
        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-start gap-3">
          <TrendingUp size={20} className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">Work Summary</h4>
            <p className="text-sm text-blue-700">
              You have logged <strong>{totalHours} hours</strong> across <strong>{uniqueProjects.length} projects</strong>.
              Total of <strong>{totalTasks} tasks</strong> recorded in <strong>{totalActivities} activities</strong>.
            </p>
            <p className="text-xs text-blue-600 mt-2">
              💡 Tip: Click "View Project" on any project to see all tasks and log more work hours.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MyTasks;