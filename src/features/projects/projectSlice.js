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
      progress: 0,

      extensionRequested: false,
      newRequestedDeadline: null,

      activities: [
        {
          id: "a1",
          name: "Earthwork",
          completed: false,
          subActivities: [
            { id: "s1", name: "Excavation", completed: true },
            { id: "s2", name: "Soil Compaction", completed: false }
          ]
        }
      ],
      dailyLogs: []
    }
  ]
};

/* ================= PROGRESS CALCULATION ================= */
const calculateProgress = (activities) => {
  let totalSub = 0;
  let completedSub = 0;

  activities.forEach((activity) => {
    activity.subActivities.forEach((sub) => {
      totalSub++;
      if (sub.completed) completedSub++;
    });
  });

  return totalSub === 0
    ? 0
    : Math.round((completedSub / totalSub) * 100);
};

/* ================= AUTO DELAY DETECTION ================= */
const checkDelayStatus = (project) => {
  const today = new Date();
  const deadline = new Date(project.deadline);

  if (project.progress < 100 && today > deadline) {
    project.status = "DELAYED";
  }
};

/* ================= SLICE ================= */
const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {

    /* -------- Toggle Sub Activity -------- */
    toggleSubActivity: (state, action) => {
      const { projectId, activityId, subId } = action.payload;

      const project = state.projects.find(
        (p) => p.id === projectId
      );
      if (!project) return;

      const activity = project.activities.find(
        (a) => a.id === activityId
      );
      if (!activity) return;

      const sub = activity.subActivities.find(
        (s) => s.id === subId
      );
      if (!sub) return;

      // Toggle sub activity
      sub.completed = !sub.completed;

      // Auto mark activity completed
      activity.completed = activity.subActivities.every(
        (s) => s.completed
      );

      // Recalculate project progress
      project.progress = calculateProgress(
        project.activities
      );

      // Auto complete project
      if (project.progress === 100) {
        project.status = "COMPLETED";
      } else {
        checkDelayStatus(project);
      }
    },

    /* -------- Add Daily Log -------- */
    addDailyLog: (state, action) => {
      const { projectId, log } = action.payload;

      const project = state.projects.find(
        (p) => p.id === projectId
      );
      if (!project) return;

      project.dailyLogs.push(log);

      // Auto delay detection
      checkDelayStatus(project);
    },

    /* =======================================================
       🚀 ENTERPRISE EXTENSION WORKFLOW
    ======================================================== */

    /* -------- Request Extension -------- */
    requestExtension: (state, action) => {
      const { projectId, newDeadline } = action.payload;

      const project = state.projects.find(
        (p) => p.id === projectId
      );

      if (project) {
        project.extensionRequested = true;
        project.newRequestedDeadline = newDeadline;
      }
    },

    /* -------- Approve Extension -------- */
    approveExtension: (state, action) => {
      const project = state.projects.find(
        (p) => p.id === action.payload
      );

      if (project && project.newRequestedDeadline) {
        project.deadline = project.newRequestedDeadline;
        project.extensionRequested = false;
        project.newRequestedDeadline = null;
        project.status = "ONGOING";
      }
    }
  }
});

export const {
  toggleSubActivity,
  addDailyLog,
  requestExtension,
  approveExtension
} = projectSlice.actions;

export default projectSlice.reducer;