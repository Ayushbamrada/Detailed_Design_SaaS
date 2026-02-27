// import { useSelector } from "react-redux";
// import mockProjects from "../../mock/mockProjects";
// import { motion } from "framer-motion";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getDeadlineStatus } from "../../utils/deadlineUtils";
// import { showSnackbar } from "../../features/notifications/notificationSlice";
// import { useDispatch } from "react-redux";

// /* ================= STATUS BADGE ================= */
// const StatusBadge = ({ status }) => {
//   const colors = {
//     ONGOING: "bg-blue-100 text-blue-600",
//     DELAYED: "bg-red-100 text-red-600",
//     ONTIME: "bg-green-100 text-green-600",
//   };

//   return (
//     <span
//       className={`px-3 py-1 text-xs rounded-full font-semibold ${colors[status]}`}
//     >
//       {status}
//     </span>
//   );
// };


// const dispatch = useDispatch();

// useEffect(() => {
//   mockProjects.forEach((project) => {
//     const status = getDeadlineStatus(project.deadline);

//     if (status === "WARNING") {
//       dispatch(
//         showSnackbar({
//           message: `${project.name} deadline approaching`,
//           type: "warning",
//         })
//       );
//     }

//     if (status === "OVERDUE") {
//       dispatch(
//         showSnackbar({
//           message: `${project.name} is overdue`,
//           type: "error",
//         })
//       );
//     }
//   });
// }, []);




// /* ================= PROJECT CARD ================= */
// const ProjectCard = ({ project }) => {
//   const [flipped, setFlipped] = useState(false);
//   const navigate = useNavigate(); // ✅ Added
//   const deadlineStatus = getDeadlineStatus(project.deadline);
//   {deadlineStatus === "WARNING" && (
//   <span className="text-xs text-yellow-600 font-semibold">
//     ⚠ Deadline Near
//   </span>
// )}

// {deadlineStatus === "OVERDUE" && (
//   <span className="text-xs text-red-600 font-semibold">
//     🚨 Overdue
//   </span>
// )}

//   return (
//     <motion.div
//       className="relative h-64 cursor-pointer perspective"
//       onHoverStart={() => setFlipped(true)}
//       onHoverEnd={() => setFlipped(false)}
//     >
//       <motion.div
//         animate={{ rotateY: flipped ? 180 : 0 }}
//         transition={{ duration: 0.5 }}
//         className="relative w-full h-full rounded-xl shadow-lg"
//         style={{ transformStyle: "preserve-3d" }}
//       >
//         {/* ================= FRONT SIDE ================= */}
//         <div
//           className="absolute w-full h-full bg-white rounded-xl p-5 shadow-lg"
//           style={{ backfaceVisibility: "hidden" }}
//         >
//           <div className="flex justify-between items-center">
//             <h3 className="font-semibold text-lg">
//               {project.name}
//             </h3>
//             <StatusBadge status={project.status} />
//           </div>

//           <p className="text-sm text-gray-500 mt-2">
//             Contractor: {project.contractor}
//           </p>

//           <p className="text-sm mt-1">
//             Start: {project.startDate}
//           </p>

//           <p className="text-sm">
//             Deadline: {project.deadline}
//           </p>

//           {/* Progress Bar */}
//           <div className="mt-4">
//             <div className="flex justify-between text-xs mb-1">
//               <span>Progress</span>
//               <span>{project.progress}%</span>
//             </div>

//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div
//                 className="bg-blue-600 h-2 rounded-full transition-all"
//                 style={{ width: `${project.progress}%` }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* ================= BACK SIDE ================= */}
//         <div
//           className="absolute w-full h-full bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl p-5 shadow-lg flex flex-col justify-between"
//           style={{
//             transform: "rotateY(180deg)",
//             backfaceVisibility: "hidden",
//           }}
//         >
//           <div>
//             <h3 className="text-lg font-semibold">
//               More Details
//             </h3>

//             <p className="text-sm mt-3">
//               Remaining: {100 - project.progress}%
//             </p>

//             <p className="text-sm">
//               Status: {project.status}
//             </p>
//           </div>

//           {/* ✅ Updated Button */}
//           <button
//             onClick={(e) => {
//               e.stopPropagation(); // prevents hover glitch
//               navigate(`/projects/${project.id}`);
//             }}
//             className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition"
//           >
//             View Full Details
//           </button>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// /* ================= PROJECT LIST ================= */
// const ProjectList = () => {
//   const { user } = useSelector((state) => state.auth);

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-semibold">
//           Projects
//         </h2>

//         {(user.role === "ADMIN" ||
//           user.role === "SUPER_ADMIN") && (
//           <button className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition">
//             + Add Project
//           </button>
//         )}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {mockProjects.map((project) => (
//           <ProjectCard
//             key={project.id}
//             project={project}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProjectList;



import { useSelector, useDispatch } from "react-redux";
import mockProjects from "../../mock/mockProjects";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDeadlineStatus } from "../../utils/deadlineUtils";
import { showSnackbar } from "../../features/notifications/notificationSlice";

/* ================= STATUS BADGE ================= */
const StatusBadge = ({ status }) => {
  const colors = {
    ONGOING: "bg-blue-100 text-blue-600",
    DELAYED: "bg-red-100 text-red-600",
    ONTIME: "bg-green-100 text-green-600",
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full font-semibold ${colors[status]}`}
    >
      {status}
    </span>
  );
};

/* ================= PROJECT CARD ================= */
const ProjectCard = ({ project }) => {
  const [flipped, setFlipped] = useState(false);
  const navigate = useNavigate();
  const deadlineStatus = getDeadlineStatus(project.deadline);

  return (
    <motion.div
      className="relative h-64 cursor-pointer perspective"
      onHoverStart={() => setFlipped(true)}
      onHoverEnd={() => setFlipped(false)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full h-full rounded-xl shadow-lg"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRONT SIDE */}
        <div
          className="absolute w-full h-full bg-white rounded-xl p-5 shadow-lg"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">
              {project.name}
            </h3>
            <StatusBadge status={project.status} />
          </div>

          {/* Deadline Warning */}
          {deadlineStatus === "WARNING" && (
            <p className="text-xs text-yellow-600 font-semibold mt-2">
              ⚠ Deadline Near
            </p>
          )}

          {deadlineStatus === "OVERDUE" && (
            <p className="text-xs text-red-600 font-semibold mt-2">
              🚨 Overdue
            </p>
          )}

          <p className="text-sm text-gray-500 mt-2">
            Contractor: {project.contractor}
          </p>

          <p className="text-sm mt-1">
            Start: {project.startDate}
          </p>

          <p className="text-sm">
            Deadline: {project.deadline}
          </p>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{project.progress}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* BACK SIDE */}
        <div
          className="absolute w-full h-full bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl p-5 shadow-lg flex flex-col justify-between"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          <div>
            <h3 className="text-lg font-semibold">
              More Details
            </h3>

            <p className="text-sm mt-3">
              Remaining: {100 - project.progress}%
            </p>

            <p className="text-sm">
              Status: {project.status}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/projects/${project.id}`);
            }}
            className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition"
          >
            View Full Details
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ================= PROJECT LIST ================= */
const ProjectList = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // ✅ Deadline snackbar logic INSIDE component
  useEffect(() => {
    mockProjects.forEach((project) => {
      const status = getDeadlineStatus(project.deadline);

      if (status === "WARNING") {
        dispatch(
          showSnackbar({
            message: `${project.name} deadline approaching`,
            type: "warning",
          })
        );
      }

      if (status === "OVERDUE") {
        dispatch(
          showSnackbar({
            message: `${project.name} is overdue`,
            type: "error",
          })
        );
      }
    });
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Projects
        </h2>

        {(user?.role === "ADMIN" ||
          user?.role === "SUPER_ADMIN") && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition">
            + Add Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectList;