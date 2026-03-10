import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, FileText } from "lucide-react";

const ExtensionModal = ({ onClose, onSubmit, projectName }) => {
  const [reason, setReason] = useState("");
  const [newDate, setNewDate] = useState("");

  const handleSubmit = () => {
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

  return (
    <AnimatePresence>
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
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Calendar size={24} />
                Request Deadline Extension
              </h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-blue-100 mt-2">{projectName}</p>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <FileText size={16} className="text-blue-600" />
                Reason for Extension *
              </label>
              <textarea
                placeholder="Please provide detailed reason for deadline extension..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className