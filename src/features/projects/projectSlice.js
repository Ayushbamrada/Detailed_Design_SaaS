// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   projects: [
//     {
//       id: "1",
//       name: "100 KM Highway",
//       contractor: "ABC Constructions",
//       startDate: "2026-01-01",
//       deadline: "2026-03-05",
//       status: "ONGOING",
//       progress: 0,
//       activities: [
//         {
//           id: "a1",
//           name: "Earthwork",
//           completed: false,
//           subActivities: [
//             { id: "s1", name: "Excavation", completed: true },
//             { id: "s2", name: "Soil Compaction", completed: false }
//           ]
//         }
//       ],
//       dailyLogs: []
//     }
//   ]
// };

// const calculateProgress = (activities) => {
//   let totalSub = 0;
//   let completedSub = 0;

//   activities.forEach((activity) => {
//     activity.subActivities.forEach((sub) => {
//       totalSub++;
//       if (sub.completed) completedSub++;
//     });
//   });

//   return totalSub === 0 ? 0 : Math.round((completedSub / totalSub) * 100);
// };

// const projectSlice = createSlice({
//   name: "projects",
//   initialState,
//   reducers: {

//     toggleSubActivity: (state, action) => {
//       const { projectId, activityId, subId } = action.payload;

//       const project = state.projects.find(p => p.id === projectId);
//       if (!project) return;

//       const activity = project.activities.find(a => a.id === activityId);
//       if (!activity) return;

//       const sub = activity.subActivities.find(s => s.id === subId);
//       if (!sub) return;

//       // Toggle sub activity
//       sub.completed = !sub.completed;

//       // Auto mark activity completed if all subs completed
//       activity.completed = activity.subActivities.every(s => s.completed);

//       // Recalculate project progress
//       project.progress = calculateProgress(project.activities);

//       // Auto complete project
//       if (project.progress === 100) {
//         project.status = "COMPLETED";
//       }
//     },

//     addDailyLog: (state, action) => {
//       const { projectId, log } = action.payload;

//       const project = state.projects.find(p => p.id === projectId);
//       if (!project) return;

//       project.dailyLogs.push(log);

//       // Automatic delay detection
//       if (log.status === "NOT_WORKED") {
//         project.status = "DELAYED";
//       }
//     },

//     requestExtension: (state, action) => {
//       const { projectId, newDeadline } = action.payload;
//       const project = state.projects.find(p => p.id === projectId);
//       if (!project) return;

//       project.deadline = newDeadline;
//       project.status = "ONGOING";
//     }
//   }
// });

// export const {
//   toggleSubActivity,
//   addDailyLog,
//   requestExtension
// } = projectSlice.actions;

// export default projectSlice.reducer;

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
      completionDate: "2026-12-31",
      directorProposalDate: "2026-01-15",
      projectConfirmationDate: "2026-02-01",
      extensionRequested: false,
      newRequestedDeadline: null,
      activities: [
        {
          id: "a1_1741532400000",
          name: "Field Team Mobilization Advance",
          startDate: "2026-01-01",
          endDate: "2026-01-15",
          progress: 100,
          subActivities: [
            { 
              id: "s1_1741532400000", 
              name: "Mobilization", 
              unit: "Complete",
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
          id: "a2_1741532400000",
          name: "Field Activities",
          startDate: "2026-01-16",
          endDate: "2026-03-30",
          progress: 30,
          subActivities: [
            { 
              id: "s2_1741532400000", 
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
              id: "s3_1741532400000", 
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
  ]
};

/* ================= PROGRESS CALCULATIONS ================= */

const calculateSubActivityProgress = (sub) => {
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
      
      // Calculate initial progress
      const projectProgress = calculateProjectProgress(newProject.activities);
      
      state.projects.push({
        ...newProject,
        id: Date.now().toString(),
        status: projectProgress === 100 ? "COMPLETED" : "ONGOING",
        progress: projectProgress,
        extensionRequested: false,
        newRequestedDeadline: null,
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

      // Update completed quantity
      sub.completedQty = completedQty;
      
      // Recalculate sub-activity progress
      sub.progress = calculateSubActivityProgress(sub);
      
      // Update sub-activity status
      sub.status = sub.progress === 100 ? "COMPLETED" : "ONGOING";

      // Recalculate activity progress
      activity.progress = calculateActivityProgress(activity);

      // Recalculate project progress
      project.progress = calculateProjectProgress(project.activities);

      // Check delay status
      checkDelayStatus(project);
    },

    /* -------- Update Sub Activity Dates -------- */
    updateSubActivityDates: (state, action) => {
      const { projectId, activityId, subId, startDate, endDate } = action.payload;

      const project = state.projects.find(p => p.id === projectId);
      if (!project) return;

      const activity = project.activities.find(a => a.id === activityId);
      if (!activity) return;

      const sub = activity.subActivities.find(s => s.id === subId);
      if (!sub) return;

      if (startDate !== undefined) sub.startDate = startDate;
      if (endDate !== undefined) sub.endDate = endDate;
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
    },

    /* -------- Add Daily Log -------- */
    addDailyLog: (state, action) => {
      const { projectId, log } = action.payload;

      const project = state.projects.find(p => p.id === projectId);
      if (!project) return;

      project.dailyLogs.push({
        ...log,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0]
      });

      // Check delay status
      checkDelayStatus(project);
    },

    /* -------- Request Extension -------- */
    requestExtension: (state, action) => {
      const { projectId, newDeadline, reason } = action.payload;

      const project = state.projects.find(p => p.id === projectId);

      if (project) {
        project.extensionRequested = true;
        project.newRequestedDeadline = newDeadline;
        project.extensionReason = reason;
      }
    },

    /* -------- Approve Extension -------- */
    approveExtension: (state, action) => {
      const project = state.projects.find(p => p.id === action.payload);

      if (project && project.newRequestedDeadline) {
        project.completionDate = project.newRequestedDeadline;
        project.extensionRequested = false;
        project.newRequestedDeadline = null;
        project.extensionReason = null;
        checkDelayStatus(project);
      }
    },

    /* -------- Reject Extension -------- */
    rejectExtension: (state, action) => {
      const project = state.projects.find(p => p.id === action.payload);

      if (project) {
        project.extensionRequested = false;
        project.newRequestedDeadline = null;
        project.extensionReason = null;
      }
    }
  }
});

export const {
  addProject,
  updateSubActivityProgress,
  updateSubActivityDates,
  updateActivityDates,
  addDailyLog,
  requestExtension,
  approveExtension,
  rejectExtension
} = projectSlice.actions;

export default projectSlice.reducer;