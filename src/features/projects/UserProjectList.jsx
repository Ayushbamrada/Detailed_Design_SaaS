import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react"; // Remove useEffect, add useMemo
import { 
  FolderKanban, 
  Eye, 
  Calendar, 
  Clock,
  Search,
  Filter,
  AlertCircle
} from "lucide-react";

const UserProjectList = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const projects = useSelector((state) => state.projects.projects);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // ✅ FIX 1: Memoize assigned projects
  const assignedProjects = useMemo(() => 
    projects.filter(project => 
      project.assignedUsers?.includes(user?.id) || 
      project.createdBy === user?.id
    ), [projects, user?.id]
  );

  // ✅ FIX 2: Memoize filtered projects - NO useEffect needed!
  const filteredProjects = useMemo(() => {
    let filtered = assignedProjects;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(project => project.status === filterStatus);
    }
    
    return filtered;
  }, [assignedProjects, searchTerm, filterStatus]); // Recompute only when these change

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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

  const getProgressColor = (progress) => {
    if (progress === 100) return "bg-green-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    if (progress >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  if (assignedProjects.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Projects</h1>
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
          <FolderKanban size={64} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Projects Assigned</h2>
          <p className="text-gray-500">You don't have any projects assigned to you yet.</p>
          <p className="text-sm text-gray-400 mt-4">Please contact your administrator for project assignments.</p>
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
          <p className="text-2xl font-bold text-blue-700">{assignedProjects.length}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <p className="text-sm text-green-600 font-medium">Completed</p>
          <p className="text-2xl font-bold text-green-700">
            {assignedProjects.filter(p => p.status === "COMPLETED").length}
          </p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
          <p className="text-sm text-yellow-600 font-medium">In Progress</p>
          <p className="text-2xl font-bold text-yellow-700">
            {assignedProjects.filter(p => p.status === "ONGOING").length}
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
              <option value="ONGOING">Ongoing</option>
              <option value="DELAYED">Delayed</option>
              <option value="COMPLETED">Completed</option>
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
          {filteredProjects.map((project) => {
            const daysLeft = getDaysLeft(project.completionDate);
            
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 hover:border-blue-200 transition-all cursor-pointer"
                onClick={() => navigate(`/my-projects/${project.id}`)}
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          project.status === "COMPLETED" ? "bg-green-100 text-green-600" :
                          project.status === "DELAYED" ? "bg-red-100 text-red-600" :
                          "bg-blue-100 text-blue-600"
                        }`}>
                          {project.status}
                        </span>
                        <span className="text-sm text-gray-400 bg-gray-50 px-2 py-1 rounded">
                          {project.code}
                        </span>
                      </div>
                      
                      <p className="text-gray-500 mb-3">{project.location || "No location specified"}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Start: {formatDate(project.loaDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className={`${
                            daysLeft < 0 ? "text-red-500" :
                            daysLeft <= 2 ? "text-orange-500" :
                            "text-gray-400"
                          }`} />
                          <span className="text-sm text-gray-600">
                            {daysLeft < 0 ? "Overdue" : 
                             daysLeft === 0 ? "Due today" :
                             `${daysLeft} days left`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-600">
                            Progress: {project.progress || 0}%
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
                      <span className="font-semibold text-blue-600">{project.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress || 0}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-2 rounded-full ${getProgressColor(project.progress || 0)}`}
                      />
                    </div>
                  </div>

                  {/* Extension Requested Badge */}
                  {project.extensionRequested && (
                    <div className="mt-3 flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full w-fit">
                      <Clock size={12} />
                      Extension Requested
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default UserProjectList;