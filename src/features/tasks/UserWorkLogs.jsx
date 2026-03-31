
// import { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Clock, 
//   Calendar, 
//   Search,
//   Filter,
//   Loader2,
//   RefreshCw,
//   TrendingUp,
//   Briefcase,
//   ChevronDown,
//   ChevronUp,
//   FileText,
//   AlertCircle,
//   CheckCircle,
//   XCircle,
//   Timer,
//   Building2
// } from 'lucide-react';
// import { fetchUserWorkLogs, calculateWorkLogStats } from './taskSlice';
// import { useNavigate } from 'react-router-dom';

// const UserWorkLogs = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.auth);
//   const { userWorkLogs = [], loading = false, workLogStats = { totalHours: 0, totalEntries: 0, byDate: {}, byProject: {} } } = useSelector((state) => state.tasks || {});
  
//   const [expandedLogs, setExpandedLogs] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterDate, setFilterDate] = useState('');
//   const [filterProject, setFilterProject] = useState('all');
//   const [selectedLog, setSelectedLog] = useState(null);

//   useEffect(() => {
//     if (user?.id) {
//       fetchWorkLogs();
//     }
//   }, [dispatch, user?.id]);

//   const fetchWorkLogs = async () => {
//     await dispatch(fetchUserWorkLogs());
//     dispatch(calculateWorkLogStats());
//   };

//   useEffect(() => {
//     if (userWorkLogs.length > 0) {
//       dispatch(calculateWorkLogStats());
//     }
//   }, [userWorkLogs, dispatch]);

//   const toggleLogExpand = (logId) => {
//     setExpandedLogs(prev => ({
//       ...prev,
//       [logId]: !prev[logId]
//     }));
//   };

//   // Get unique projects for filter
//   const uniqueProjects = [...new Set(userWorkLogs.map(log => log.project_name))];

//   // Filter logs
//   const filteredLogs = userWorkLogs.filter(log => {
//     const matchesSearch = 
//       log.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       log.subactivity_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       log.activity_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesDate = !filterDate || log.date === filterDate;
//     const matchesProject = filterProject === 'all' || log.project_name === filterProject;
    
//     return matchesSearch && matchesDate && matchesProject;
//   });

//   // Sort logs by date (newest first)
//   const sortedLogs = [...filteredLogs].sort((a, b) => 
//     new Date(b.start_time) - new Date(a.start_time)
//   );

//   const formatDateTime = (dateTimeString) => {
//     if (!dateTimeString) return 'N/A';
//     try {
//       const date = new Date(dateTimeString);
//       return date.toLocaleString('en-IN', {
//         day: 'numeric',
//         month: 'short',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch {
//       return dateTimeString;
//     }
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

//   const formatDuration = (seconds) => {
//     if (!seconds) return '0h';
//     const hours = seconds / 3600;
//     const hrs = Math.floor(hours);
//     const mins = Math.round((hours - hrs) * 60);
//     if (mins === 0) return `${hrs}h`;
//     return `${hrs}h ${mins}m`;
//   };

//   const getEntryTypeIcon = (type) => {
//     switch(type) {
//       case 'WORK_LOG': return <CheckCircle size={16} className="text-green-600" />;
//       case 'LEAVE': return <XCircle size={16} className="text-red-600" />;
//       default: return <Clock size={16} className="text-blue-600" />;
//     }
//   };

//   const getEntryTypeColor = (type) => {
//     switch(type) {
//       case 'WORK_LOG': return 'bg-green-100 text-green-700 border-green-200';
//       case 'LEAVE': return 'bg-red-100 text-red-700 border-red-200';
//       default: return 'bg-blue-100 text-blue-700';
//     }
//   };

//   if (loading && userWorkLogs.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="bg-white rounded-2xl p-8 shadow-xl flex items-center gap-4">
//           <Loader2 className="animate-spin text-blue-600" size={32} />
//           <div>
//             <p className="text-lg font-semibold text-gray-800">Loading Work Logs</p>
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
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">My Work Logs</h1>
//           <p className="text-gray-500">Track your daily work hours and leave records</p>
//         </div>
//         <button
//           onClick={fetchWorkLogs}
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
//           <div className="flex items-center gap-2 mb-2">
//             <Timer size={18} className="text-blue-600" />
//             <p className="text-sm text-gray-500">Total Hours Worked</p>
//           </div>
//           <p className="text-2xl font-bold text-gray-800">{workLogStats.totalHours || 0} hrs</p>
//         </motion.div>
        
//         <motion.div whileHover={{ scale: 1.02 }} className="bg-green-50 rounded-xl p-4 shadow-md border border-green-100">
//           <div className="flex items-center gap-2 mb-2">
//             <CheckCircle size={18} className="text-green-600" />
//             <p className="text-sm text-green-600">Total Entries</p>
//           </div>
//           <p className="text-2xl font-bold text-green-700">{workLogStats.totalEntries || 0}</p>
//         </motion.div>

//         <motion.div whileHover={{ scale: 1.02 }} className="bg-purple-50 rounded-xl p-4 shadow-md border border-purple-100">
//           <div className="flex items-center gap-2 mb-2">
//             <Briefcase size={18} className="text-purple-600" />
//             <p className="text-sm text-purple-600">Projects Worked</p>
//           </div>
//           <p className="text-2xl font-bold text-purple-700">{Object.keys(workLogStats.byProject || {}).length}</p>
//         </motion.div>

//         <motion.div whileHover={{ scale: 1.02 }} className="bg-orange-50 rounded-xl p-4 shadow-md border border-orange-100">
//           <div className="flex items-center gap-2 mb-2">
//             <Calendar size={18} className="text-orange-600" />
//             <p className="text-sm text-orange-600">Active Days</p>
//           </div>
//           <p className="text-2xl font-bold text-orange-700">{Object.keys(workLogStats.byDate || {}).length}</p>
//         </motion.div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search by project or task..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
          
//           <div className="relative">
//             <input
//               type="date"
//               value={filterDate}
//               onChange={(e) => setFilterDate(e.target.value)}
//               className="pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white min-w-[160px]"
//               placeholder="Filter by date"
//             />
//             <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//           </div>

//           <div className="relative">
//             <select
//               value={filterProject}
//               onChange={(e) => setFilterProject(e.target.value)}
//               className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white min-w-[180px]"
//             >
//               <option value="all">All Projects</option>
//               {uniqueProjects.map(project => (
//                 <option key={project} value={project}>{project}</option>
//               ))}
//             </select>
//             <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//           </div>
//         </div>
//       </div>

//       {/* Work Logs List */}
//       {sortedLogs.length === 0 ? (
//         <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
//           <FileText size={64} className="mx-auto mb-4 text-gray-300" />
//           <h2 className="text-xl font-semibold text-gray-700 mb-2">No Work Logs Found</h2>
//           <p className="text-gray-500 mb-4">
//             {searchTerm || filterDate || filterProject !== 'all' 
//               ? 'No logs match your filters' 
//               : "You haven't logged any work hours yet."}
//           </p>
//           <button
//             onClick={() => navigate('/my-tasks')}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Go to My Tasks
//           </button>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {sortedLogs.map((log) => {
//             const isExpanded = expandedLogs[log.id];
            
//             return (
//               <motion.div
//                 key={log.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
//               >
//                 <div className="p-4">
//                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                     {/* Log Info */}
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-2 flex-wrap">
//                         {getEntryTypeIcon(log.entry_type)}
//                         <span className={`text-xs px-2 py-1 rounded-full ${getEntryTypeColor(log.entry_type)}`}>
//                           {log.entry_type === 'WORK_LOG' ? 'Work Log' : 'Leave'}
//                         </span>
//                         <h4 className="font-semibold text-gray-800">{log.subactivity_name}</h4>
//                       </div>
                      
//                       <div className="text-sm text-gray-600 mb-2">
//                         {log.activity_name}
//                       </div>

//                       <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
//                         <span className="flex items-center gap-1">
//                           <Building2 size={12} />
//                           {log.project_name}
//                         </span>
//                         {log.entry_type === 'WORK_LOG' && (
//                           <>
//                             <span className="flex items-center gap-1">
//                               <Clock size={12} />
//                               {formatDateTime(log.start_time)} - {formatDateTime(log.end_time)}
//                             </span>
//                             <span className="flex items-center gap-1 text-blue-600">
//                               <Timer size={12} />
//                               {formatDuration(log.duration)}
//                             </span>
//                           </>
//                         )}
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => toggleLogExpand(log.id)}
//                         className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                       >
//                         {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                       </button>
//                     </div>
//                   </div>

//                   {/* Expanded Details */}
//                   <AnimatePresence>
//                     {isExpanded && (
//                       <motion.div
//                         initial={{ height: 0, opacity: 0 }}
//                         animate={{ height: 'auto', opacity: 1 }}
//                         exit={{ height: 0, opacity: 0 }}
//                         className="mt-4 pt-4 border-t border-gray-100"
//                       >
//                         <div className="grid md:grid-cols-2 gap-4">
//                           <div>
//                             <h4 className="font-medium text-gray-700 mb-2 text-sm">Log Details</h4>
//                             <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
//                               <p><span className="text-gray-500">Date:</span> {formatDate(log.date)}</p>
//                               <p><span className="text-gray-500">Project:</span> {log.project_name}</p>
//                               <p><span className="text-gray-500">Activity:</span> {log.activity_name}</p>
//                               <p><span className="text-gray-500">Task:</span> {log.subactivity_name}</p>
//                               {log.entry_type === 'WORK_LOG' && (
//                                 <>
//                                   <p><span className="text-gray-500">Start Time:</span> {formatDateTime(log.start_time)}</p>
//                                   <p><span className="text-gray-500">End Time:</span> {formatDateTime(log.end_time)}</p>
//                                   <p><span className="text-gray-500">Duration:</span> {formatDuration(log.duration)}</p>
//                                 </>
//                               )}
//                             </div>
//                           </div>
//                           <div>
//                             <h4 className="font-medium text-gray-700 mb-2 text-sm">Notes</h4>
//                             <div className="bg-gray-50 p-3 rounded-lg">
//                               <p className="text-sm text-gray-600">
//                                 {log.note || 'No notes provided'}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>
//       )}

//       {/* Summary Info */}
//       {sortedLogs.length > 0 && (
//         <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-start gap-3">
//           <TrendingUp size={20} className="text-blue-600 mt-0.5" />
//           <div>
//             <h4 className="font-semibold text-blue-800 mb-1">Work Summary</h4>
//             <p className="text-sm text-blue-700">
//               You have logged <strong>{workLogStats.totalHours} hours</strong> across <strong>{Object.keys(workLogStats.byProject).length} projects</strong>.
//               Total of <strong>{workLogStats.totalEntries} entries</strong> recorded.
//             </p>
//           </div>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default UserWorkLogs;


import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Calendar, 
  Search,
  Filter,
  Loader2,
  RefreshCw,
  TrendingUp,
  Briefcase,
  FileText,
  CheckCircle,
  XCircle,
  Timer,
  Building2
} from 'lucide-react';
import { fetchUserWorkSummary } from './taskSlice';
import { useNavigate } from 'react-router-dom';
import LoadingModal from '../../components/modals/LoadingModal';

const UserWorkLogs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { userWorkSummary = null, loading = false } = useSelector((state) => state.tasks || {});
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState('all');

  useEffect(() => {
    if (user?.id) {
      fetchWorkSummary();
    }
  }, [dispatch, user?.id]);

  const fetchWorkSummary = async () => {
    await dispatch(fetchUserWorkSummary(user?.id));
  };

  const formatDuration = (timeString) => {
    if (!timeString || timeString === '00:00:00') return '0h';
    const parts = timeString.split(':');
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  // Get all subactivities across all projects for detailed view
  const allSubActivities = [];
  userWorkSummary?.projects?.forEach(project => {
    project.activities?.forEach(activity => {
      activity.subactivities?.forEach(sub => {
        allSubActivities.push({
          ...sub,
          project_name: project.project_name,
          project_id: project.project_id,
          activity_name: activity.activity_name,
          activity_id: activity.activity_id
        });
      });
    });
  });

  // Filter subactivities
  const filteredSubActivities = allSubActivities.filter(sub => {
    const matchesSearch = 
      sub.subactivity_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.activity_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProject = filterProject === 'all' || sub.project_name === filterProject;
    
    return matchesSearch && matchesProject;
  });

  // Get unique projects for filter
  const uniqueProjects = [...new Set(allSubActivities.map(sub => sub.project_name))];

  const totalHours = allSubActivities.reduce((sum, sub) => {
    const parts = sub.total_time_spent?.split(':') || ['0', '0', '0'];
    const hours = parseInt(parts[0]);
    return sum + hours;
  }, 0);

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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Work Logs</h1>
          <p className="text-gray-500">Detailed view of all your work entries</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Timer size={18} className="text-blue-600" />
            <p className="text-sm text-gray-500">Total Hours</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalHours} hrs</p>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02 }} className="bg-green-50 rounded-xl p-4 shadow-md border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase size={18} className="text-green-600" />
            <p className="text-sm text-green-600">Projects</p>
          </div>
          <p className="text-2xl font-bold text-green-700">{uniqueProjects.length}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-purple-50 rounded-xl p-4 shadow-md border border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={18} className="text-purple-600" />
            <p className="text-sm text-purple-600">Activities</p>
          </div>
          <p className="text-2xl font-bold text-purple-700">
            {userWorkSummary?.projects?.reduce((sum, p) => sum + (p.activities?.length || 0), 0) || 0}
          </p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-orange-50 rounded-xl p-4 shadow-md border border-orange-100">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={18} className="text-orange-600" />
            <p className="text-sm text-orange-600">Total Tasks</p>
          </div>
          <p className="text-2xl font-bold text-orange-700">{allSubActivities.length}</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by project, activity, or task..."
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

      {/* Work Logs List */}
      {filteredSubActivities.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
          <FileText size={64} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Work Logs Found</h2>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterProject !== 'all' 
              ? 'No logs match your filters' 
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
        <div className="space-y-3">
          {filteredSubActivities.map((sub, index) => (
            <motion.div
              key={`${sub.subactivity_id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                      {sub.project_name}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-600">
                      {sub.activity_name}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1">{sub.subactivity_name}</h4>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Building2 size={12} />
                      Project ID: {sub.project_id}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Time Spent</p>
                    <p className="text-lg font-bold text-blue-600">{formatDuration(sub.total_time_spent)}</p>
                  </div>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${Math.min(100, (parseInt(sub.total_time_spent?.split(':')[0]) || 0) * 10)}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Summary Info */}
      {filteredSubActivities.length > 0 && (
        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-start gap-3">
          <TrendingUp size={20} className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">Work Summary</h4>
            <p className="text-sm text-blue-700">
              You have logged <strong>{totalHours} hours</strong> across <strong>{uniqueProjects.length} projects</strong>.
              Total of <strong>{filteredSubActivities.length} task entries</strong> recorded.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UserWorkLogs;