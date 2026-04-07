import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, FileText, AlertCircle } from "lucide-react";

const ActivityExtensionModal = ({ isOpen, onClose, onSubmit, item, itemType }) => {
  const [newDate, setNewDate] = useState("");
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newDate) {
      alert("Please select a new deadline date");
      return;
    }
    if (!reason.trim()) {
      alert("Please provide a reason for extension");
      return;
    }
    onSubmit({ newDate, reason });
  };

  const getItemName = () => {
    if (itemType === "activity") return item?.name;
    if (itemType === "subactivity") return `${item?.name} (in ${item?.parentActivity})`;
    return "";
  };

  const getCurrentDate = () => {
    console.log(item, "item");
    if (itemType === "activity") return item?.endDate;
    if (itemType === "subactivity") return item?.endDate;
    return "";
  };

  const calculateDaysLeft = (date) => {
    if (!date) return null;
    const today = new Date();
    const target = new Date(date);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = calculateDaysLeft(getCurrentDate());

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Calendar size={24} />
                  Extend {itemType === "activity" ? "Activity" : "Sub-Activity"} Deadline
                </h3>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm text-blue-100 mt-2">{getItemName()}</p>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Current Deadline Info */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-sm text-gray-600">Current Deadline</p>
                <p className="text-lg font-semibold text-gray-800">
                  {new Date(getCurrentDate()).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                {daysLeft !== null && (
                  <p className={`text-sm mt-1 ${
                    daysLeft < 0 ? "text-red-600" :
                    daysLeft === 0 ? "text-orange-600" :
                    daysLeft <= 2 ? "text-orange-500" :
                    "text-green-600"
                  }`}>
                    {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` :
                     daysLeft === 0 ? "Due today" :
                     `${daysLeft} days remaining`}
                  </p>
                )}
              </div>

              {/* New Deadline */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Calendar size={16} className="text-blue-600" />
                  New Deadline Date *
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <FileText size={16} className="text-blue-600" />
                  Reason for Extension *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please provide detailed reason for deadline extension..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Info Box */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                <div className="flex gap-2">
                  <AlertCircle className="text-yellow-600 flex-shrink-0" size={18} />
                  <p className="text-xs text-yellow-700">
                    Extending this {itemType} will automatically update the project deadline if this becomes the latest date.
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Extend Deadline
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ActivityExtensionModal;