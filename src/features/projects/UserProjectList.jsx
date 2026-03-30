// src/features/projects/UserProjectList.jsx
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { 
  FolderKanban, 
  Eye, 
  Calendar, 
  Clock,
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Briefcase,
  Users
} from "lucide-react";

const UserProjectList = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { userTasks = [] } = useSelector((state) => state.tasks || {});
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Get unique projects from user's tasks
  const userProjects = useMemo(() => {
    const projectMap = new Map();
    
    userTasks.forEach(task => {
      if (!task.project_id) return;
      
      if (!projectMap.has(task.project_id)) {
        projectMap.set(task.project_id, {
          id: task.project_id,
          name: task.project_name || "Unknown Project",
          code: task.project_code || "N/A",
          tasks: [],
          progress: 0,
          completedTasks: 0,
          totalTasks: 0
        });
      }
      
      const project = projectMap.get(task.project_id);
      project.tasks.push(task);
      project.totalTasks++;
      if (task.status === 'COMPLETED') {
        project.completedTasks++;
      }
    });
    
    // Calculate progress for each project
    const projects = Array.from(projectMap.values()).map(project => ({
      ...project,
      progress: project.totalTasks > 0 
        ? Math.round((project.completedTasks / project.totalTasks) * 100)
        : 0
    }));
    
    return projects;
  }, [userTasks]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    let filtered = userProjects;
    
    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStatus !== "all") {
      filtered = filtered.filter(project => {
        if (filterStatus === "completed") return project.progress === 100;
        if (filterStatus === "in-progress") return project.progress > 0 && project.progress < 100;
        if (filterStatus === "not-started") return project.progress === 0;
        return true;
      });
    }
    
    return filtered;
  }, [userProjects, searchTerm, filterStatus]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return "bg-green-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    if (progress >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  if (userProjects.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Projects</h1>
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
          <Briefcase size={64} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Projects Yet</h2>
          <p className="text-gray-500 mb-6">
            You haven't picked any tasks from projects yet.
          </p>
          <button
            onClick={() => navigate("/all-projects")}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Browse Projects
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Projects</h1>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-sm text-blue-600 font-medium">Total Projects</p>
          <p className="text-2xl font-bold text-blue-700">{userProjects.length}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <p className="text-sm text-green-600 font-medium">Completed Projects</p>
          <p className="text-2xl font-bold text-green-700">
            {userProjects.filter(p => p.progress === 100).length}
          </p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
          <p className="text-sm text-yellow-600 font-medium">In Progress</p>
          <p className="text-2xl font-bold text-yellow-700">
            {userProjects.filter(p => p.progress > 0 && p.progress < 100).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search your projects by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white min-w-[160px]"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="not-started">Not Started</option>
            </select>
            <Filter className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={20} />
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100">
          <AlertCircle size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No projects match your search criteria.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 hover:border-blue-200 transition-all cursor-pointer"
              onClick={() => navigate(`/my-picked-projects/${project.id}`)}
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        project.progress === 100 ? "bg-green-100 text-green-600" :
                        project.progress > 0 ? "bg-blue-100 text-blue-600" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {project.progress === 100 ? "Completed" : 
                         project.progress > 0 ? "In Progress" : "Not Started"}
                      </span>
                      <span className="text-sm text-gray-400 bg-gray-50 px-2 py-1 rounded">
                        {project.code}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                      <div className="flex items-center gap-2">
                        <Briefcase size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Tasks: {project.tasks.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-500" />
                        <span className="text-sm text-gray-600">
                          Completed: {project.completedTasks}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-blue-500" />
                        <span className="text-sm font-medium text-gray-600">
                          Progress: {project.progress}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <button className="p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                    <Eye size={20} className="text-blue-600" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Overall Progress</span>
                    <span className="font-semibold text-blue-600">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
                    />
                  </div>
                </div>

                {/* Task Preview */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Your Tasks:</h4>
                  <div className="space-y-1">
                    {project.tasks.slice(0, 3).map((task, idx) => (
                      <div key={`${task.id}-${idx}`} className="flex items-center gap-2 text-sm">
                        <div className={`w-2 h-2 rounded-full ${
                          task.status === 'COMPLETED' ? 'bg-green-500' :
                          task.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-yellow-500'
                        }`} />
                        <span className="text-gray-600">{task.subactivity_name}</span>
                        <span className="text-xs text-gray-400 ml-auto">
                          {task.status === 'COMPLETED' ? '✓ Done' :
                           task.status === 'IN_PROGRESS' ? '⚡ Working' : '⏳ Pending'}
                        </span>
                      </div>
                    ))}
                    {project.tasks.length > 3 && (
                      <p className="text-xs text-gray-400">+{project.tasks.length - 3} more tasks</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default UserProjectList;