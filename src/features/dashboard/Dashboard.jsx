// import { motion } from "framer-motion";
// import { FolderKanban, Clock, AlertTriangle } from "lucide-react";

// const StatCard = ({ title, value, icon: Icon, color }) => {
//   return (
//     <motion.div
//       whileHover={{ y: -5 }}
//       className="bg-white shadow-card rounded-xl2 p-5 flex items-center justify-between"
//     >
//       <div>
//         <p className="text-gray-500 text-sm">{title}</p>
//         <h2 className="text-2xl font-bold mt-1">{value}</h2>
//       </div>
//       <div className={`p-3 rounded-lg ${color}`}>
//         <Icon size={20} className="text-white" />
//       </div>
//     </motion.div>
//   );
// };

// const Dashboard = () => {
//   return (
//     <div className="space-y-6">
//       <h2 className="text-xl font-semibold">Overview</h2>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <StatCard
//           title="Total Projects"
//           value="12"
//           icon={FolderKanban}
//           color="bg-primary"
//         />
//         <StatCard
//           title="Ongoing Deadlines"
//           value="4"
//           icon={Clock}
//           color="bg-warning"
//         />
//         <StatCard
//           title="Delayed Projects"
//           value="2"
//           icon={AlertTriangle}
//           color="bg-danger"
//         />
//       </div>

//       {/* Placeholder Chart Section */}
//       <div className="bg-white shadow-card rounded-xl2 p-6">
//         <h3 className="text-lg font-semibold mb-4">
//           Project Status Overview
//         </h3>
//         <div className="h-64 flex items-center justify-center text-gray-400">
//           Chart Coming Soon...
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import AnalyticsChart from "./AnalyticsChart";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const projects = useSelector((state) => state.projects.projects);

  const total = projects.length;
  const completed = projects.filter(p => p.status === "COMPLETED").length;
  const delayed = projects.filter(p => p.status === "DELAYED").length;
  const ongoing = total - completed - delayed;

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold">
        Welcome {user.role}
      </h2>

      {/* Animated Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        {[ 
          { title: "Total", value: total },
          { title: "Completed", value: completed },
          { title: "Ongoing", value: ongoing },
          { title: "Delayed", value: delayed }
        ].map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-xl rounded-2xl p-6 text-center"
          >
            <h4 className="text-sm text-gray-500">
              {card.title}
            </h4>
            <p className="text-2xl font-bold">
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <AnalyticsChart />
    </div>
  );
};

export default Dashboard;