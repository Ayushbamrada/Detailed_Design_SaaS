import { useState, useMemo, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    BarChart3,
    TrendingUp,
    CheckCircle,
    XCircle,
    AlertCircle,
    Calendar,
    Search,
    Filter,
    Download,
    User,
    Briefcase,
    Activity,
    CalendarDays,
    FileText,
    Users,
    Timer,
    Award,
    Target,
    Eye,
    ChevronRight,
    Clock,
    Building2,
    ArrowUpDown,
    List,
    Plus,
    Minus,
    ExternalLink,
    MapPin,
    Layers
} from 'lucide-react';
import { fetchAllEmployeesReport } from '../tasks/taskSlice';

const TeamLeaderReport = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedProject, setSelectedProject] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [expandedEmployee, setExpandedEmployee] = useState(null);

    // Get data from Redux store
    const { allEmployeesReport, loading } = useSelector((state) => state.tasks || {});
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user?.emp_code) {
            fetchReportData();
        }
    }, [dispatch, user?.emp_code]);

    const fetchReportData = async () => {
        await dispatch(fetchAllEmployeesReport(user?.emp_code));
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

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Approved': 'bg-green-100 text-green-800',
            'Submitted': 'bg-blue-100 text-blue-800',
            'Inprogress': 'bg-yellow-100 text-yellow-800',
            'Rejected': 'bg-red-100 text-red-800',
            'Pending': 'bg-orange-100 text-orange-800'
        };
        const color = statusConfig[status] || statusConfig['Pending'];
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
                {status}
            </span>
        );
    };

    const getProgressColor = (progress) => {
        if (progress >= 75) return 'bg-green-500';
        if (progress >= 50) return 'bg-blue-500';
        if (progress >= 25) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    // Transform API data to employee-centric structure with multiple projects
    const transformedData = useMemo(() => {
        if (!allEmployeesReport?.projects || allEmployeesReport.projects.length === 0) {
            return { employees: [], totalHours: 0, totalProjects: 0, projectsInfo: [] };
        }

        const projects = allEmployeesReport.projects;
        const employeesMap = new Map();

        // Process each project
        projects.forEach(project => {
            // Calculate project progress
            let totalProjectTasks = 0;
            let completedProjectTasks = 0;

            project.users?.forEach(user => {
                user.activities?.forEach(activity => {
                    activity.subactivities?.forEach(sub => {
                        totalProjectTasks++;
                        if (sub.status === 'Approved' || sub.status === 'Submitted') {
                            completedProjectTasks++;
                        }
                    });
                });
            });

            const projectProgress = totalProjectTasks > 0 ? (completedProjectTasks / totalProjectTasks * 100).toFixed(1) : 0;

            const projectInfo = {
                project_id: project.project_id,
                project_name: project.project_name,
                total_users: project.users?.length || 0,
                total_hours: project.users?.reduce((sum, user) => {
                    const hours = parseInt(user.total_time_spent?.split(':')[0] || 0);
                    return sum + hours;
                }, 0),
                progress: projectProgress,
                total_tasks: totalProjectTasks,
                completed_tasks: completedProjectTasks
            };

            // Process each user in the project
            project.users?.forEach(user => {
                if (!employeesMap.has(user.emp_code)) {
                    employeesMap.set(user.emp_code, {
                        emp_code: user.emp_code,
                        name: user.name,
                        total_hours: 0,
                        total_tasks: 0,
                        approved_tasks: 0,
                        submitted_tasks: 0,
                        inprogress_tasks: 0,
                        rejected_tasks: 0,
                        projects: []
                    });
                }

                const employee = employeesMap.get(user.emp_code);
                let userTotalTasks = 0;
                let userApprovedTasks = 0;
                let userSubmittedTasks = 0;
                let userInprogressTasks = 0;
                let userRejectedTasks = 0;
                let userTotalHours = 0;

                const userProject = {
                    project_id: project.project_id,
                    project_name: project.project_name,
                    total_time_spent: user.total_time_spent,
                    activities: user.activities?.map(activity => ({
                        activity_id: activity.activity_id,
                        activity_name: activity.activity_name,
                        total_time_spent: activity.total_time_spent,
                        subactivities: activity.subactivities?.map(sub => {
                            userTotalTasks++;
                            if (sub.status === 'Approved') userApprovedTasks++;
                            if (sub.status === 'Submitted') userSubmittedTasks++;
                            if (sub.status === 'Inprogress') userInprogressTasks++;
                            if (sub.status === 'Rejected') userRejectedTasks++;

                            const hours = parseInt(sub.total_time_spent?.split(':')[0] || 0);
                            userTotalHours += hours;

                            return {
                                subactivity_id: sub.subactivity_id,
                                subactivity_name: sub.subactivity_name,
                                status: sub.status,
                                total_time_spent: sub.total_time_spent,
                                date_wise: sub.date_wise || []
                            };
                        })
                    }))
                };

                employee.projects.push(userProject);
                employee.total_hours += userTotalHours;
                employee.total_tasks += userTotalTasks;
                employee.approved_tasks += userApprovedTasks;
                employee.submitted_tasks += userSubmittedTasks;
                employee.inprogress_tasks += userInprogressTasks;
                employee.rejected_tasks += userRejectedTasks;
            });
        });

        // Convert map to array and calculate completion rates
        const employees = Array.from(employeesMap.values()).map(emp => ({
            ...emp,
            completion_rate: emp.total_tasks > 0
                ? ((emp.approved_tasks + emp.submitted_tasks) / emp.total_tasks * 100).toFixed(1)
                : 0
        }));

        const totalHours = employees.reduce((sum, emp) => sum + emp.total_hours, 0);
        const projectsInfo = projects.map(project => ({
            project_id: project.project_id,
            project_name: project.project_name,
            total_users: project.users?.length || 0,
            total_hours: project.users?.reduce((sum, user) => {
                const hours = parseInt(user.total_time_spent?.split(':')[0] || 0);
                return sum + hours;
            }, 0)
        }));

        return {
            employees,
            totalHours,
            totalProjects: projects.length,
            projectsInfo
        };
    }, [allEmployeesReport]);

    // Calculate overall statistics
    const overallStats = useMemo(() => {
        if (!transformedData.employees.length) return null;

        const employees = transformedData.employees;
        const totalEmployees = employees.length;
        const totalProjects = transformedData.totalProjects;
        const totalHours = transformedData.totalHours;

        let totalTasks = 0;
        let approvedTasks = 0;
        let submittedTasks = 0;
        let inprogressTasks = 0;
        let rejectedTasks = 0;

        employees.forEach(emp => {
            totalTasks += emp.total_tasks || 0;
            approvedTasks += emp.approved_tasks || 0;
            submittedTasks += emp.submitted_tasks || 0;
            inprogressTasks += emp.inprogress_tasks || 0;
            rejectedTasks += emp.rejected_tasks || 0;
        });

        return {
            totalEmployees,
            totalProjects,
            totalHours,
            totalTasks,
            approvedTasks,
            submittedTasks,
            inprogressTasks,
            rejectedTasks,
            completionRate: totalTasks > 0 ? ((approvedTasks + submittedTasks) / totalTasks * 100).toFixed(1) : 0
        };
    }, [transformedData]);

    // Filter and sort employees
    const filteredEmployees = useMemo(() => {
        if (!transformedData.employees.length) return [];

        let filtered = [...transformedData.employees];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(emp =>
                emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.emp_code?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by selected employee
        if (selectedEmployee) {
            filtered = filtered.filter(emp => emp.emp_code === selectedEmployee);
        }

        // Filter by project
        if (selectedProject !== 'all') {
            filtered = filtered.map(emp => ({
                ...emp,
                projects: emp.projects.filter(project => project.project_id === selectedProject)
            })).filter(emp => emp.projects.length > 0);
        }

        // Filter by status (filter subactivities)
        if (selectedStatus !== 'all') {
            filtered = filtered.map(emp => ({
                ...emp,
                projects: emp.projects.map(project => ({
                    ...project,
                    activities: project.activities.map(activity => ({
                        ...activity,
                        subactivities: activity.subactivities.filter(sub => sub.status === selectedStatus)
                    })).filter(activity => activity.subactivities.length > 0)
                })).filter(project => project.activities.length > 0)
            })).filter(emp => emp.projects.length > 0);
        }

        // Filter by date range
        if (dateRange.start || dateRange.end) {
            filtered = filtered.map(emp => ({
                ...emp,
                projects: emp.projects.map(project => ({
                    ...project,
                    activities: project.activities.map(activity => ({
                        ...activity,
                        subactivities: activity.subactivities.map(sub => ({
                            ...sub,
                            date_wise: sub.date_wise?.filter(dateLog => {
                                let valid = true;
                                if (dateRange.start && dateLog.date < dateRange.start) valid = false;
                                if (dateRange.end && dateLog.date > dateRange.end) valid = false;
                                return valid;
                            })
                        })).filter(sub => sub.date_wise?.length > 0)
                    })).filter(activity => activity.subactivities.length > 0)
                })).filter(project => project.activities.length > 0)
            })).filter(emp => emp.projects.length > 0);
        }

        // Sort
        filtered.sort((a, b) => {
            let aVal, bVal;
            switch (sortField) {
                case 'name':
                    aVal = a.name || '';
                    bVal = b.name || '';
                    break;
                case 'emp_code':
                    aVal = a.emp_code || '';
                    bVal = b.emp_code || '';
                    break;
                case 'total_hours':
                    aVal = a.total_hours || 0;
                    bVal = b.total_hours || 0;
                    break;
                case 'completion_rate':
                    aVal = parseFloat(a.completion_rate) || 0;
                    bVal = parseFloat(b.completion_rate) || 0;
                    break;
                default:
                    aVal = a[sortField] || '';
                    bVal = b[sortField] || '';
            }

            if (sortDirection === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        return filtered;
    }, [transformedData, searchTerm, selectedEmployee, selectedProject, selectedStatus, dateRange, sortField, sortDirection]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleViewProject = (projectId) => {
        // navigate(`/projects/${projectId}`);
    };

    const exportToCSV = () => {
        if (!transformedData.employees.length) return;

        const headers = ['Employee Name', 'Emp Code', 'Total Tasks', 'Approved', 'Submitted', 'In Progress', 'Rejected', 'Total Hours', 'Completion Rate'];
        const rows = [];

        transformedData.employees.forEach(emp => {
            rows.push([
                emp.name,
                emp.emp_code,
                emp.total_tasks || 0,
                emp.approved_tasks || 0,
                emp.submitted_tasks || 0,
                emp.inprogress_tasks || 0,
                emp.rejected_tasks || 0,
                emp.total_hours || 0,
                `${emp.completion_rate || 0}%`
            ]);
        });

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `team_report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return <ArrowUpDown size={14} className="text-gray-400" />;
        return sortDirection === 'asc' ?
            <ChevronRight size={14} className="rotate-90" /> :
            <ChevronRight size={14} className="-rotate-90" />;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading team report...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-4 py-6"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">Team Leader Report</h1>
                        <p className="text-blue-100">View and manage your team's performance</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={fetchReportData}
                            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                        >
                            <TrendingUp size={18} />
                            <span>Refresh</span>
                        </button>
                        <button
                            onClick={exportToCSV}
                            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                        >
                            <Download size={18} />
                            <span>Export</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Projects Overview Cards */}
            {/* {transformedData.projectsInfo && transformedData.projectsInfo.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {transformedData.projectsInfo.map((project, index) => (
                        <motion.div
                            key={project.project_id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-md border border-gray-100 p-4 hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => handleViewProject(project.project_id)}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Building2 size={18} className="text-blue-600" />
                                        <h3 className="font-semibold text-gray-800 text-sm">Project {index + 1}</h3>
                                    </div>
                                    <p className="text-xs text-gray-600 line-clamp-2">
                                        {project.project_name.length > 80 ? project.project_name.substring(0, 80) + '...' : project.project_name}
                                    </p>
                                </div>
                                <ExternalLink size={16} className="text-gray-400 flex-shrink-0" />
                            </div>
                            <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-500">Team Size</p>
                                    <p className="text-sm font-medium text-gray-700">
                                        <Users size={12} className="inline mr-1" />
                                        {project.total_users}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Total Hours</p>
                                    <p className="text-sm font-medium text-blue-600">
                                        <Timer size={12} className="inline mr-1" />
                                        {project.total_hours} hrs
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )} */}

            {/* Statistics Cards */}
            {overallStats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Users size={18} className="text-blue-600" />
                            <p className="text-sm text-gray-500">Team Members</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{overallStats.totalEmployees}</p>
                        <p className="text-xs text-gray-400 mt-1">Active employees</p>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Briefcase size={18} className="text-purple-600" />
                            <p className="text-sm text-gray-500">Total Projects</p>
                        </div>
                        <p className="text-2xl font-bold text-purple-700">{overallStats.totalProjects}</p>
                        <p className="text-xs text-gray-400 mt-1">Active projects</p>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Timer size={18} className="text-green-600" />
                            <p className="text-sm text-gray-500">Total Hours</p>
                        </div>
                        <p className="text-2xl font-bold text-green-700">{overallStats.totalHours} hrs</p>
                        <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(100, (overallStats.totalHours / 500) * 100)}%` }} />
                        </div>
                    </motion.div>

                    {/* <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Target size={18} className="text-orange-600" />
                            <p className="text-sm text-gray-500">Completion Rate</p>
                        </div>
                        <p className="text-2xl font-bold text-orange-700">{overallStats.completionRate}%</p>
                        <p className="text-xs text-gray-400 mt-1">
                            {overallStats.approvedTasks + overallStats.submittedTasks} / {overallStats.totalTasks} tasks
                        </p>
                    </motion.div> */}
                </div>
            )}

            {/* Status Summary */}
            {overallStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-100">
                        <div className="flex items-center justify-between">
                            <Activity size={20} className="text-yellow-600" />
                            <span className="text-lg font-bold text-yellow-700">{overallStats.inprogressTasks}</span>
                        </div>
                        <p className="text-xs text-yellow-600 mt-1">In Progress</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                        <div className="flex items-center justify-between">
                            <FileText size={20} className="text-green-600" />
                            <span className="text-lg font-bold text-green-700">{overallStats.submittedTasks}</span>
                        </div>
                        <p className="text-xs text-green-600 mt-1">Submitted Tasks</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                        <div className="flex items-center justify-between">
                            <CheckCircle size={20} className="text-blue-600" />
                            <span className="text-lg font-bold text-blue-700">{overallStats.approvedTasks}</span>
                        </div>
                        <p className="text-xs text-blue-600 mt-1">Approved Tasks</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                        <div className="flex items-center justify-between">
                            <XCircle size={20} className="text-red-600" />
                            <span className="text-lg font-bold text-red-700">{overallStats.rejectedTasks}</span>
                        </div>
                        <p className="text-xs text-red-600 mt-1">Rejected Tasks</p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or emp code..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={selectedEmployee || 'all'}
                            onChange={(e) => setSelectedEmployee(e.target.value === 'all' ? null : e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white w-full"
                        >
                            <option value="all">All Employees</option>
                            {transformedData.employees?.map(emp => (
                                <option key={emp.emp_code} value={emp.emp_code}>
                                    {emp.name} ({emp.emp_code})
                                </option>
                            ))}
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>

                    <div className="relative">
                        <select
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white w-full"
                        >
                            <option value="all">All Projects</option>
                            {transformedData.projectsInfo?.map(project => (
                                <option key={project.project_id} value={project.project_id}>
                                    {project.project_name.length > 40 ? project.project_name.substring(0, 40) + '...' : project.project_name}
                                </option>
                            ))}
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>

                    <div className="relative">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white w-full"
                        >
                            <option value="all">All Status</option>
                            <option value="Approved">Approved</option>
                            <option value="Submitted">Submitted</option>
                            <option value="Inprogress">In Progress</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>

                    {/* <div className="flex gap-2">
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Start date"
                        />
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="End date"
                        />
                    </div> */}
                </div>
            </div>

            {/* Results Count */}
            <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                    Showing {filteredEmployees.length} of {transformedData.employees?.length || 0} employees
                </p>
                {(searchTerm || selectedEmployee || selectedProject !== 'all' || selectedStatus !== 'all' || dateRange.start || dateRange.end) && (
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedEmployee(null);
                            setSelectedProject('all');
                            setSelectedStatus('all');
                            setDateRange({ start: '', end: '' });
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700"
                    >
                        Clear all filters
                    </button>
                )}
            </div>

            {/* Table View */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>
                                    <div className="flex items-center gap-2">
                                        Employee <SortIcon field="name" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('emp_code')}>
                                    <div className="flex items-center gap-2">
                                        Emp Code <SortIcon field="emp_code" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('total_hours')}>
                                    <div className="flex items-center gap-2">
                                        Hours <SortIcon field="total_hours" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('completion_rate')}>
                                    <div className="flex items-center gap-2">
                                        Performance <SortIcon field="completion_rate" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredEmployees.map((employee) => {
                                const isExpanded = expandedEmployee === employee.emp_code;

                                return (
                                    <Fragment key={employee.emp_code}>
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <User size={16} className="text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{employee.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{employee.emp_code}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                                                        <Activity size={12} />
                                                        {employee.inprogress_tasks || 0}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                                        <FileText size={12} />
                                                        {employee.submitted_tasks || 0}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                                        <CheckCircle size={12} />
                                                        {employee.approved_tasks || 0}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                                                        <XCircle size={12} />
                                                        {employee.rejected_tasks || 0}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-blue-600">{employee.total_hours || 0} hrs</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 max-w-[100px]">
                                                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full ${getProgressColor(employee.completion_rate)} rounded-full`}
                                                                style={{ width: `${employee.completion_rate}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-600">{employee.completion_rate}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => setExpandedEmployee(isExpanded ? null : employee.emp_code)}
                                                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                                >
                                                    <Eye size={16} />
                                                    <span className="text-sm">{isExpanded ? 'Hide' : 'View'} Details</span>
                                                </button>
                                            </td>
                                        </tr>

                                        {/* Expanded Row - Shows activities and subactivities by project */}
                                        {isExpanded && (
                                            <tr className="bg-gray-50">
                                                <td colSpan="6" className="px-6 py-4">
                                                    <div className="space-y-6">
                                                        <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                                                            <Layers size={16} />
                                                            Task Details for {employee.name}
                                                        </h4>
                                                        {employee.projects?.map((project) => (
                                                            <div key={project.project_id} className="space-y-3">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <h5 className="font-semibold text-gray-700 flex items-center gap-2">
                                                                        <Briefcase size={14} />
                                                                        {project.project_name.length > 100 ? project.project_name.substring(0, 100) + '...' : project.project_name}
                                                                    </h5>
                                                                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                                        Total: {formatDuration(project.total_time_spent)}
                                                                    </span>
                                                                </div>
                                                                {project.activities?.map((activity) => (
                                                                    <div key={activity.activity_id} className="bg-white rounded-lg p-4 border border-gray-200 ml-4">
                                                                        <div className="flex justify-between items-center mb-3">
                                                                            <h6 className="font-medium text-gray-700">{activity.activity_name}</h6>
                                                                            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                                                                                {formatDuration(activity.total_time_spent)}
                                                                            </span>
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            {activity.subactivities?.map((sub) => (
                                                                                <div key={sub.subactivity_id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                                                                                    <div className="flex-1">
                                                                                        <div className="flex items-center gap-2 mb-2">
                                                                                            <span className="text-sm font-medium text-gray-700">{sub.subactivity_name}</span>
                                                                                            {getStatusBadge(sub.status)}
                                                                                        </div>
                                                                                        {sub.date_wise && sub.date_wise.length > 0 && (
                                                                                            <div className="mt-2 space-y-1">
                                                                                                {sub.date_wise.map((date, idx) => (
                                                                                                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-500">
                                                                                                        <Calendar size={12} />
                                                                                                        <span>{formatDate(date.date)}:</span>
                                                                                                        <span className="font-medium text-gray-600">{formatDuration(date.time_spent)}</span>
                                                                                                    </div>
                                                                                                ))}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="text-right">
                                                                                        <span className="text-sm font-semibold text-blue-600">
                                                                                            {formatDuration(sub.total_time_spent)}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* No Results */}
            {filteredEmployees.length === 0 && (
                <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
                    <Users size={64} className="mx-auto mb-4 text-gray-300" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">No Employees Found</h2>
                    <p className="text-gray-500">No employees match your filter criteria.</p>
                </div>
            )}
        </motion.div>
    );
};

export default TeamLeaderReport;