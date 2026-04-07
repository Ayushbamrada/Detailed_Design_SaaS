import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    Calendar,
    Search,
    Filter,
    Loader2,
    RefreshCw,
    Briefcase,
    Building2,
    Users,
    TrendingUp,
    Timer,
    ChevronDown,
    ChevronUp,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye
} from 'lucide-react';
import { fetchUserSubmittedTask, calculateWorkLogStats } from './taskSlice';
import { useNavigate } from 'react-router-dom';
import LoadingModal from '../../components/modals/LoadingModal';

const SubmittedTasks = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { userWorkSummary = null,
        userSubmittedTask
        , loading = false } = useSelector((state) => state.tasks || {});
    const tasksState = useSelector((state) => state.tasks);
    console.log("tasksState:", tasksState);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterProject, setFilterProject] = useState('all');
    const [expandedProjects, setExpandedProjects] = useState({});
    const [expandedActivities, setExpandedActivities] = useState({});

    useEffect(() => {
        if (user?.id) {
            fetchWorkSummary();
        }
    }, [dispatch, user?.id]);

    const fetchWorkSummary = async () => {
        await dispatch(fetchUserSubmittedTask(user?.id));
    };

    const toggleProjectExpand = (projectId) => {
        setExpandedProjects(prev => ({
            ...prev,
            [projectId]: !prev[projectId]
        }));
    };

    const toggleActivityExpand = (activityId) => {
        setExpandedActivities(prev => ({
            ...prev,
            [activityId]: !prev[activityId]
        }));
    };

    const formatDuration = (timeString) => {
        if (!timeString || timeString === '00:00:00') return '0h';
        const parts = timeString.split(':');
        const hours = parseInt(parts[0]);
        const minutes = parseInt(parts[1]);
        if (minutes === 0) return `${hours}h`;
        return `${hours}h ${minutes}m`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const handleViewProject = (projectId, e) => {
        e.stopPropagation();
        navigate(`/my-projects/${projectId}`);
    };


    let filteredProjects = userWorkSummary?.projects || [];

    if (searchTerm) {
        filteredProjects = filteredProjects.filter(project =>
            project.project_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (filterProject !== 'all') {
        filteredProjects = filteredProjects.filter(project =>
            project.project_name === filterProject
        );
    }

    console.log(
        userSubmittedTask
        , 'userworksummary')
    const uniqueProjects = [...new Set((userWorkSummary?.projects || []).map(p => p.project_name))];


    const totalHours = userWorkSummary?.projects?.reduce((sum, project) => {
        const activityHours = project.activities?.reduce((actSum, activity) => {
            const parts = activity.total_time_spent?.split(':') || ['0', '0', '0'];
            const hours = parseInt(parts[0]);
            return actSum + hours;
        }, 0) || 0;
        return sum + activityHours;
    }, 0) || 0;


    const totalActivities = userWorkSummary?.projects?.reduce((sum, p) =>
        sum + (p.activities?.length || 0), 0) || 0;


    const totalTasks = userWorkSummary?.projects?.reduce((sum, p) =>
        sum + (p.activities?.reduce((actSum, a) =>
            actSum + (a.subactivities?.length || 0), 0) || 0), 0) || 0;

    if (loading && !userWorkSummary) {
        return <LoadingModal isVisible={true} />;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-4 py-6"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">My Submitted Task</h1>
                    <p className="text-gray-500">Track your work hours across all projects</p>
                </div>
                <button
                    onClick={fetchWorkSummary}
                    disabled={loading}
                    className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 flex items-center gap-2"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    <span className="text-sm">Refresh</span>
                </button>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Briefcase size={18} className="text-blue-600" />
                        <p className="text-sm text-gray-500">Total Projects</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{filteredProjects.length}</p>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} className="bg-green-50 rounded-xl p-4 shadow-md border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Timer size={18} className="text-green-600" />
                        <p className="text-sm text-green-600">Total Hours Worked</p>
                    </div>
                    <p className="text-2xl font-bold text-green-700">{totalHours} hrs</p>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} className="bg-purple-50 rounded-xl p-4 shadow-md border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle size={18} className="text-purple-600" />
                        <p className="text-sm text-purple-600">Activities Worked</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-700">{totalActivities}</p>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} className="bg-orange-50 rounded-xl p-4 shadow-md border border-orange-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Users size={18} className="text-orange-600" />
                        <p className="text-sm text-orange-600">Total Tasks</p>
                    </div>
                    <p className="text-2xl font-bold text-orange-700">{totalTasks}</p>
                </motion.div>
            </div>


            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by project name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={filterProject}
                            onChange={(e) => setFilterProject(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white min-w-[180px]"
                        >
                            <option value="all">All Projects</option>
                            {uniqueProjects.map(project => (
                                <option key={project} value={project}>{project}</option>
                            ))}
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>
            </div>


            {filteredProjects.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
                    <Briefcase size={64} className="mx-auto mb-4 text-gray-300" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">No Work Records Found</h2>
                    <p className="text-gray-500 mb-4">
                        {searchTerm || filterProject !== 'all'
                            ? 'No projects match your filters'
                            : "You haven't logged any work hours yet."}
                    </p>
                    <button
                        onClick={() => navigate('/all-projects')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Browse Projects
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredProjects.map((project) => {
                        const isProjectExpanded = expandedProjects[project.project_id];
                        const projectHours = project.activities?.reduce((sum, act) => {
                            const parts = act.total_time_spent?.split(':') || ['0', '0', '0'];
                            const hours = parseInt(parts[0]);
                            return sum + hours;
                        }, 0) || 0;

                        return (
                            <div key={project.project_id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">

                                <div
                                    className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200"
                                >
                                    <div className="flex items-center justify-between">
                                        <div
                                            className="flex items-center gap-3 flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                                            onClick={() => toggleProjectExpand(project.project_id)}
                                        >
                                            <Building2 size={20} className="text-blue-600" />
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{project.project_name}</h3>
                                                {/* <p className="text-xs text-gray-500">ID: {project.project_id}</p> */}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">Total Hours</p>
                                                <p className="text-sm font-semibold text-blue-600">{projectHours}h</p>
                                            </div>


                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={(e) => handleViewProject(project.project_id, e)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                                                title="View project details and work on other tasks"
                                            >
                                                <Eye size={16} />
                                                <span className="text-sm font-medium hidden sm:inline">View Project</span>
                                            </motion.button>

                                            <button
                                                onClick={() => toggleProjectExpand(project.project_id)}
                                                className="p-1 hover:bg-white/50 rounded-lg transition-colors"
                                            >
                                                {isProjectExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>


                                <AnimatePresence>
                                    {isProjectExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="divide-y divide-gray-100"
                                        >

                                            <div className="bg-blue-50 p-3 border-b border-blue-100">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <AlertCircle size={16} className="text-blue-600" />
                                                        <p className="text-sm text-blue-700">
                                                            Want to work on other tasks in this project?
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => navigate(`/my-projects/${project.project_id}`)}
                                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                                                    >
                                                        <Eye size={14} />
                                                        View Full Project
                                                    </button>
                                                </div>
                                            </div>

                                            {project.activities?.map((activity) => {
                                                const isActivityExpanded = expandedActivities[activity.activity_id];
                                                const activityHours = formatDuration(activity.total_time_spent);

                                                return (
                                                    <div key={activity.activity_id} className="bg-gray-50">

                                                        <div
                                                            className="p-3 cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-between"
                                                            onClick={() => toggleActivityExpand(activity.activity_id)}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Clock size={16} className="text-purple-500" />
                                                                <h4 className="font-medium text-gray-800">{activity.activity_name}</h4>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-xs text-gray-500">{activityHours}</span>
                                                                <button className="p-1 hover:bg-white rounded">
                                                                    {isActivityExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                                </button>
                                                            </div>
                                                        </div>


                                                        <AnimatePresence>
                                                            {isActivityExpanded && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: "auto", opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    transition={{ duration: 0.3 }}
                                                                    className="bg-white p-3 space-y-2"
                                                                >
                                                                    {activity.subactivities?.length === 0 ? (
                                                                        <p className="text-sm text-gray-500 text-center py-4">No tasks logged in this activity</p>
                                                                    ) : (
                                                                        activity.subactivities?.map((sub) => (
                                                                            <div key={sub.subactivity_id} className="border border-gray-100 rounded-lg p-3 hover:shadow-md transition-shadow">
                                                                                <div className="flex justify-between items-start">
                                                                                    <div className="flex-1">
                                                                                        <h5 className="font-medium text-gray-800">{sub.subactivity_name}</h5>
                                                                                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                                                                            <span className="flex items-center gap-1">
                                                                                                {/* <Calendar size={12} />
                                                Deadline: {formatDate(sub.deadline)} */}
                                                                                            </span>
                                                                                            {sub.completion_status && (
                                                                                                <span className={`flex items-center gap-1 ${sub.completion_status === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                                                                    <CheckCircle size={12} />
                                                                                                    {sub.completion_status}
                                                                                                </span>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="text-right">
                                                                                        <p className="text-lg font-semibold text-blue-600">{formatDuration(sub.total_time_spent)}</p>
                                                                                        <p className="text-xs text-gray-400">Total Time</p>
                                                                                    </div>
                                                                                </div>


                                                                                <div className="mt-2 pt-2 border-t border-gray-100 flex justify-end">
                                                                                    <button
                                                                                        onClick={() => navigate(`/my-projects/${project.project_id}`)}
                                                                                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                                                                    >
                                                                                        <Clock size={12} />
                                                                                        Log more time for this task
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        ))
                                                                    )}
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                );
                                            })}

                                            {(!project.activities || project.activities.length === 0) && (
                                                <div className="p-6 text-center text-gray-500">
                                                    <AlertCircle size={32} className="mx-auto mb-2 text-gray-300" />
                                                    <p className="text-sm">No activities found for this project</p>
                                                    <button
                                                        onClick={() => navigate(`/my-projects/${project.project_id}`)}
                                                        className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                    >
                                                        View Project Details
                                                    </button>
                                                </div>
                                            )}

                                            {/* Footer with Quick Action */}
                                            <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                                                <button
                                                    onClick={() => navigate(`/my-projects/${project.project_id}`)}
                                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center gap-2"
                                                >
                                                    <Eye size={14} />
                                                    View complete project details and all tasks
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            )}


            {filteredProjects.length > 0 && (
                <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-start gap-3">
                    <TrendingUp size={20} className="text-blue-600 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-blue-800 mb-1">Work Summary</h4>
                        <p className="text-sm text-blue-700">
                            You have logged <strong>{totalHours} hours</strong> across <strong>{uniqueProjects.length} projects</strong>.
                            Total of <strong>{totalTasks} tasks</strong> recorded in <strong>{totalActivities} activities</strong>.
                        </p>
                        <p className="text-xs text-blue-600 mt-2">
                            💡 Tip: Click "View Project" on any project to see all tasks and log more work hours.
                        </p>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default SubmittedTasks;