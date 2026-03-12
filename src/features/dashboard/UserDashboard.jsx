import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  FolderKanban,
  Eye,
  TrendingUp,
  Activity,
  ListTodo,
  ArrowUpRight
} from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const projects = useSelector((state) => state.projects.projects);
  
  // Memoize assigned projects to prevent unnecessary recalculations
  const assignedProjects = useMemo(() => 
    projects.filter(project => 
      project.assignedUsers?.includes(user?.id) || 
      project.createdBy === user?.id
    ), [projects, user?.id]
  );

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    ongoing: 0,
    delayed: 0,
    avgProgress: 0,
    deadlineNear: [],
    myTasks: 0
  });

  useEffect(() => {
    // This function will only run when assignedProjects changes
    const calculateStats = () => {
      const total = assignedProjects.length;
      const completed = assignedProjects.filter(p => p.status === "COMPLETED").length;
      const delayed = assignedProjects.filter(p => p.status === "DELAYED").length;
      const ongoing = total - completed - delayed;
      
      const avgProgress = total > 0 
        ? Math.round(assignedProjects.reduce((sum, p) => sum + (p.progress || 0), 0) / total)
        : 0;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sevenDaysFromNow = new Date(today);
      sevenDaysFromNow.setDate(today.getDate() + 7);

      const deadlineNear = assignedProjects.filter(p => {
        if (!p.completionDate || p.status === "COMPLETED") return false;
        const deadline = new Date(p.completionDate);
        deadline.setHours(0, 0, 0, 0);
        return deadline >= today && deadline <= sevenDaysFromNow;
      });

      // Calculate total pending tasks
      const myTasks = assignedProjects.reduce((acc, project) => {
        return acc + (project.activities?.reduce((actAcc, activity) => {
          return actAcc + (activity.subActivities?.filter(
            sub => sub.status !== "COMPLETED"
          ).length || 0);
        }, 0) || 0);
      }, 0);

      setStats({
        total,
        completed,
        ongoing,
        delayed,
        avgProgress,
        deadlineNear,
        myTasks
      });
    };

    calculateStats();
  }, [assignedProjects]); // Only depend on assignedProjects, not on projects directly

  const getDaysLeft = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 }
    })
  };

  if (!user) {
    return null; // or loading state
  }

  if (assignedProjects.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto space-y-8 px-4 py-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome back, {user?.name}
            </h1>
            <p className="text-gray-500 mt-2">Here's your personal dashboard</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={16} />
            <span>{new Date().toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>

        {/* Empty State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100"
        >
          <FolderKanban size={64} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Projects Assigned</h2>
          <p className="text-gray-500">You don't have any projects assigned to you yet.</p>
          <p className="text-sm text-gray-400 mt-4">Please contact your administrator for project assignments.</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto space-y-8 px-4 py-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-500 mt-2">Here's what's happening with your projects</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={16} />
          <span>{new Date().toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* My Projects */}
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm">My Projects</p>
              <p className="text-4xl font-bold mt-2">{stats.total}</p>
              <p className="text-blue-100 text-sm mt-2">
                {stats.ongoing} ongoing, {stats.completed} completed
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <FolderKanban size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-blue-100">
            <TrendingUp size={16} />
            <span>{stats.avgProgress}% avg progress</span>
          </div>
        </motion.div>

        {/* Pending Tasks */}
        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100 text-sm">Pending Tasks</p>
              <p className="text-4xl font-bold mt-2">{stats.myTasks}</p>
              <p className="text-purple-100 text-sm mt-2">
                Need your attention
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <ListTodo size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-purple-100">
            <Activity size={16} />
            <span>Across {stats.total} projects</span>
          </div>
        </motion.div>

        {/* Completed */}
        <motion.div
          custom={2}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-100 text-sm">Completed</p>
              <p className="text-4xl font-bold mt-2">{stats.completed}</p>
              <p className="text-green-100 text-sm mt-2">
                {stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0}% of your projects
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <CheckCircle2 size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-green-100">
            <ArrowUpRight size={16} />
            <span>Well done!</span>
          </div>
        </motion.div>

        {/* Delayed */}
        <motion.div
          custom={3}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-xl"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-red-100 text-sm">Delayed</p>
              <p className="text-4xl font-bold mt-2">{stats.delayed}</p>
              <p className="text-red-100 text-sm mt-2">
                Need attention
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <AlertTriangle size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-red-100">
            <Clock size={16} />
            <span>Behind schedule</span>
          </div>
        </motion.div>
      </div>

      {/* Secondary Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Average Progress */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">My Average Progress</h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.avgProgress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.avgProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-2 rounded-full bg-green-500"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">Across all your projects</p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h3 className="font-semibold text-gray-700 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/daily-logs")}
              className="p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors text-center"
            >
              <Clock size={20} className="mx-auto mb-1 text-blue-600" />
              <span className="text-xs font-medium text-blue-600">Daily Logs</span>
            </button>
            <button
              onClick={() => {
                if (assignedProjects.length > 0) {
                  navigate(`/my-projects/${assignedProjects[0].id}`);
                }
              }}
              className="p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-center"
            >
              <FolderKanban size={20} className="mx-auto mb-1 text-purple-600" />
              <span className="text-xs font-medium text-purple-600">View Projects</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Projects Nearing Deadline */}
      {stats.deadlineNear.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock size={20} className="text-yellow-500" />
            Projects Nearing Deadline (Next 7 Days)
          </h3>
          <div className="space-y-4">
            {stats.deadlineNear.map((project) => {
              const daysLeft = getDaysLeft(project.completionDate);
              
              return (
                <div key={project.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                  <div>
                    <h4 className="font-semibold text-gray-800">{project.name}</h4>
                    <p className="text-sm text-gray-600">Code: {project.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-yellow-600">
                      {daysLeft === 0 ? "Due today" : `${daysLeft} days left`}
                    </p>
                    <p className="text-xs text-gray-500">Progress: {project.progress}%</p>
                  </div>
                  <button
                    onClick={() => navigate(`/my-projects/${project.id}`)}
                    className="p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Eye size={18} className="text-gray-600" />
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* My Projects List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">My Projects</h3>
        <div className="space-y-4">
          {assignedProjects.slice(0, 5).map((project) => {
            const daysLeft = getDaysLeft(project.completionDate);
            
            return (
              <div
                key={project.id}
                onClick={() => navigate(`/my-projects/${project.id}`)}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-gray-100"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-2 h-2 rounded-full ${
                    project.status === "COMPLETED" ? "bg-green-500" :
                    project.status === "DELAYED" ? "bg-red-500" : 
                    daysLeft !== null && daysLeft <= 2 ? "bg-orange-500" : "bg-blue-500"
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-800">{project.name}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        project.status === "COMPLETED" ? "bg-green-100 text-green-600" :
                        project.status === "DELAYED" ? "bg-red-100 text-red-600" :
                        "bg-blue-100 text-blue-600"
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Code: {project.code}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">
                      {project.progress}%
                    </p>
                    {project.status !== "COMPLETED" && daysLeft !== null && (
                      <p className={`text-xs ${
                        daysLeft < 0 ? "text-red-600" :
                        daysLeft === 0 ? "text-orange-600" :
                        daysLeft <= 2 ? "text-orange-500" :
                        "text-gray-400"
                      }`}>
                        {daysLeft < 0 ? "Overdue" : 
                         daysLeft === 0 ? "Due today" :
                         `${daysLeft} days`}
                      </p>
                    )}
                  </div>
                  <Eye size={16} className="text-gray-400" />
                </div>
              </div>
            );
          })}

          {assignedProjects.length > 5 && (
            <button
              onClick={() => navigate("/my-projects")}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-700 py-2"
            >
              View all {assignedProjects.length} projects
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserDashboard;