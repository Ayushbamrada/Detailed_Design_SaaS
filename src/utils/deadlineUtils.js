/**
 * Calculate days until deadline
 * @param {string} deadline - Deadline date string
 * @returns {number|null} - Number of days until deadline, null if invalid
 */
export const getDaysUntilDeadline = (deadline) => {
  if (!deadline) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);
  
  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Get deadline status based on days remaining
 * @param {string} deadline - Deadline date string
 * @returns {string} - Status: OVERDUE, TODAY, CRITICAL, WARNING, UPCOMING, SAFE
 */
export const getDeadlineStatus = (deadline) => {
  const days = getDaysUntilDeadline(deadline);
  
  if (days === null) return "UNKNOWN";
  if (days < 0) return "OVERDUE";
  if (days === 0) return "TODAY";
  if (days <= 2) return "CRITICAL";
  if (days <= 7) return "WARNING";
  if (days <= 14) return "UPCOMING";
  return "SAFE";
};

/**
 * Get color classes for deadline status
 * @param {string} status - Deadline status
 * @returns {object} - Color classes for text, bg, border
 */
export const getDeadlineColors = (status) => {
  switch(status) {
    case "OVERDUE":
      return {
        text: "text-red-600",
        bg: "bg-red-100",
        border: "border-red-200",
        gradient: "from-red-500 to-red-600",
        light: "bg-red-50"
      };
    case "TODAY":
      return {
        text: "text-orange-600",
        bg: "bg-orange-100",
        border: "border-orange-200",
        gradient: "from-orange-500 to-orange-600",
        light: "bg-orange-50"
      };
    case "CRITICAL":
      return {
        text: "text-yellow-600",
        bg: "bg-yellow-100",
        border: "border-yellow-200",
        gradient: "from-yellow-500 to-yellow-600",
        light: "bg-yellow-50"
      };
    case "WARNING":
      return {
        text: "text-blue-600",
        bg: "bg-blue-100",
        border: "border-blue-200",
        gradient: "from-blue-500 to-blue-600",
        light: "bg-blue-50"
      };
    case "UPCOMING":
      return {
        text: "text-purple-600",
        bg: "bg-purple-100",
        border: "border-purple-200",
        gradient: "from-purple-500 to-purple-600",
        light: "bg-purple-50"
      };
    default:
      return {
        text: "text-gray-600",
        bg: "bg-gray-100",
        border: "border-gray-200",
        gradient: "from-gray-500 to-gray-600",
        light: "bg-gray-50"
      };
  }
};

/**
 * Get status badge for project
 * @param {object} project - Project object
 * @returns {object} - Status badge info
 */
export const getProjectStatusInfoBackup = (project) => {
  const deadlineStatus = getDeadlineStatus(project.completionDate);
  const daysLeft = getDaysUntilDeadline(project.completionDate);
  
  // If project is already marked as COMPLETED
  if (project.status === "COMPLETED") {
    return {
      status: "COMPLETED",
      label: "Completed",
      colors: {
        text: "text-green-600",
        bg: "bg-green-100",
        gradient: "from-green-500 to-green-600"
      },
      icon: "✅"
    };
  }
  
  // If project is delayed
  if (project.status === "DELAYED" || deadlineStatus === "OVERDUE") {
    return {
      status: "DELAYED",
      label: "Delayed",
      colors: {
        text: "text-red-600",
        bg: "bg-red-100",
        gradient: "from-red-500 to-red-600"
      },
      icon: "⚠️"
    };
  }
  
  // Check deadline status
  switch(deadlineStatus) {
    case "TODAY":
      return {
        status: "DUE_TODAY",
        label: "Due Today",
        colors: {
          text: "text-orange-600",
          bg: "bg-orange-100",
          gradient: "from-orange-500 to-orange-600"
        },
        icon: "⏰"
      };
    case "CRITICAL":
      return {
        status: "CRITICAL",
        label: `${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? 's' : ''} left`,
        colors: {
          text: "text-yellow-600",
          bg: "bg-yellow-100",
          gradient: "from-yellow-500 to-yellow-600"
        },
        icon: "⚡"
      };
    case "WARNING":
      return {
        status: "WARNING",
        label: `${daysLeft} days left`,
        colors: {
          text: "text-blue-600",
          bg: "bg-blue-100",
          gradient: "from-blue-500 to-blue-600"
        },
        icon: "📅"
      };
    default:
      return {
        status: project.status || "ONGOING",
        label: project.status === "ONGOING" ? "In Progress" : project.status,
        colors: {
          text: "text-gray-600",
          bg: "bg-gray-100",
          gradient: "from-gray-500 to-gray-600"
        },
        icon: "🔄"
      };
  }
};

export const getProjectStatusInfo = (project) => {
  // Use overall_progress from API, fallback to progress
  const progress = project.overall_progress || project.progress || 0;

  // console.log('project.overall_progress-',project.overall_progress)
  // console.log('project.progress-',project.progress)
  // console.log('progress-',progress)
  // console.log('project-',project)
  const completionDate = project.completion_date || project.completionDate;
  const daysLeft = getDaysUntilDeadline(completionDate);
  const deadlineStatus = getDeadlineStatus(completionDate);
  
  // If project is completed (100% progress)
  if (progress === 100) {
    return {
      status: "COMPLETED",
      label: "Completed",
      colors: {
        text: "text-green-600",
        bg: "bg-green-100",
        gradient: "from-green-500 to-green-600"
      },
      icon: "✅"
    };
  }
  
  // If project is delayed (past deadline and not completed)
  if (deadlineStatus === "OVERDUE" && progress < 100) {
    return {
      status: "DELAYED",
      label: "Delayed",
      colors: {
        text: "text-red-600",
        bg: "bg-red-100",
        gradient: "from-red-500 to-red-600"
      },
      icon: "⚠️"
    };
  }
  
  // Check deadline status for active projects
  switch(deadlineStatus) {
    case "TODAY":
      return {
        status: "DUE_TODAY",
        label: "Due Today",
        colors: {
          text: "text-orange-600",
          bg: "bg-orange-100",
          gradient: "from-orange-500 to-orange-600"
        },
        icon: "⏰"
      };
    case "CRITICAL":
      return {
        status: "CRITICAL",
        label: `${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? 's' : ''} left`,
        colors: {
          text: "text-yellow-600",
          bg: "bg-yellow-100",
          gradient: "from-yellow-500 to-yellow-600"
        },
        icon: "⚡"
      };
    case "WARNING":
      return {
        status: "WARNING",
        label: `${daysLeft} days left`,
        colors: {
          text: "text-blue-600",
          bg: "bg-blue-100",
          gradient: "from-blue-500 to-blue-600"
        },
        icon: "📅"
      };
    default:
      // For projects with no deadline issues
      if (progress === 0) {
        return {
          status: "NOT_STARTED",
          label: "Not Started",
          colors: {
            text: "text-gray-600",
            bg: "bg-gray-100",
            gradient: "from-gray-500 to-gray-600"
          },
          icon: "🔄"
        };
      }
      return {
        status: "ONGOING",
        label: "In Progress",
        colors: {
          text: "text-blue-600",
          bg: "bg-blue-100",
          gradient: "from-blue-500 to-blue-600"
        },
        icon: "📊"
      };
  }
};