// import { useParams } from "react-router-dom";
// // import mockProjects from "../../mock/mockProjects";
// import { useSelector, useDispatch } from "react-redux";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// // import { useDispatch, useSelector } from "react-redux";
// import { toggleSubActivity } from "./projectSlice";



// const ProjectDetails = () => {
//     const navigate = useNavigate();
//   const { id } = useParams();
//   const { user } = useSelector((state) => state.auth);
  
  

// //   const project = mockProjects.find((p) => p.id === id);
  

// //   if (!project) {
// //     return <div>Project not found</div>;
// //   }
// const dispatch = useDispatch();
// const project = useSelector(state =>
//   state.projects.projects.find(p => p.id === id)
// );

// {project.activities.map(activity => (
//   <div key={activity.id} className="bg-white p-6 rounded-xl shadow">
//     <h4 className="font-semibold">{activity.name}</h4>

//     {activity.subActivities.map(sub => (
//       <div key={sub.id} className="flex items-center gap-3 mt-2">
//         <input
//           type="checkbox"
//           checked={sub.completed}
//           onChange={() =>
//             dispatch(toggleSubActivity({
//               projectId: project.id,
//               activityId: activity.id,
//               subId: sub.id
//             }))
//           }
//         />
//         <span>{sub.name}</span>
//       </div>
//     ))}
//   </div>
// ))}
//   const remaining = 100 - project.progress;
  

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="space-y-8"
//     >
//       {/* ===== HEADER ===== */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold">{project.name}</h2>

//         {(user.role === "ADMIN" ||
//           user.role === "SUPER_ADMIN") && (
//           <button className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition">
//             Extend Deadline
//           </button>
//         )}
//       </div>

//       {/* ===== PROJECT SUMMARY CARD ===== */}
//       <div className="bg-white shadow-lg rounded-xl p-6 grid md:grid-cols-2 gap-6">
//         <div className="space-y-3">
//           <p>
//             <span className="font-semibold">Contractor:</span>{" "}
//             {project.contractor}
//           </p>

//           <p>
//             <span className="font-semibold">Start Date:</span>{" "}
//             {project.startDate}
//           </p>

//           <p>
//             <span className="font-semibold">Deadline:</span>{" "}
//             {project.deadline}
//           </p>

//           <p>
//             <span className="font-semibold">Status:</span>{" "}
//             {project.status}
//           </p>
//         </div>

//         {/* Progress Section */}
//         <div>
//           <h4 className="font-semibold mb-3">Work Progress</h4>

//           <div className="flex justify-between text-sm mb-1">
//             <span>Completed</span>
//             <span>{project.progress}%</span>
//           </div>

//           <div className="w-full bg-gray-200 rounded-full h-3">
//             <div
//               className="bg-blue-600 h-3 rounded-full transition-all duration-500"
//               style={{ width: `${project.progress}%` }}
//             />
//           </div>

//           <div className="mt-4 text-sm text-gray-600">
//             Remaining Work: {remaining}%
//           </div>
//         </div>
//       </div>
      

//       {/* ===== TIMELINE SECTION ===== */}
//       <div className="bg-white shadow-lg rounded-xl p-6">
//         <h4 className="font-semibold mb-4">Project Timeline</h4>

//         <div className="space-y-4 text-sm">
//           <div className="flex justify-between">
//             <span>Project Started</span>
//             <span>{project.startDate}</span>
//           </div>

//           <div className="flex justify-between">
//             <span>Expected Completion</span>
//             <span>{project.deadline}</span>
//           </div>

//           <div className="flex justify-between">
//             <span>Current Status</span>
//             <span>{project.status}</span>
//           </div>
//         </div>
//             <button
//                 onClick={() => navigate(`/projects/${project.id}/logs`)}
//                 className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-black transition">
//                 View Daily Logs
//             </button>
//       </div>

//       {/* ===== ACTIVITY LOGS (MOCK) ===== */}
//       <div className="bg-white shadow-lg rounded-xl p-6">
//         <h4 className="font-semibold mb-4">Recent Activity</h4>

//         <div className="space-y-3 text-sm">
//           <div className="border-l-4 border-blue-500 pl-3">
//             Site inspection completed
//           </div>

//           <div className="border-l-4 border-yellow-500 pl-3">
//             Rain delay reported
//           </div>

//           <div className="border-l-4 border-green-500 pl-3">
//             Material delivered successfully
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default ProjectDetails;
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { toggleSubActivity } from "./projectSlice";
import { Calendar, ClipboardList } from "lucide-react";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const project = useSelector((state) =>
    state.projects.projects.find((p) => p.id === id)
  );

  if (!project) {
    return <div className="p-6">Project not found</div>;
  }

  const remaining = 100 - project.progress;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">{project.name}</h2>

        <div className="flex gap-3">
          <button
            onClick={() =>
              navigate(`/projects/${project.id}/logs`)
            }
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
          >
            View Logs
          </button>

          {(user.role === "ADMIN" ||
            user.role === "SUPER_ADMIN") && (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition">
              Extend Deadline
            </button>
          )}
        </div>
      </div>

      {/* ===== SUMMARY CARD ===== */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white shadow-xl rounded-2xl p-8 grid md:grid-cols-2 gap-8"
      >
        <div className="space-y-4 text-sm">
          <p><strong>Contractor:</strong> {project.contractor}</p>
          <p><strong>Start Date:</strong> {project.startDate}</p>
          <p><strong>Deadline:</strong> {project.deadline}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                project.status === "DELAYED"
                  ? "bg-red-100 text-red-600"
                  : project.status === "COMPLETED"
                  ? "bg-green-100 text-green-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {project.status}
            </span>
          </p>
        </div>

        {/* Progress */}
        <div>
          <h4 className="font-semibold mb-3">Progress</h4>

          <div className="flex justify-between text-sm mb-1">
            <span>{project.progress}% Completed</span>
            <span>{remaining}% Remaining</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ duration: 1 }}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* ===== ACTIVITIES SECTION ===== */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">
          Activities & Sub-Activities
        </h3>

        {project.activities?.map((activity) => (
          <motion.div
            key={activity.id}
            whileHover={{ scale: 1.01 }}
            className="bg-white shadow-lg rounded-xl p-6"
          >
            <h4 className="font-semibold mb-4">
              {activity.name}
            </h4>

            {activity.subActivities.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between mb-2"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={sub.completed}
                    onChange={() =>
                      dispatch(
                        toggleSubActivity({
                          projectId: project.id,
                          activityId: activity.id,
                          subId: sub.id,
                        })
                      )
                    }
                  />
                  <span>{sub.name}</span>
                </div>

                {sub.completed && (
                  <span className="text-green-600 text-xs">
                    Completed
                  </span>
                )}
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectDetails;