// src/features/tasks/TaskPicker.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { X, Briefcase, Calendar, Clock, Loader2, AlertCircle } from 'lucide-react';
import { pickTask } from './taskSlice';
import { showSnackbar } from '../notifications/notificationSlice';

const TaskPicker = ({ project, activity, subActivity, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [estimatedHours, setEstimatedHours] = useState('');

  const handlePickTask = async () => {
    if (!user?.id) {
      dispatch(showSnackbar({
        message: 'User information not found',
        type: 'error'
      }));
      return;
    }

    setLoading(true);

    const taskData = {
      project_id: project.id,
      project_name: project.name || project.project_name,
      project_code: project.code || project.project_code,
      activity_id: activity.id,
      activity_name: activity.name,
      subactivity_id: subActivity.id,
      subactivity_name: subActivity.name,
      emp_code: user.id,
      emp_name: user.name,
      status: 'PENDING',
      picked_at: new Date().toISOString(),
      unit: subActivity.unit || 'status',
      planned_quantity: subActivity.plannedQty || subActivity.total_quantity || 0,
      completed_quantity: 0,
      progress: 0,
      estimated_hours: estimatedHours ? parseFloat(estimatedHours) : null,
      deadline: subActivity.endDate || activity.endDate || project.completionDate
    };

    try {
      await dispatch(pickTask(taskData)).unwrap();
      onClose();
    } catch (error) {
      console.error('Error picking task:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Briefcase size={20} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Pick this task?</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Project Info */}
        <div className="bg-blue-50 p-4 rounded-xl mb-3">
          <p className="text-xs font-semibold text-blue-700 mb-1">PROJECT</p>
          <p className="font-medium text-gray-800">{project.name}</p>
          <p className="text-xs text-gray-500 mt-1">Code: {project.code}</p>
        </div>

        {/* Activity Info */}
        <div className="bg-purple-50 p-4 rounded-xl mb-3">
          <p className="text-xs font-semibold text-purple-700 mb-1">ACTIVITY</p>
          <p className="font-medium text-gray-800">{activity.name}</p>
        </div>

        {/* Task Info */}
        <div className="bg-green-50 p-4 rounded-xl mb-4">
          <p className="text-xs font-semibold text-green-700 mb-1">TASK</p>
          <p className="font-medium text-gray-800">{subActivity.name}</p>
          <div className="flex gap-2 mt-2">
            <span className="text-xs bg-white px-2 py-1 rounded">
              Unit: {subActivity.unit || 'status'}
            </span>
            {subActivity.unit !== 'status' && subActivity.plannedQty && (
              <span className="text-xs bg-white px-2 py-1 rounded">
                Qty: {subActivity.plannedQty}
              </span>
            )}
          </div>
        </div>

        {/* Deadline */}
        {(subActivity.endDate || activity.endDate || project.completionDate) && (
          <div className="bg-yellow-50 p-4 rounded-xl mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-yellow-600" />
              <span className="text-xs font-semibold text-yellow-700">DEADLINE</span>
            </div>
            <p className="font-medium text-gray-800 mt-1">
              {formatDate(subActivity.endDate || activity.endDate || project.completionDate)}
            </p>
          </div>
        )}

        {/* Estimated Hours */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimated hours (optional)
          </label>
          <input
            type="number"
            value={estimatedHours}
            onChange={(e) => setEstimatedHours(e.target.value)}
            placeholder="e.g., 4"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.5"
          />
        </div>

        {/* Info Message */}
        <div className="bg-blue-50 p-3 rounded-lg mb-4 flex items-start gap-2">
          <AlertCircle size={16} className="text-blue-600 mt-0.5" />
          <p className="text-xs text-blue-700">
            This task will be added to your <strong>My Tasks</strong> list.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePickTask}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Briefcase size={16} />
                Pick Task
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TaskPicker;