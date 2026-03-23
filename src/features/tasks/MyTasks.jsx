// src/features/tasks/MyTasks.jsx
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  Play,
  StopCircle,
  AlertCircle,
  Calendar,
  BarChart3,
  Timer,
  ChevronDown,
  ChevronUp,
  Search,
  Filter
} from 'lucide-react';
import { 
  fetchUserTasks, 
  startTask, 
  stopTask,
  updateTaskProgress 
} from './taskSlice';
import { showSnackbar } from '../notifications/notificationSlice';

const MyTasks = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userTasks, loading, stats } = useSelector((state) => state.tasks);
  
  const [expandedTasks, setExpandedTasks] = useState({});
  const [activeTimer, setActiveTimer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [elapsedTime, setElapsedTime] = useState({});

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserTasks(user.id));
    }
  }, [dispatch, user?.id]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (activeTimer) {
      interval = setInterval(() => {
        const task = userTasks.find(t => t.id === activeTimer);
        if (task && task.started_at) {
          const start = new Date(task.started_at);
          const now = new Date();
          const diff = now - start;
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          
          setElapsedTime(prev => ({
            ...prev,
            [activeTimer]: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
          }));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer, userTasks]);

  const handleStartTask = (task) => {
    dispatch(startTask({ taskId: task.id, empCode: user?.id }));
    setActiveTimer(task.id);
    dispatch(showSnackbar({
      message: `Started working on: ${task.subactivity_name}`,
      type: 'info'
    }));
  };

  const handleStopTask = (task) => {
    dispatch(stopTask({ taskId: task.id, empCode: user?.id }));
    setActiveTimer(null);
    setElapsedTime(prev => ({ ...prev, [task.id]: undefined }));
  };

  const handleProgressUpdate = (taskId, progress) => {
    dispatch(updateTaskProgress({ 
      taskId, 
      progress,
      status: progress === 100 ? 'COMPLETED' : 'IN_PROGRESS'
    }));
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

  const getStatusColor = (status) => {
    switch(status) {
      case 'COMPLETED': return 'bg-green-100 text-green-600';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-600';
      case 'PENDING': return 'bg-yellow-100 text-yellow-600';
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

  if (loading && userTasks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl flex items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading your tasks...</p>
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Tasks</h1>
        <p className="text-gray-500">Manage and track your daily work</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
        >
          <p className="text-sm text-gray-500">Total Tasks</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-blue-50 rounded-xl p-4 shadow-md border border-blue-100"
        >
          <p className="text-sm text-blue-600">In Progress</p>
          <p className="text-2xl font-bold text-blue-700">{stats.inProgress}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-green-50 rounded-xl p-4 shadow-md border border-green-100"
        >
          <p className="text-sm text-green-600">Completed</p>
          <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-purple-50 rounded-xl p-4 shadow-md border border-purple-100"
        >
          <p className="text-sm text-purple-600">Total Time</p>
          <p className="text-2xl font-bold text-purple-700">
            {stats.totalTimeSpent.toFixed(1)}h
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

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
          <CheckCircle size={64} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Tasks Found</h2>
          <p className="text-gray-500">
            {searchTerm || filterStatus !== 'all' 
              ? 'No tasks match your filters' 
              : "You haven't picked any tasks yet. Go to All Projects to pick tasks."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Task Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-semibold text-gray-800">{task.subactivity_name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                        {activeTimer === task.id && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full animate-pulse">
                            ● Active
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">{task.project_name}</span> • {task.activity_name}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          Picked: {new Date(task.picked_at).toLocaleDateString()}
                        </span>
                        {task.unit !== 'status' && (
                          <span>
                            Progress: {task.completed_quantity || 0}/{task.planned_quantity} {task.unit}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Timer and Actions */}
                    <div className="flex items-center gap-3">
                      {/* Elapsed Time Display */}
                      {task.status === 'IN_PROGRESS' && (
                        <div className="bg-blue-50 px-3 py-2 rounded-lg">
                          <div className="flex items-center gap-1 text-blue-600">
                            <Timer size={16} />
                            <span className="font-mono font-bold">
                              {elapsedTime[task.id] || '00:00:00'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {task.status === 'PENDING' && (
                          <button
                            onClick={() => handleStartTask(task)}
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            title="Start working"
                          >
                            <Play size={18} />
                          </button>
                        )}

                        {task.status === 'IN_PROGRESS' && activeTimer === task.id && (
                          <button
                            onClick={() => handleStopTask(task)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            title="Stop and complete"
                          >
                            <StopCircle size={18} />
                          </button>
                        )}

                        <button
                          onClick={() => toggleTaskExpand(task.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {expandedTasks[task.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {task.unit !== 'status' && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold text-blue-600">{task.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${task.progress || 0}%` }}
                          className={`h-2 rounded-full ${getProgressColor(task.progress || 0)}`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedTasks[task.id] && (
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
                                  <p><span className="text-gray-500">Planned Quantity:</span> {task.planned_quantity}</p>
                                  <p><span className="text-gray-500">Completed Quantity:</span> {task.completed_quantity || 0}</p>
                                </>
                              )}
                              <p><span className="text-gray-500">Total Time Spent:</span> {task.total_time_spent?.toFixed(2) || 0} hours</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2 text-sm">Timeline</h4>
                            <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
                              <p><span className="text-gray-500">Picked At:</span> {new Date(task.picked_at).toLocaleString()}</p>
                              {task.started_at && (
                                <p><span className="text-gray-500">Started At:</span> {new Date(task.started_at).toLocaleString()}</p>
                              )}
                              {task.stopped_at && (
                                <p><span className="text-gray-500">Completed At:</span> {new Date(task.stopped_at).toLocaleString()}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default MyTasks;