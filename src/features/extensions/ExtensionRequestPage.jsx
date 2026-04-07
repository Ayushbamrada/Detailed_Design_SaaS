import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  Calendar,
  ArrowLeft,
  Upload,
  X,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  Download
} from "lucide-react";
import { requestExtension } from "../projects/projectSlice";
import { showSnackbar } from "../notifications/notificationSlice";


const ExtensionRequestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef();

  const { user } = useSelector((state) => state.auth);
  const project = useSelector((state) =>
    state.projects.projects.find((p) => p.id === id)
  );

  const [formData, setFormData] = useState({
    newDeadline: "",
    reason: "",
    documents: []
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Project not found</h2>
          <button
            onClick={() => navigate("/projects")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  // Check if user has access to this project
  const hasAccess =
    user?.role === "ACCOUNT" ||
    user?.role === "ADMIN" ||
    project.assignedUsers?.includes(user?.id);

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to extend this project's deadline.</p>
          <button
            onClick={() => navigate(`/projects/${id}`)}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Project
          </button>
        </div>
      </div>
    );
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));

    setUploadedFiles([...uploadedFiles, ...newFiles]);
    setFormData({
      ...formData,
      documents: [...formData.documents, ...newFiles]
    });
  };

  const removeFile = (fileId) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId));
    setFormData({
      ...formData,
      documents: formData.documents.filter(f => f.id !== fileId)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.newDeadline) {
      dispatch(showSnackbar({
        message: "Please select a new deadline date",
        type: "error"
      }));
      return;
    }

    if (!formData.reason.trim()) {
      dispatch(showSnackbar({
        message: "Please provide a reason for extension",
        type: "error"
      }));
      return;
    }

    const newDeadlineDate = new Date(formData.newDeadline);
    const currentDeadlineDate = new Date(project.completionDate);

    if (newDeadlineDate <= currentDeadlineDate) {
      dispatch(showSnackbar({
        message: "New deadline must be after current deadline",
        type: "error"
      }));
      return;
    }

    setIsSubmitting(true);

    // Simulate file upload (in real app, you'd upload to server)
    const documents = uploadedFiles.map(f => ({
      name: f.name,
      size: f.size,
      type: f.type,
      uploadedAt: new Date().toISOString()
    }));

    dispatch(requestExtension({
      projectId: project.id,
      newDeadline: formData.newDeadline,
      reason: formData.reason,
      documents,
      requestedBy: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    }));

    dispatch(showSnackbar({
      message: "Extension request submitted successfully",
      type: "success"
    }));

    setTimeout(() => {
      navigate(`/projects/${id}`);
    }, 1500);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const calculateDaysUntilDeadline = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(date);
    deadline.setHours(0, 0, 0, 0);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = calculateDaysUntilDeadline(project.completionDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 px-4 py-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/projects/${id}`)}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Extend Project Deadline</h1>
          <p className="text-sm text-gray-500">{project.name} | Code: {project.code}</p>
        </div>
      </div>

      {/* Project Info Card */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600">Current Deadline</p>
            <p className="text-xl font-bold text-gray-800">
              {new Date(project.completionDate).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className={`text-sm mt-1 ${daysLeft < 0 ? "text-red-600" :
                daysLeft === 0 ? "text-orange-600" :
                  daysLeft <= 7 ? "text-yellow-600" :
                    "text-green-600"
              }`}>
              {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` :
                daysLeft === 0 ? "Due today" :
                  `${daysLeft} days remaining`}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Project Progress</p>
            <p className="text-xl font-bold text-gray-800">{project.progress || 0}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="h-2 rounded-full bg-blue-600"
                style={{ width: `${project.progress || 0}%` }}
              />
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className={`text-xl font-bold ${project.status === "DELAYED" ? "text-red-600" :
                project.status === "COMPLETED" ? "text-green-600" :
                  "text-blue-600"
              }`}>
              {project.status}
            </p>
          </div>
        </div>
      </div>

      {/* Extension Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Extension Request Details</h2>

        <div className="space-y-6">
          {/* New Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Deadline Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                value={formData.newDeadline}
                onChange={(e) => setFormData({ ...formData, newDeadline: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Current deadline: {new Date(project.completionDate).toLocaleDateString()}
            </p>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Extension <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Please provide detailed reason for deadline extension..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supporting Documents (Optional)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
            >
              <Upload className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <X size={16} className="text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Extension History Preview */}
          {project.extensionHistory && project.extensionHistory.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Previous Extensions</h3>
              <div className="space-y-2">
                {project.extensionHistory.slice(-3).map((history) => (
                  <div key={history.id} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    <span className={`font-medium ${history.type === "APPROVED" ? "text-green-600" :
                        history.type === "REJECTED" ? "text-red-600" :
                          "text-yellow-600"
                      }`}>
                      {history.type}
                    </span>
                    : From {new Date(history.oldDeadline).toLocaleDateString()} to {new Date(history.newDeadline).toLocaleDateString()}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(`/projects/${id}`)}
              className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Extension Request'
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Info Box */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex gap-3">
          <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
          <div>
            <p className="text-sm font-medium text-yellow-800">Important Information</p>
            <p className="text-xs text-yellow-700 mt-1">
              Your extension request will be reviewed by an administrator. You will be notified once a decision is made.
              {user?.role === "USER" && " You can only request extensions for projects assigned to you."}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExtensionRequestPage;