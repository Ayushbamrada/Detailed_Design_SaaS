import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: [
    {
      id: "1",
      name: "100 KM Highway",
      contractor: "ABC Constructions",
      startDate: "2026-01-01",
      deadline: "2026-03-05",
      status: "ONGOING",
      progress: 45,
      code: "HWY-100",
      shortName: "H100",
      company: "CivilMantra ConsAi Ltd",
      subCompany: "Saptagon Asia Pvt Ltd",
      location: "Mumbai-Pune Highway",
      sector: "Highway",
      department: "Execution",
      totalLength: "100",
      cost: "2500",
      loaDate: "2026-01-01",
      completionDate: "2026-01-10",
      directorProposalDate: "2026-01-15",
      projectConfirmationDate: "2026-02-01",
      assignedUsers: ["1"], // User IDs who have access to this project
      extensionRequested: false,
      newRequestedDeadline: null,
      extensionReason: null,
      extensionDocuments: [],
      extensionHistory: [],
      activities: [
        {
          id: "a1",
          name: "Field Team Mobilization Advance",
          startDate: "2026-01-01",
          endDate: "2026-01-15",
          progress: 100,
          subActivities: [
            { 
              id: "s1", 
              name: "Mobilization", 
              unit: "status",
              plannedQty: 1,
              completedQty: 1,
              progress: 100,
              startDate: "2026-01-01",
              endDate: "2026-01-15",
              status: "COMPLETED"
            }
          ]
        },
        {
          id: "a2",
          name: "Field Activities",
          startDate: "2026-01-16",
          endDate: "2026-03-30",
          progress: 30,
          subActivities: [
            { 
              id: "s2", 
              name: "Topo Survey", 
              unit: "Km",
              plannedQty: 50,
              completedQty: 15,
              progress: 30,
              startDate: "2026-01-16",
              endDate: "2026-02-15",
              status: "ONGOING"
            },
            { 
              id: "s3", 
              name: "Traffic Survey and Soil Sampling", 
              unit: "Nos.",
              plannedQty: 100,
              completedQty: 45,
              progress: 45,
              startDate: "2026-01-20",
              endDate: "2026-02-28",
              status: "ONGOING"
            }
          ]
        }
      ],
      dailyLogs: []
    }
  ],
  extensionRequests: []
};

/* ================= PROGRESS CALCULATIONS ================= */

const calculateSubActivityProgress = (sub) => {
  if (sub.unit === "status") {
    const statusProgress = {
      "PENDING": 0,
      "ONGOING": 50,
      "COMPLETED": 100,
      "DELAYED": 25,
      "HOLD": 10
    };
    return statusProgress[sub.status] || 0;
  }
  
  if (!sub.plannedQty || sub.plannedQty === 0) return 0;
  const progress = (sub.completedQty / sub.plannedQty) * 100;
  return Math.min(100, Math.round(progress * 10) / 10);
};

const calculateActivityProgress = (activity) => {
  if (!activity.subActivities || activity.subActivities.length === 0) return 0;
  
  let totalProgress = 0;
  activity.subActivities.forEach((sub) => {
    totalProgress += sub.progress || 0;
  });
  
  return Math.round((totalProgress / activity.subActivities.length) * 10) / 10;
};

const calculateProjectProgress = (activities) => {
  if (!activities || activities.length === 0) return 0;
  
  let totalProgress = 0;
  activities.forEach((activity) => {
    totalProgress += activity.progress || 0;
  });
  
  return Math.round((totalProgress / activities.length) * 10) / 10;
};

/* ================= AUTO DELAY DETECTION ================= */
const checkDelayStatus = (project) => {
  const today = new Date();
  const deadline = new Date(project.completionDate);
  
  if (project.progress < 100 && today > deadline) {
    project.status = "DELAYED";
  } else if (project.progress === 100) {
    project.status = "COMPLETED";
  } else {
    project.status = "ONGOING";
  }
};

/* ================= SLICE ================= */
const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    /* -------- Add Project -------- */
    addProject: (state, action) => {
      const newProject = action.payload;
      
      const projectProgress = calculateProjectProgress(newProject.activities);
      
      const newId = (state.projects.length + 1).toString();
      
      state.projects.push({
        ...newProject,
        id: newId,
        assignedUsers: newProject.assignedUsers || [],
        status: projectProgress === 100 ? "COMPLETED" : "ONGOING",
        progress: projectProgress,
        extensionRequested: false,
        newRequestedDeadline: null,
        extensionReason: null,
        extensionDocuments: [],
        extensionHistory: [],
        dailyLogs: []
      });
    },

    /* -------- Update Sub Activity Progress -------- */
    updateSubActivityProgress: (state, action) => {
      const { projectId, activityId, subId, completedQty } = action.payload;

      const project = state.projects.find(p => p.id === projectId);
      if (!project) return;

      const activity = project.activities.find(a => a.id === activityId);
      if (!activity) return;

      const sub = activity.subActivities.find(s => s.id === subId);
      if (!sub) return;

      sub.completedQty = completedQty;
      sub.progress = calculateSubActivityProgress(sub);
      
      if (sub.progress === 100) {
        sub.status = "COMPLETED";
      } else if (sub.progress > 0) {
        sub.status = "ONGOING";
      }
      
      activity.progress = calculateActivityProgress(activity);
      project.progress = calculateProjectProgress(project.activities);

      checkDelayStatus(project);
    },

    /* -------- Update Sub Activity Status -------- */
    updateSubActivityStatus: (state, action) => {
      const { projectId, activityId, subId, status } = action.payload;

      const project = state.projects.find(p => p.id === projectId);
      if (!project) return;

      const activity = project.activities.find(a => a.id === activityId);
      if (!activity) return;

      const sub = activity.subActivities.find(s => s.id === subId);
      if (!sub) return;

      sub.status = status;
      
      if (sub.unit === "status") {
        sub.progress = calculateSubActivityProgress(sub);
        if (status === "COMPLETED") {
          sub.completedQty = sub.plannedQty;
        }
      }

      activity.progress = calculateActivityProgress(activity);
      project.progress = calculateProjectProgress(project.activities);
      
      checkDelayStatus(project);
      
      // Add to daily logs
      project.dailyLogs = project.dailyLogs || [];
      project.dailyLogs.push({
        id: `log_${Date.now()}`,
        type: "STATUS_UPDATE",
        date: new Date().toISOString().split('T')[0],
        description: `${sub.name} status updated to ${status}`,
        user: "System"
      });
    },

    /* -------- Request Extension -------- */
    requestExtension: (state, action) => {
      const { projectId, newDeadline, reason, documents, requestedBy } = action.payload;

      const project = state.projects.find(p => p.id === projectId);
      if (!project) return;

      // Create extension request
      const extensionRequest = {
        id: `ext_${Date.now()}`,
        projectId,
        projectName: project.name,
        currentDeadline: project.completionDate,
        requestedDeadline: newDeadline,
        reason,
        documents: documents || [],
        requestedBy,
        requestedByRole: requestedBy.role,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        comments: []
      };

      // Add to extension requests list
      state.extensionRequests = state.extensionRequests || [];
      state.extensionRequests.push(extensionRequest);

      // Update project
      project.extensionRequested = true;
      project.newRequestedDeadline = newDeadline;
      project.extensionReason = reason;
      project.extensionDocuments = documents || [];
      
      // Add to extension history
      project.extensionHistory = project.extensionHistory || [];
      project.extensionHistory.push({
        id: `hist_${Date.now()}`,
        type: "REQUESTED",
        oldDeadline: project.completionDate,
        newDeadline,
        reason,
        requestedBy: requestedBy.name,
        date: new Date().toISOString(),
        status: "PENDING"
      });
      
      // Add to daily logs
      project.dailyLogs = project.dailyLogs || [];
      project.dailyLogs.push({
        id: `log_${Date.now()}`,
        type: "EXTENSION_REQUESTED",
        date: new Date().toISOString().split('T')[0],
        description: `Extension requested from ${project.completionDate} to ${newDeadline}. Reason: ${reason}`,
        user: requestedBy.name
      });
    },

    /* -------- Approve Extension -------- */
    approveExtension: (state, action) => {
      const { requestId, approvedBy, comments } = action.payload;

      const requestIndex = state.extensionRequests?.findIndex(r => r.id === requestId);
      if (requestIndex === -1 || !requestIndex) return;

      const request = state.extensionRequests[requestIndex];
      const project = state.projects.find(p => p.id === request.projectId);
      if (!project) return;

      // Update request status
      state.extensionRequests[requestIndex].status = "APPROVED";
      state.extensionRequests[requestIndex].approvedBy = approvedBy;
      state.extensionRequests[requestIndex].approvedAt = new Date().toISOString();
      state.extensionRequests[requestIndex].comments = comments || [];

      // Update project
      const oldDeadline = project.completionDate;
      project.completionDate = request.requestedDeadline;
      project.extensionRequested = false;
      project.newRequestedDeadline = null;
      project.extensionReason = null;
      
      // Add to extension history
      project.extensionHistory = project.extensionHistory || [];
      project.extensionHistory.push({
        id: `hist_${Date.now()}`,
        type: "APPROVED",
        oldDeadline,
        newDeadline: request.requestedDeadline,
        approvedBy: approvedBy.name,
        date: new Date().toISOString(),
        comments
      });
      
      // Add to daily logs
      project.dailyLogs = project.dailyLogs || [];
      project.dailyLogs.push({
        id: `log_${Date.now()}`,
        type: "EXTENSION_APPROVED",
        date: new Date().toISOString().split('T')[0],
        description: `Extension approved from ${oldDeadline} to ${request.requestedDeadline}`,
        user: approvedBy.name
      });
      
      checkDelayStatus(project);
    },

    /* -------- Reject Extension -------- */
    rejectExtension: (state, action) => {
      const { requestId, rejectedBy, reason } = action.payload;

      const requestIndex = state.extensionRequests?.findIndex(r => r.id === requestId);
      if (requestIndex === -1 || !requestIndex) return;

      const request = state.extensionRequests[requestIndex];
      const project = state.projects.find(p => p.id === request.projectId);
      if (!project) return;

      // Update request status
      state.extensionRequests[requestIndex].status = "REJECTED";
      state.extensionRequests[requestIndex].rejectedBy = rejectedBy;
      state.extensionRequests[requestIndex].rejectedAt = new Date().toISOString();
      state.extensionRequests[requestIndex].rejectionReason = reason;

      // Update project
      project.extensionRequested = false;
      project.newRequestedDeadline = null;
      project.extensionReason = null;
      
      // Add to extension history
      project.extensionHistory = project.extensionHistory || [];
      project.extensionHistory.push({
        id: `hist_${Date.now()}`,
        type: "REJECTED",
        requestedDeadline: request.requestedDeadline,
        rejectedBy: rejectedBy.name,
        reason,
        date: new Date().toISOString()
      });
      
      // Add to daily logs
      project.dailyLogs = project.dailyLogs || [];
      project.dailyLogs.push({
        id: `log_${Date.now()}`,
        type: "EXTENSION_REJECTED",
        date: new Date().toISOString().split('T')[0],
        description: `Extension request rejected. Reason: ${reason}`,
        user: rejectedBy.name
      });
    },

    /* -------- Delete Extension (Admin/Super Admin only) -------- */
    deleteExtension: (state, action) => {
      const { projectId, historyId, deletedBy } = action.payload;

      const project = state.projects.find(p => p.id === projectId);
      if (!project) return;

      // Remove from extension history
      project.extensionHistory = project.extensionHistory.filter(h => h.id !== historyId);
      
      // Add to daily logs
      project.dailyLogs = project.dailyLogs || [];
      project.dailyLogs.push({
        id: `log_${Date.now()}`,
        type: "EXTENSION_DELETED",
        date: new Date().toISOString().split('T')[0],
        description: `Extension record deleted by ${deletedBy.name}`,
        user: deletedBy.name
      });
    },

    /* -------- Update Activity Dates -------- */
    updateActivityDates: (state, action) => {
      const { projectId, activityId, startDate, endDate } = action.payload;

      const project = state.projects.find(p => p.id === projectId);
      if (!project) return;

      const activity = project.activities.find(a => a.id === activityId);
      if (!activity) return;

      if (startDate !== undefined) activity.startDate = startDate;
      if (endDate !== undefined) activity.endDate = endDate;
      
      activity.subActivities.forEach(sub => {
        if (startDate !== undefined) sub.startDate = startDate;
        if (endDate !== undefined) sub.endDate = endDate;
      });
      
      project.dailyLogs = project.dailyLogs || [];
      project.dailyLogs.push({
        id: `log_${Date.now()}`,
        type: "DATE_UPDATE",
        date: new Date().toISOString().split('T')[0],
        description: `Updated dates for ${activity.name}`,
        user: "System"
      });
    },

    /* -------- Add Sub Activity -------- */
    addSubActivity: (state, action) => {
      const { projectId, activityId, subActivity } = action.payload;

      const project = state.projects.find(p => p.id === projectId);
      if (!project) return;

      const activity = project.activities.find(a => a.id === activityId);
      if (!activity) return;

      const newSubId = `s${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      
      const newSub = {
        id: newSubId,
        name: subActivity.name,
        unit: subActivity.unit,
        plannedQty: subActivity.unit !== "status" ? subActivity.plannedQty : 1,
        completedQty: 0,
        progress: 0,
        startDate: subActivity.startDate || activity.startDate,
        endDate: subActivity.endDate || activity.endDate,
        status: "PENDING"
      };

      if (!activity.subActivities) {
        activity.subActivities = [];
      }

      activity.subActivities.push(newSub);

      activity.progress = calculateActivityProgress(activity);
      project.progress = calculateProjectProgress(project.activities);
      
      checkDelayStatus(project);
      
      project.dailyLogs = project.dailyLogs || [];
      project.dailyLogs.push({
        id: `log_${Date.now()}`,
        type: "SUBACTIVITY_ADDED",
        date: new Date().toISOString().split('T')[0],
        description: `Added sub-activity: ${subActivity.name} to ${activity.name}`,
        user: "System"
      });
    },

    /* -------- Delete Activity -------- */
    deleteActivity: (state, action) => {
      const { projectId, activityId } = action.payload;

      const project = state.projects.find(p => p.id === projectId);
      if (!project) return;

      const activity = project.activities.find(a => a.id === activityId);
      if (!activity) return;

      project.activities = project.activities.filter(a => a.id !== activityId);
      project.progress = calculateProjectProgress(project.activities);
      
      checkDelayStatus(project);
      
      project.dailyLogs = project.dailyLogs || [];
      project.dailyLogs.push({
        id: `log_${Date.now()}`,
        type: "ACTIVITY_DELETED",
        date: new Date().toISOString().split('T')[0],
        description: `Deleted activity: ${activity.name}`,
        user: "System"
      });
    },

    /* -------- Delete Sub Activity -------- */
    deleteSubActivity: (state, action) => {
      const { projectId, activityId, subId } = action.payload;

      const project = state.projects.find(p => p.id === projectId);
      if (!project) return;

      const activity = project.activities.find(a => a.id === activityId);
      if (!activity) return;

      const sub = activity.subActivities.find(s => s.id === subId);
      if (!sub) return;

      activity.subActivities = activity.subActivities.filter(s => s.id !== subId);
      activity.progress = calculateActivityProgress(activity);
      project.progress = calculateProjectProgress(project.activities);
      
      checkDelayStatus(project);
      
      project.dailyLogs = project.dailyLogs || [];
      project.dailyLogs.push({
        id: `log_${Date.now()}`,
        type: "SUBACTIVITY_DELETED",
        date: new Date().toISOString().split('T')[0],
        description: `Deleted sub-activity: ${sub.name} from ${activity.name}`,
        user: "System"
      });
    },

    /* -------- Add Daily Log -------- */
    addDailyLog: (state, action) => {
      const { projectId, log } = action.payload;

      const project = state.projects.find(p => p.id === projectId);
      if (!project) return;

      if (!project.dailyLogs) {
        project.dailyLogs = [];
      }

      project.dailyLogs.push({
        ...log,
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        timestamp: new Date().toISOString()
      });

      checkDelayStatus(project);
    }
  }
});

export const {
  addProject,
  updateSubActivityProgress,
  updateSubActivityStatus,
  updateActivityDates,
  updateSubActivityDates,
  addSubActivity,
  deleteActivity,
  deleteSubActivity,
  addDailyLog,
  requestExtension,
  approveExtension,
  rejectExtension,
  deleteExtension
} = projectSlice.actions;

export default projectSlice.reducer;