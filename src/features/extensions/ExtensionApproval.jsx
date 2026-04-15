import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from "lucide-react";
import { showSnackbar } from "../notifications/notificationSlice";


const ExtensionApproval = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { extensionRequests = [], projects } = useSelector((state) => state.projects);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [approvalComments, setApprovalComments] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [expandedRequest, setExpandedRequest] = useState(null);


  const filteredRequests = extensionRequests.filter(req => {
    if (user?.role === "ACCOUNT") return true;
    if (user?.role === "ADMIN") return true;
    return false;
  });

  const handleApprove = (request) => {

    dispatch(showSnackbar({
      message: `Extension for ${request.projectName} approved successfully`,
      type: "success"
    }));

    setSelectedRequest(null);
    setApprovalComments("");
  };

  const handleReject = (request) => {
    if (!rejectionReason.trim()) {
      dispatch(showSnackbar({
        message: "Please provide a reason for rejection",
        type: "error"
      }));
      return;
    }

    dispatch(showSnackbar({
      message: `Extension for ${request.projectName} rejected`,
      type: "warning"
    }));

    setShowRejectModal(false);
    setSelectedRequest(null);
    setRejectionReason("");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs font-semibold flex items-center gap-1">
          <Clock size={12} /> Pending
        </span>;
      case "APPROVED":
        return <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-semibold flex items-center gap-1">
          <CheckCircle size={12} /> Approved
        </span>;
      case "REJECTED":
        return <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-semibold flex items-center gap-1">
          <XCircle size={12} /> Rejected
        </span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDaysUntilDeadline = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (filteredRequests.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Extension Requests</h1>
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
          <FileText size={64} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg">No extension requests found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Extension Requests</h1>

      <div className="space-y-6">
        {filteredRequests.map((request) => {
          const project = projects.find(p => p.id === request.projectId);
          const isExpanded = expandedRequest === request.id;
          const daysLeft = calculateDaysUntilDeadline(request.currentDeadline);

          return (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-2xl shadow-xl border-2 overflow-hidden transition-all ${request.status === "PENDING" ? "border-yellow-200" :
                  request.status === "APPROVED" ? "border-green-200" :
                    "border-red-200"
                }`}
            >

              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-800">{project?.name || request.projectName}</h3>
                      {getStatusBadge(request.status)}
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Current Deadline</p>
                        <p className="font-medium text-gray-700">
                          {new Date(request.currentDeadline).toLocaleDateString()}
                        </p>
                        {daysLeft !== null && request.status === "PENDING" && (
                          <p className={`text-xs mt-1 ${daysLeft < 0 ? "text-red-600" :
                              daysLeft === 0 ? "text-orange-600" :
                                daysLeft <= 2 ? "text-orange-500" :
                                  "text-gray-400"
                            }`}>
                            {daysLeft < 0 ? "Overdue" :
                              daysLeft === 0 ? "Due today" :
                                `${daysLeft} days left`}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Requested Deadline</p>
                        <p className="font-medium text-blue-600">
                          {new Date(request.requestedDeadline).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Requested By</p>
                        <p className="font-medium text-gray-700 flex items-center gap-1">
                          <User size={14} />
                          {request.requestedBy?.name || "Unknown"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Reason:</span> {request.reason}
                      </p>
                    </div>

                    {/* Documents */}
                    {request.documents && request.documents.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
                        <div className="flex gap-2">
                          {request.documents.map((doc, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg"
                            >
                              <FileText size={14} className="text-blue-600" />
                              <span className="text-xs">{doc.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>


                  {request.status === "PENDING" && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          handleApprove(request);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <CheckCircle size={18} />
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowRejectModal(true);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2"
                      >
                        <XCircle size={18} />
                        Reject
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => setExpandedRequest(isExpanded ? null : request.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg ml-2"
                  >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-6 pt-6 border-t border-gray-200"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-3">Request Details</h4>
                          <div className="space-y-2 text-sm">
                            <p><span className="text-gray-500">Request ID:</span> {request.id}</p>
                            <p><span className="text-gray-500">Created At:</span> {formatDate(request.createdAt)}</p>
                            <p><span className="text-gray-500">Requested By:</span> {request.requestedBy?.name} ({request.requestedBy?.role})</p>
                          </div>
                        </div>

                        {request.status !== "PENDING" && (
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-3">Action Details</h4>
                            <div className="space-y-2 text-sm">
                              {request.approvedBy && (
                                <>
                                  <p><span className="text-gray-500">Approved By:</span> {request.approvedBy?.name}</p>
                                  <p><span className="text-gray-500">Approved At:</span> {formatDate(request.approvedAt)}</p>
                                </>
                              )}
                              {request.rejectedBy && (
                                <>
                                  <p><span className="text-gray-500">Rejected By:</span> {request.rejectedBy?.name}</p>
                                  <p><span className="text-gray-500">Rejected At:</span> {formatDate(request.rejectedAt)}</p>
                                  <p><span className="text-gray-500">Reason:</span> {request.rejectionReason}</p>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>


      <AnimatePresence>
        {showRejectModal && selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowRejectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Reject Extension Request</h3>

              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to reject the extension request for <span className="font-semibold">{selectedRequest.projectName}</span>?
              </p>

              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                rows={4}
                className="w-full p-3 border border-gray-200 rounded-xl mb-4"
                autoFocus
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(selectedRequest)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Confirm Rejection
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExtensionApproval;