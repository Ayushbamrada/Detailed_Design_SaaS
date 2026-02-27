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
    COMPLETED: "bg-emerald-100 text-emerald-600",
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
  const deadlineStatus = project.deadline
    ? getDeadlineStatus(project.deadline)
    : null;

  return (
    <motion.div
      className="relative h-64 cursor-pointer perspective"
      onHoverStart={() => setFlipped(true)}
      onHoverEnd={() => setFlipped(false)}
      whileHover={{ scale: 1.02 }}
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
            <StatusBadge status={project.status || "ONGOING"} />
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
            Company: {project.company || "N/A"}
          </p>

          <p className="text-sm mt-1">
            Start: {project.loaDate || "N/A"}
          </p>

          <p className="text-sm">
            Deadline: {project.completionDate || "N/A"}
          </p>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{project.progress || 0}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${project.progress || 0}%` }}
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
              Remaining: {100 - (project.progress || 0)}%
            </p>

            <p className="text-sm">
              Status: {project.status || "ONGOING"}
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
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // ✅ GET PROJECTS FROM REDUX (IMPORTANT CHANGE)
  const projects = useSelector((state) => state.projects.projects);

  /* ================= DEADLINE SNACKBAR LOGIC ================= */
  useEffect(() => {
    projects.forEach((project) => {
      if (!project.completionDate) return;

      const status = getDeadlineStatus(project.completionDate);

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
  }, [dispatch, projects]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Projects
        </h2>

        {(user?.role === "ADMIN" ||
          user?.role === "SUPER_ADMIN") && (
          <button
            onClick={() => navigate("/projects/create")}
            className="
              relative inline-flex items-center gap-2
              bg-gradient-to-r from-blue-600 to-blue-700
              text-white px-5 py-2.5 rounded-lg
              shadow-md hover:shadow-xl
              hover:from-blue-700 hover:to-blue-800
              transform hover:-translate-y-0.5
              active:scale-95
              transition-all duration-300
              font-medium
            "
          >
            <span className="text-lg">＋</span>
            Add Project
          </button>
        )}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          No projects created yet.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
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