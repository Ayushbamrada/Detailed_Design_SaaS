

// // export default ProjectDetails;
// import { useParams, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { motion } from "framer-motion";
// import { toggleSubActivity } from "./projectSlice";
// import { Calendar, ClipboardList } from "lucide-react";

// const ProjectDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { user } = useSelector((state) => state.auth);

//   const project = useSelector((state) =>
//     state.projects.projects.find((p) => p.id === id)
//   );

//   if (!project) {
//     return <div className="p-6">Project not found</div>;
//   }

//   const remaining = 100 - project.progress;

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="space-y-8"
//     >
//       {/* ===== HEADER ===== */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-3xl font-bold">{project.name}</h2>

//         <div className="flex gap-3">
//           <button
//             onClick={() =>
//               navigate(`/projects/${project.id}/logs`)
//             }
//             className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
//           >
//             View Logs
//           </button>

//           {(user.role === "ADMIN" ||
//             user.role === "SUPER_ADMIN") && (
//             <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition">
//               Extend Deadline
//             </button>
//           )}
//         </div>
//       </div>

//       {/* ===== SUMMARY CARD ===== */}
//       <motion.div
//         whileHover={{ scale: 1.02 }}
//         className="bg-white shadow-xl rounded-2xl p-8 grid md:grid-cols-2 gap-8"
//       >
//         <div className="space-y-4 text-sm">
//           <p><strong>Contractor:</strong> {project.contractor}</p>
//           <p><strong>Start Date:</strong> {project.startDate}</p>
//           <p><strong>Deadline:</strong> {project.deadline}</p>
//           <p>
//             <strong>Status:</strong>{" "}
//             <span
//               className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                 project.status === "DELAYED"
//                   ? "bg-red-100 text-red-600"
//                   : project.status === "COMPLETED"
//                   ? "bg-green-100 text-green-600"
//                   : "bg-blue-100 text-blue-600"
//               }`}
//             >
//               {project.status}
//             </span>
//           </p>
//         </div>

//         {/* Progress */}
//         <div>
//           <h4 className="font-semibold mb-3">Progress</h4>

//           <div className="flex justify-between text-sm mb-1">
//             <span>{project.progress}% Completed</span>
//             <span>{remaining}% Remaining</span>
//           </div>

//           <div className="w-full bg-gray-200 rounded-full h-4">
//             <motion.div
//               initial={{ width: 0 }}
//               animate={{ width: `${project.progress}%` }}
//               transition={{ duration: 1 }}
//               className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full"
//             />
//           </div>
//         </div>
//       </motion.div>

//       {/* ===== ACTIVITIES SECTION ===== */}
//       <div className="space-y-6">
//         <h3 className="text-xl font-semibold">
//           Activities & Sub-Activities
//         </h3>

//         {project.activities?.map((activity) => (
//           <motion.div
//             key={activity.id}
//             whileHover={{ scale: 1.01 }}
//             className="bg-white shadow-lg rounded-xl p-6"
//           >
//             <h4 className="font-semibold mb-4">
//               {activity.name}
//             </h4>

//             {activity.subActivities.map((sub) => (
//               <div
//                 key={sub.id}
//                 className="flex items-center justify-between mb-2"
//               >
//                 <div className="flex items-center gap-3">
//                   <input
//                     type="checkbox"
//                     checked={sub.completed}
//                     onChange={() =>
//                       dispatch(
//                         toggleSubActivity({
//                           projectId: project.id,
//                           activityId: activity.id,
//                           subId: sub.id,
//                         })
//                       )
//                     }
//                   />
//                   <span>{sub.name}</span>
//                 </div>

//                 {sub.completed && (
//                   <span className="text-green-600 text-xs">
//                     Completed
//                   </span>
//                 )}
//               </div>
//             ))}
//           </motion.div>
//         ))}
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

  const remaining = 100 - (project.progress || 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">{project.name}</h2>
          <p className="text-sm text-gray-500">
            Code: {project.code} | Short Name: {project.shortName}
          </p>
        </div>

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
        {/* LEFT DETAILS */}
        <div className="space-y-4 text-sm">

          <p><strong>Company:</strong> {project.company}</p>
          <p><strong>Sub Company:</strong> {project.subCompany}</p>
          <p><strong>Location:</strong> {project.location}</p>
          <p><strong>Sector:</strong> {project.sector}</p>
          <p><strong>Department:</strong> {project.department}</p>

          <p>
            <strong>Total Length:</strong>{" "}
            {project.totalLength} km
          </p>

          <p>
            <strong>Workorder Cost:</strong>{" "}
            ₹ {project.cost} Lakhs
          </p>

          <p>
            <strong>LOA Date:</strong>{" "}
            {project.loaDate}
          </p>

          <p>
            <strong>Completion Date:</strong>{" "}
            {project.completionDate}
          </p>

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

        {/* RIGHT PROGRESS */}
        <div>
          <h4 className="font-semibold mb-3">Progress Overview</h4>

          <div className="flex justify-between text-sm mb-1">
            <span>{project.progress || 0}% Completed</span>
            <span>{remaining}% Remaining</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.progress || 0}%` }}
              transition={{ duration: 1 }}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full"
            />
          </div>

          <div className="mt-4 text-xs text-gray-500">
            Activities: {project.activities?.length || 0}
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
            <h4 className="font-semibold mb-4 flex justify-between">
              {activity.name}
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {activity.subActivities.length} Items
              </span>
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
                  <span>
                    {sub.name}{" "}
                    <span className="text-xs text-gray-400">
                      ({sub.unit})
                    </span>
                  </span>
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