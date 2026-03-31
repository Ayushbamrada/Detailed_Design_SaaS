
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
    
      const projectId = project.id || project.project_id;
      const projectName = project.name || project.project_name;
      const projectCode = project.code || project.project_code;
      const activityId = activity.id || activity.activity_id;
      const activityName = activity.name || activity.activity_name;
      const subActivityName = subActivity.name || subActivity.subactivity_name;
      const unit = subActivity.unit || subActivity.unit_display || 'status';
      const totalQuantity = subActivity.plannedQty || subActivity.total_quantity || 0;
      const deadline = subActivity.endDate || subActivity.end_date || activity.endDate || activity.end_date || project.completionDate || project.completion_date;

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

        
        <div className="bg-blue-50 p-4 rounded-xl mb-3">
          <p className="text-xs font-semibold text-blue-700 mb-1">PROJECT</p>
          <p className="font-medium text-gray-800">{project.name}</p>
          <p className="text-xs text-gray-500 mt-1">Code: {project.code}</p>
        </div>

        
        <div className="bg-purple-50 p-4 rounded-xl mb-3">
          <p className="text-xs font-semibold text-purple-700 mb-1">ACTIVITY</p>
          <p className="font-medium text-gray-800">{activity.name}</p>
        </div>

        
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

        
        {(subActivity.endDate || activity.endDate || project.completionDate) && (
          <div className="bg-yellow-50 p-4 rounded-xl mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={16} className="text-yellow-600" />
              <span className="text-xs font-semibold text-yellow-700">DEADLINE</span>
            </div>
            <p className="font-medium text-gray-800">
              {formatDate(subActivity.endDate || activity.endDate || project.completionDate)}
            </p>
          </div>
        )}

        
        <div className="bg-blue-50 p-3 rounded-lg mb-4 flex items-start gap-2">
          <AlertCircle size={16} className="text-blue-600 mt-0.5" />
          <p className="text-xs text-blue-700">
            This task will be added to your <strong>My Tasks</strong> list under the project <strong>{project.name}</strong>.
            You can track your progress and log daily work hours.
          </p>
        </div>

        
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