// // src/features/tasks/MyTasks.jsx
// import { useEffect, useState, useCallback, useRef } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Clock, 
//   CheckCircle, 
//   Play,
//   StopCircle,
//   AlertCircle,
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
//   Users,
//   UserCheck
// } from 'lucide-react';
// import { 
//   fetchUserTasks, 
//   startTask, 
//   stopTask,
//   updateTaskProgress,
//   calculateStats,
//   updateTaskLocally
// } from './taskSlice';
// import { showSnackbar } from '../notifications/notificationSlice';

// // Debounce function
// const debounce = (func, delay) => {
//   let timeoutId;
//   return (...args) => {
//     clearTimeout(timeoutId);
//     timeoutId = setTimeout(() => func(...args), delay);
//   };
// };

// const MyTasks = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const { userTasks = [], loading = false, updating = false, stats = { total: 0, inProgress: 0, completed: 0, pending: 0, totalTimeSpent: 0 } } = useSelector((state) => state.tasks || {});
  
//   const [expandedTasks, setExpandedTasks] = useState({});
//   const [activeTask, setActiveTask] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [workLogs, setWorkLogs] = useState({});
//   const [showWorkLogModal, setShowWorkLogModal] = useState(false);
//   const [selectedTaskForLog, setSelectedTaskForLog] = useState(null);
//   const [workLogNotes, setWorkLogNotes] = useState('');
//   const [workLogCompletedQty, setWorkLogCompletedQty] = useState(0);

//   // Debounced progress update
//   const debouncedProgressUpdate = useRef(
//     debounce((taskId, completedQuantity) => {
//       const task = userTasks.find(t => t.id === taskId);
//       if (task && task.unit !== 'status') {
//         if (completedQuantity > task.total_quantity) {
//           dispatch(showSnackbar({
//             message: `Cannot exceed planned quantity (${task.total_quantity})`,
//             type: "error"
//           }));
//           return;
//         }
//         dispatch(updateTaskProgress({ 
//           subActivityId: taskId, 
//           empCode: user?.id,
//           completedQuantity
//         }));
//       }
//     }, 800)
//   ).current;

//   useEffect(() => {
//     if (user?.id) {
//       fetchTasks();
//     }
//   }, [dispatch, user?.id]);

//   const fetchTasks = async () => {
//     await dispatch(fetchUserTasks(user.id));
//   };

//   useEffect(() => {
//     if (userTasks.length > 0) {
//       dispatch(calculateStats());
//       // Group tasks by project
//       const grouped = userTasks.reduce((acc, task) => {
//         if (!acc[task.project_id]) {
//           acc[task.project_id] = {
//             project_name: task.project_name,
//             project_code: task.project_code,
//             tasks: []
//           };
//         }
//         acc[task.project_id].tasks.push(task);
//         return acc;
//       }, {});
//       setWorkLogs(grouped);
//     }
//   }, [userTasks, dispatch]);

//   const handleStartTask = (task) => {
//     if (activeTask) {
//       dispatch(showSnackbar({
//         message: 'Please complete or stop your current task first',
//         type: 'warning'
//       }));
//       return;
//     }
//     dispatch(startTask({ subActivityId: task.id, empCode: user?.id }));
//     setActiveTask(task.id);
//   };

//   const handleStopTask = (task) => {
//     setSelectedTaskForLog(task);
//     setWorkLogCompletedQty(task.completed_quantity || 0);
//     setWorkLogNotes('');
//     setShowWorkLogModal(true);
//   };

//   const handleSubmitWorkLog = () => {
//     if (selectedTaskForLog) {
//       dispatch(stopTask({ 
//         subActivityId: selectedTaskForLog.id, 
//         empCode: user?.id,
//         completedQuantity: workLogCompletedQty,
//         workLog: workLogNotes
//       }));
//       setActiveTask(null);
//       setShowWorkLogModal(false);
//       setSelectedTaskForLog(null);
//       setWorkLogNotes('');
//       setWorkLogCompletedQty(0);
//     }
//   };

//   const handleProgressChange = (taskId, value) => {
//     // Update local state immediately for responsive UI
//     dispatch(updateTaskLocally({ taskId, updates: { completed_quantity: value } }));
//     // Debounced API call
//     debouncedProgressUpdate(taskId, value);
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
//   const groupedTasks = filteredTasks.reduce((acc, task) => {
//     if (!acc[task.project_id]) {
//       acc[task.project_id] = {
//         project_name: task.project_name,
//         project_code: task.project_code,
//         tasks: []
//       };
//     }
//     acc[task.project_id].tasks.push(task);
//     return acc;
//   }, {});

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

//   if (loading && userTasks.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="bg-white rounded-2xl p-8 shadow-xl flex items-center gap-4">
//           <Loader2 className="animate-spin text-blue-600" size={32} />
//           <div>
//             <p className="text-lg font-semibold text-gray-800">Loading Tasks</p>
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
//       {/* Work Log Modal */}
//       <AnimatePresence>
//         {showWorkLogModal && selectedTaskForLog && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//             onClick={() => setShowWorkLogModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               className="bg-white rounded-2xl p-6 max-w-md w-full"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-bold text-gray-800">End of Day Report</h3>
//                 <button onClick={() => setShowWorkLogModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
//                   <X size={20} />
//                 </button>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Task</label>
//                 <p className="text-gray-800 font-medium">{selectedTaskForLog.subactivity_name}</p>
//                 <p className="text-sm text-gray-500">{selectedTaskForLog.project_name}</p>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Completed Quantity</label>
//                 <input
//                   type="number"
//                   min="0"
//                   max={selectedTaskForLog.total_quantity}
//                   step="0.01"
//                   value={workLogCompletedQty}
//                   onChange={(e) => setWorkLogCompletedQty(parseFloat(e.target.value) || 0)}
//                   className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   Max: {selectedTaskForLog.total_quantity} {selectedTaskForLog.unit}
//                 </p>
//               </div>

//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Work Notes</label>
//                 <textarea
//                   value={workLogNotes}
//                   onChange={(e) => setWorkLogNotes(e.target.value)}
//                   placeholder="What did you work on today?"
//                   rows={3}
//                   className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setShowWorkLogModal(false)}
//                   className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSubmitWorkLog}
//                   disabled={updating}
//                   className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
//                 >
//                   {updating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
//                   Save & Stop
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
//           <p className="text-gray-500">Track your picked tasks and daily work</p>
//         </div>
//         <button
//           onClick={fetchTasks}
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
//             onClick={() => window.location.href = '/all-projects'}
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
//                   <div>
//                     <h3 className="font-semibold text-gray-800">{project.project_name}</h3>
//                     <p className="text-xs text-gray-500">Code: {project.project_code}</p>
//                   </div>
//                   <span className="ml-auto text-sm text-gray-500">
//                     {project.tasks.length} tasks
//                   </span>
//                 </div>
//               </div>

//               {/* Tasks List */}
//               <div className="divide-y divide-gray-100">
//                 {project.tasks.map((task) => {
//                   const isExpanded = expandedTasks[task.id];
//                   const isActive = activeTask === task.id;
//                   const taskProgress = task.progress || 0;
//                   const isCompleted = task.status === 'COMPLETED';
                  
//                   return (
//                     <motion.div
//                       key={task.id}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -20 }}
//                       className={`p-4 transition-all ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
//                     >
//                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                         {/* Task Info */}
//                         <div className="flex-1">
//                           <div className="flex items-center gap-2 mb-2 flex-wrap">
//                             <h4 className="font-semibold text-gray-800">{task.subactivity_name}</h4>
//                             <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
//                               {task.status}
//                             </span>
//                             {isActive && (
//                               <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full animate-pulse">
//                                 ● Active
//                               </span>
//                             )}
//                           </div>
                          
//                           <div className="text-sm text-gray-600 mb-2">
//                             {task.activity_name}
//                           </div>

//                           <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
//                             <span className="flex items-center gap-1">
//                               <Calendar size={12} />
//                               Picked: {formatDate(task.picked_at)}
//                             </span>
//                             {task.unit !== 'status' && (
//                               <span>
//                                 Progress: {task.completed_quantity || 0}/{task.total_quantity || 0} {task.unit}
//                               </span>
//                             )}
//                             {task.total_time_spent > 0 && (
//                               <span className="flex items-center gap-1">
//                                 <Timer size={12} />
//                                 Total: {formatTime(task.total_time_spent)}
//                               </span>
//                             )}
//                           </div>
//                         </div>

//                         {/* Action Buttons */}
//                         <div className="flex items-center gap-3">
//                           {task.status === 'PENDING' && !isActive && (
//                             <button
//                               onClick={() => handleStartTask(task)}
//                               className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
//                               title="Start working"
//                             >
//                               <Play size={18} />
//                             </button>
//                           )}

//                           {task.status === 'IN_PROGRESS' && isActive && (
//                             <button
//                               onClick={() => handleStopTask(task)}
//                               className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
//                               title="Stop and log work"
//                             >
//                               <StopCircle size={18} />
//                             </button>
//                           )}

//                           <button
//                             onClick={() => toggleTaskExpand(task.id)}
//                             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                           >
//                             {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                           </button>
//                         </div>
//                       </div>

//                       {/* Progress Bar */}
//                       {task.unit !== 'status' && !isCompleted && (
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
//                       )}

//                       {/* Progress Update Input */}
//                       {!isCompleted && task.unit !== 'status' && (
//                         <div className="mt-3 flex items-center gap-2">
//                           <label className="text-xs text-gray-500">Update completed:</label>
//                           <input
//                             type="number"
//                             min="0"
//                             max={task.total_quantity}
//                             step="0.01"
//                             value={task.completed_quantity || 0}
//                             onChange={(e) => handleProgressChange(task.id, parseFloat(e.target.value) || 0)}
//                             className="w-24 px-2 py-1 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
//                           />
//                           <span className="text-xs text-gray-500">{task.unit}</span>
//                         </div>
//                       )}

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
//                                   <p><span className="text-gray-500">Unit:</span> {task.unit}</p>
//                                   {task.unit !== 'status' && (
//                                     <>
//                                       <p><span className="text-gray-500">Planned Quantity:</span> {task.total_quantity}</p>
//                                       <p><span className="text-gray-500">Completed Quantity:</span> {task.completed_quantity || 0}</p>
//                                     </>
//                                   )}
//                                   <p><span className="text-gray-500">Total Time Spent:</span> {formatTime(task.total_time_spent || 0)}</p>
//                                   {task.work_logs && task.work_logs.length > 0 && (
//                                     <div>
//                                       <p className="text-gray-500 mb-1">Work Logs:</p>
//                                       {task.work_logs.slice(-3).map((log, idx) => (
//                                         <div key={idx} className="text-xs text-gray-600 mt-1 p-1 bg-white rounded">
//                                           <span className="font-medium">{log.date}</span>: {log.hours_worked?.toFixed(2)}h
//                                           {log.notes && ` - ${log.notes.substring(0, 50)}`}
//                                         </div>
//                                       ))}
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                               <div>
//                                 <h4 className="font-medium text-gray-700 mb-2 text-sm">Timeline</h4>
//                                 <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
//                                   <p><span className="text-gray-500">Picked At:</span> {formatDate(task.picked_at)}</p>
//                                   {task.started_at && (
//                                     <p><span className="text-gray-500">Last Started:</span> {formatDate(task.started_at)}</p>
//                                   )}
//                                   <p><span className="text-gray-500">Deadline:</span> {formatDate(task.end_date)}</p>
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



//////////////




// src/features/tasks/MyTasks.jsx
import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  Calendar,
  Timer,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Briefcase,
  Loader2,
  Save,
  X,
  RefreshCw,
  TrendingUp,
  History,
  Edit3,
  Play,
  StopCircle,
  AlertCircle,
  Eye  // ← Added missing Eye import
} from 'lucide-react';
import { 
  fetchUserTasks, 
  saveDailyWorkLog,
  updateTaskProgress,
  calculateStats,
  updateTaskLocally
} from './taskSlice';
import { showSnackbar } from '../notifications/notificationSlice';
import { useNavigate } from 'react-router-dom';

const MyTasks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { userTasks = [], loading = false, updating = false, stats = { total: 0, inProgress: 0, completed: 0, pending: 0, totalTimeSpent: 0 } } = useSelector((state) => state.tasks || {});
  
  const [expandedTasks, setExpandedTasks] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showTimeLogModal, setShowTimeLogModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [progressValue, setProgressValue] = useState(0);
  const [timeLogData, setTimeLogData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    note: '',
    status: 'WORKED'
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchTasks();
    }
  }, [dispatch, user?.id]);

  const fetchTasks = async () => {
    await dispatch(fetchUserTasks(user.id));
  };

  useEffect(() => {
    if (userTasks.length > 0) {
      dispatch(calculateStats());
    }
  }, [userTasks, dispatch]);

  const handleSaveProgress = async () => {
    if (!selectedTask) return;
    
    setIsSaving(true);
    try {
      await dispatch(updateTaskProgress({ 
        subActivityId: selectedTask.id, 
        empCode: user?.id,
        completedQuantity: progressValue
      })).unwrap();
      
      dispatch(showSnackbar({
        message: 'Progress updated successfully!',
        type: 'success'
      }));
      
      setShowProgressModal(false);
      setSelectedTask(null);
      setProgressValue(0);
      fetchTasks();
    } catch (error) {
      dispatch(showSnackbar({
        message: error.message || 'Failed to update progress',
        type: 'error'
      }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveTimeLog = async () => {
    if (!selectedTask) return;
    
    // Validate
    if (timeLogData.status === 'NOT_WORKED') {
      if (!timeLogData.note.trim()) {
        dispatch(showSnackbar({
          message: 'Please provide a reason for not working',
          type: 'error'
        }));
        return;
      }
    } else {
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
    }
    
    setIsSaving(true);
    try {
      await dispatch(saveDailyWorkLog({
        subActivityId: selectedTask.id,
        empCode: user?.id,
        date: timeLogData.date,
        startTime: timeLogData.status === 'WORKED' ? timeLogData.startTime : null,
        endTime: timeLogData.status === 'WORKED' ? timeLogData.endTime : null,
        note: timeLogData.note,
        status: timeLogData.status
      })).unwrap();
      
      dispatch(showSnackbar({
        message: timeLogData.status === 'WORKED' ? 'Work hours saved successfully!' : 'Leave record saved successfully!',
        type: 'success'
      }));
      
      setShowTimeLogModal(false);
      setSelectedTask(null);
      setTimeLogData({
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        note: '',
        status: 'WORKED'
      });
      fetchTasks();
    } catch (error) {
      dispatch(showSnackbar({
        message: error.message || 'Failed to save record',
        type: 'error'
      }));
    } finally {
      setIsSaving(false);
    }
  };

  const toggleTaskExpand = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const filteredTasks = userTasks.filter(task => {
    const matchesSearch = 
      task.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.activity_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.subactivity_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || task.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Group filtered tasks by project
  const groupedTasks = useMemo(() => {
    return filteredTasks.reduce((acc, task) => {
      if (!acc[task.project_id]) {
        acc[task.project_id] = {
          project_name: task.project_name,
          project_code: task.project_code,
          tasks: []
        };
      }
      acc[task.project_id].tasks.push(task);
      return acc;
    }, {});
  }, [filteredTasks]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'COMPLETED': return 'bg-green-100 text-green-600 border-green-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
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

  const formatTime = (hours) => {
    if (!hours) return '0h';
    const hrs = Math.floor(hours);
    const mins = Math.round((hours - hrs) * 60);
    if (mins === 0) return `${hrs}h`;
    return `${hrs}h ${mins}m`;
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'short'
      });
    } catch {
      return dateTimeString;
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

  if (loading && userTasks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl flex items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <div>
            <p className="text-lg font-semibold text-gray-800">Loading Tasks</p>
            <p className="text-sm text-gray-500">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-6"
    >
      {/* Progress Update Modal */}
      <AnimatePresence>
        {showProgressModal && selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowProgressModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Update Progress</h3>
                <button onClick={() => setShowProgressModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Task</label>
                <p className="text-gray-800 font-medium">{selectedTask.subactivity_name}</p>
                <p className="text-sm text-gray-500">{selectedTask.project_name}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Completed Quantity ({selectedTask.unit})
                </label>
                <input
                  type="number"
                  min="0"
                  max={selectedTask.total_quantity}
                  step="0.01"
                  value={progressValue}
                  onChange={(e) => setProgressValue(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Max: {selectedTask.total_quantity} {selectedTask.unit} | Current: {selectedTask.completed_quantity || 0}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowProgressModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProgress}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Save Progress
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Time Log Modal - Simple Start/End Time */}
      <AnimatePresence>
        {showTimeLogModal && selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowTimeLogModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Daily Work Log</h3>
                <button onClick={() => setShowTimeLogModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Task</label>
                <p className="text-gray-800 font-medium">{selectedTask.subactivity_name}</p>
                <p className="text-sm text-gray-500">{selectedTask.project_name}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={timeLogData.date}
                  onChange={(e) => setTimeLogData({ ...timeLogData, date: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTimeLogData({ ...timeLogData, status: 'WORKED' })}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                      timeLogData.status === 'WORKED'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <Play size={18} />
                    <span>Worked</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeLogData({ ...timeLogData, status: 'NOT_WORKED' })}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                      timeLogData.status === 'NOT_WORKED'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <StopCircle size={18} />
                    <span>Not Worked</span>
                  </button>
                </div>
              </div>

              {timeLogData.status === 'WORKED' ? (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                      <input
                        type="time"
                        value={timeLogData.startTime}
                        onChange={(e) => setTimeLogData({ ...timeLogData, startTime: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                      <input
                        type="time"
                        value={timeLogData.endTime}
                        onChange={(e) => setTimeLogData({ ...timeLogData, endTime: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  {timeLogData.startTime && timeLogData.endTime && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-700">Total Hours:</span>
                        <span className="text-lg font-bold text-blue-700">
                          {calculateHours(timeLogData.startTime, timeLogData.endTime).toFixed(2)} hrs
                        </span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for not working *</label>
                  <textarea
                    value={timeLogData.note}
                    onChange={(e) => setTimeLogData({ ...timeLogData, note: e.target.value })}
                    placeholder="Please explain why you couldn't work today..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                <textarea
                  value={timeLogData.note}
                  onChange={(e) => setTimeLogData({ ...timeLogData, note: e.target.value })}
                  placeholder="Any additional notes about your work..."
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowTimeLogModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTimeLog}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Save Record
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Tasks</h1>
          <p className="text-gray-500">Track your tasks and log daily work hours</p>
        </div>
        <button
          onClick={fetchTasks}
          disabled={loading}
          className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 flex items-center gap-2"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          <span className="text-sm">Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <p className="text-sm text-gray-500">Total Tasks</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total || 0}</p>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02 }} className="bg-blue-50 rounded-xl p-4 shadow-md border border-blue-100">
          <p className="text-sm text-blue-600">In Progress</p>
          <p className="text-2xl font-bold text-blue-700">{stats.inProgress || 0}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-green-50 rounded-xl p-4 shadow-md border border-green-100">
          <p className="text-sm text-green-600">Completed</p>
          <p className="text-2xl font-bold text-green-700">{stats.completed || 0}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-purple-50 rounded-xl p-4 shadow-md border border-purple-100">
          <p className="text-sm text-purple-600">Total Time</p>
          <p className="text-2xl font-bold text-purple-700">
            {formatTime(stats.totalTimeSpent || 0)}
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tasks by project or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white min-w-[160px]"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      {/* Tasks List - Grouped by Project */}
      {Object.keys(groupedTasks).length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
          <Briefcase size={64} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Tasks Found</h2>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterStatus !== 'all' 
              ? 'No tasks match your filters' 
              : "You haven't picked any tasks yet."}
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
          {Object.entries(groupedTasks).map(([projectId, project]) => (
            <div key={projectId} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              {/* Project Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Briefcase size={20} className="text-blue-600" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{project.project_name}</h3>
                    <p className="text-xs text-gray-500">Code: {project.project_code}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/my-picked-projects/${projectId}`)}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm"
                  >
                    <Eye size={16} />
                    View Project
                  </button>
                  <span className="text-sm text-gray-500">
                    {project.tasks.length} tasks
                  </span>
                </div>
              </div>

              {/* Tasks List */}
              <div className="divide-y divide-gray-100">
                {project.tasks.map((task) => {
                  const isExpanded = expandedTasks[task.id];
                  const taskProgress = task.progress || 0;
                  const isCompleted = task.status === 'COMPLETED';
                  const latestWorkLog = task.work_logs?.[task.work_logs.length - 1];
                  
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Task Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h4 className="font-semibold text-gray-800">{task.subactivity_name}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            {task.activity_name}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              Picked: {formatDate(task.picked_at)}
                            </span>
                            {task.unit !== 'status' && (
                              <span>
                                Progress: {task.completed_quantity || 0}/{task.total_quantity || 0} {task.unit}
                              </span>
                            )}
                            {task.total_time_spent > 0 && (
                              <span className="flex items-center gap-1">
                                <Timer size={12} />
                                Total: {formatTime(task.total_time_spent)}
                              </span>
                            )}
                            {latestWorkLog && (
                              <span className="flex items-center gap-1 text-blue-600">
                                <History size={12} />
                                Last: {latestWorkLog.date}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          {!isCompleted && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedTask(task);
                                  setProgressValue(task.completed_quantity || 0);
                                  setShowProgressModal(true);
                                }}
                                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                title="Update progress"
                              >
                                <Edit3 size={18} />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedTask(task);
                                  setTimeLogData({
                                    date: new Date().toISOString().split('T')[0],
                                    startTime: '',
                                    endTime: '',
                                    note: '',
                                    status: 'WORKED'
                                  });
                                  setShowTimeLogModal(true);
                                }}
                                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                title="Log daily work"
                              >
                                <Clock size={18} />
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => toggleTaskExpand(task.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {task.unit !== 'status' && !isCompleted && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-semibold text-blue-600">{taskProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${taskProgress}%` }}
                              className={`h-2 rounded-full ${getProgressColor(taskProgress)}`}
                            />
                          </div>
                        </div>
                      )}

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4 pt-4 border-t border-gray-100"
                          >
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-gray-700 mb-2 text-sm">Task Details</h4>
                                <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
                                  <p><span className="text-gray-500">Unit:</span> {task.unit}</p>
                                  {task.unit !== 'status' && (
                                    <>
                                      <p><span className="text-gray-500">Planned Quantity:</span> {task.total_quantity}</p>
                                      <p><span className="text-gray-500">Completed Quantity:</span> {task.completed_quantity || 0}</p>
                                    </>
                                  )}
                                  <p><span className="text-gray-500">Total Time Spent:</span> {formatTime(task.total_time_spent || 0)}</p>
                                  <p><span className="text-gray-500">Deadline:</span> {formatDate(task.end_date)}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-700 mb-2 text-sm">Work History</h4>
                                <div className="bg-gray-50 p-3 rounded-lg space-y-2 max-h-48 overflow-y-auto">
                                  {task.work_logs && task.work_logs.length > 0 ? (
                                    task.work_logs.slice().reverse().map((log, idx) => (
                                      <div key={idx} className="text-xs border-b border-gray-200 pb-2 last:border-0">
                                        <div className="font-medium text-gray-700">{log.date}</div>
                                        {log.status === 'WORKED' ? (
                                          <>
                                            <div className="text-gray-600">
                                              {log.start_time?.split('T')[1]?.substring(0, 5)} - {log.end_time?.split('T')[1]?.substring(0, 5)}
                                              <span className="ml-2 text-blue-600">{log.hours_worked?.toFixed(2)}h</span>
                                            </div>
                                            {log.completed_quantity > 0 && (
                                              <div className="text-green-600">Completed: {log.completed_quantity}</div>
                                            )}
                                          </>
                                        ) : (
                                          <div className="text-red-600 flex items-center gap-1">
                                            <AlertCircle size={12} />
                                            Not Worked
                                          </div>
                                        )}
                                        {log.note && <div className="text-gray-500 italic">"{log.note.substring(0, 60)}"</div>}
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-gray-500 text-center py-2">No work logs yet</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MyTasks;