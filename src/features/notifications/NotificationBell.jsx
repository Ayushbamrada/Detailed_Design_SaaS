import { Bell } from "lucide-react";
import { useSelector } from "react-redux";
import { useState } from "react";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const projects = useSelector(state => state.projects.projects);

  const delayedProjects = projects.filter(
    p => p.status === "DELAYED"
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative"
      >
        <Bell size={22} />

        {delayedProjects.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
            {delayedProjects.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-xl p-4 z-50">
          <h4 className="font-semibold mb-2">
            Notifications
          </h4>

          {delayedProjects.map((p) => (
            <div
              key={p.id}
              className="text-sm text-red-600 mb-2"
            >
              {p.name} is delayed
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;