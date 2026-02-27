export const getDeadlineStatus = (deadline) => {
  const today = new Date();
  const dueDate = new Date(deadline);

  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "OVERDUE";
  if (diffDays <= 2) return "WARNING";
  return "SAFE";
};