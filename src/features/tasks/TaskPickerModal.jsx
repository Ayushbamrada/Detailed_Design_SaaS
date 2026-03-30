// src/features/tasks/TaskPickerModal.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  X,
  CheckCircle,
  Calendar,
  Clock,
  User,
  Briefcase,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { pickTask } from './taskSlice';
import { showSnackbar } from '../notifications/notificationSlice';

const TaskPickerModal = ({ project, activity, subActivity, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const handlePickTask = async () => {
    if (!user?.id) {
      dispatch(showSnackbar({
        message: 'User information not found',
        type: 'error'
      }));
      return;
    }

    setLoading(true);

    try {
      // Get complete project details
      const projectId = project.id || project.project_id;
      const projectName = project.name || project.project_name || project.project?.name;
      const projectCode = project.code || project.project_code || project.project?.code;
      const activityId = activity.id || activity.activity_id;
      const activityName = activity.name || activity.activity_name;
      const subActivityName = subActivity.name || subActivity.subactivity_name;
      const unit = subActivity.unit || subActivity.unit_display || 'status';
      const totalQuantity = subActivity.total_quantity || subActivity.plannedQty || 0;
      const deadline = subActivity.end_date || activity.end_date || project.completion_date;

      await dispatch(pickTask({
        subActivityId: subActivity.id,
        empCode: user.id,
        empName: user.name,
        projectId: projectId,
        projectName: projectName,
        projectCode: projectCode,
        activityId: activityId,
        activityName: activityName,
        subActivityName: subActivityName,
        unit: unit,
        totalQuantity: totalQuantity,
        deadline: deadline
      })).unwrap();

      dispatch(showSnackbar({
        message: `Task "${subActivityName}" added to your tasks!`,
        type: 'success'
      }));

      onClose();
    } catch (error) {
      console.error('Error picking task:', error);
      dispatch(showSnackbar({
        message: error.message || 'Failed to pick task',
        type: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Not set';
    }
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
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Project Info */}
        <div className="bg-blue-50 p-4 rounded-xl mb-3">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase size={16} className="text-blue-600" />
            <span className="text-xs font-semibold text-blue-700 uppercase">Project</span>
          </div>
          <p className="font-medium text-gray-800">{project.name || project.project_name}</p>
          <p className="text-xs text-gray-500 mt-1">Code: {project.code || project.project_code}</p>
        </div>

        {/* Activity Info */}
        <div className="bg-purple-50 p-4 rounded-xl mb-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={16} className="text-purple-600" />
            <span className="text-xs font-semibold text-purple-700 uppercase">Activity</span>
          </div>
          <p className="font-medium text-gray-800">{activity.name || activity.activity_name}</p>
        </div>

        {/* Task Info */}
        <div className="bg-green-50 p-4 rounded-xl mb-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={16} className="text-green-600" />
            <span className="text-xs font-semibold text-green-700 uppercase">Task</span>
          </div>
          <p className="font-medium text-gray-800">{subActivity.name || subActivity.subactivity_name}</p>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="bg-white p-2 rounded-lg">
              <p className="text-xs text-gray-500">Unit</p>
              <p className="text-sm font-semibold">{subActivity.unit || 'status'}</p>
            </div>
            {subActivity.unit !== 'status' && (subActivity.total_quantity || subActivity.plannedQty) && (
              <div className="bg-white p-2 rounded-lg">
                <p className="text-xs text-gray-500">Planned Qty</p>
                <p className="text-sm font-semibold">{subActivity.total_quantity || subActivity.plannedQty}</p>
              </div>
            )}
          </div>
        </div>

        {/* Deadline Info */}
        {(subActivity.end_date || activity.end_date || project.completion_date) && (
          <div className="bg-yellow-50 p-4 rounded-xl mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={16} className="text-yellow-600" />
              <span className="text-xs font-semibold text-yellow-700 uppercase">Deadline</span>
            </div>
            <p className="font-medium text-gray-800">
              {formatDate(subActivity.end_date || activity.end_date || project.completion_date)}
            </p>
          </div>
        )}

        {/* Info Message */}
        <div className="bg-blue-50 p-3 rounded-lg mb-4 flex items-start gap-2">
          <AlertCircle size={16} className="text-blue-600 mt-0.5" />
          <p className="text-xs text-blue-700">
            This task will be added to your <strong>My Tasks</strong> list under the project <strong>{project.name || project.project_name}</strong>.
            You can track your progress and log daily work hours.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePickTask}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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

export default TaskPickerModal;