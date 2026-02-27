// import { NavLink } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { closeSidebar, toggleDesktopCollapse } from "../../features/ui/uiSlice";
// import {
//   LayoutDashboard,
//   FolderKanban,
//   Users,
//   ClipboardList,
//   FileClock,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";

// const Sidebar = () => {
//   const dispatch = useDispatch();
//   const { sidebarOpen, desktopCollapsed } = useSelector(
//     (state) => state.ui
//   );

//   const menuItems = [
//     {
//     name: "Dashboard",
//     icon: LayoutDashboard,
//     path: "/dashboard",
//     roles: ["SUPER_ADMIN", "ADMIN", "USER"],
//   },
//   {
//     name: "Projects",
//     icon: FolderKanban,
//     path: "/projects",
//     roles: ["SUPER_ADMIN", "ADMIN"],
//   },
//   {
//     name: "Daily Logs",
//     icon: ClipboardList,
//     path: "/daily-logs",
//     roles: ["USER"],
//   },
//     // { name: "Projects", icon: FolderKanban, path: "/projects" },
//     { name: "Contractors", icon: Users, path: "/contractors" },
//     // { name: "Daily Logs", icon: ClipboardList, path: "/daily-logs" },
//     { name: "Extensions", icon: FileClock, path: "/extensions" },
//   ];

//   return (
//     <>
//       {/* ================= MOBILE OVERLAY ================= */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/30 z-40 md:hidden"
//           onClick={() => dispatch(closeSidebar())}
//         />
//       )}

//       {/* ================= SIDEBAR ================= */}
//       <aside
//         className={`
//           fixed top-0 left-0 h-full bg-white border-r z-50
//           transition-all duration-300
//           ${desktopCollapsed ? "w-20" : "w-64"}
//           ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
//           md:translate-x-0
//         `}
//       >
//         {/* ===== HEADER ===== */}
//         <div className="flex items-center justify-between p-5 border-b">
//           {!desktopCollapsed && (
//             <span className="text-xl font-bold text-gray-800">
//               CivilTrack
//             </span>
//           )}

//           <button
//             onClick={() => dispatch(toggleDesktopCollapse())}
//             className="hidden md:flex text-gray-600 hover:text-blue-600 transition"
//           >
//             {desktopCollapsed ? (
//               <ChevronRight size={20} />
//             ) : (
//               <ChevronLeft size={20} />
//             )}
//           </button>
//         </div>

//         {/* ===== NAVIGATION ===== */}
//        <nav className="mt-6 space-y-1 px-2">
//   {menuItems.map((item, index) => {
//     const Icon = item.icon;

//     return (
//       <NavLink key={index} to={item.path}>
//         {({ isActive }) => (
//           <div
//             onClick={() => dispatch(closeSidebar())}
//             className={`
//               relative flex items-center
//               ${desktopCollapsed ? "justify-center" : "gap-3"}
//               px-3 py-2 rounded-md cursor-pointer
//               transition-all duration-200 group
//               ${
//                 isActive
//                   ? "text-blue-600 bg-blue-50"
//                   : "text-gray-700 hover:bg-gray-100"
//               }
//             `}
//           >
//             {/* Active Left Border */}
//             {isActive && (
//               <div className="absolute left-0 top-0 h-full w-1 bg-blue-600 rounded-r-md" />
//             )}

//             {/* Icon with smooth hover */}
//             <div className="transition-transform duration-200 group-hover:scale-110">
//               <Icon size={20} />
//             </div>

//             {!desktopCollapsed && (
//               <span className="text-sm font-medium transition-colors duration-200">
//                 {item.name}
//               </span>
//             )}
//           </div>
//         )}
//       </NavLink>
//     );
//   })}
// </nav>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;


import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { closeSidebar, toggleDesktopCollapse } from "../../features/ui/uiSlice";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  ClipboardList,
  FileClock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = () => {
  const dispatch = useDispatch();

  const { sidebarOpen, desktopCollapsed } = useSelector(
    (state) => state.ui
  );

  // ✅ Get user from auth
  const { user } = useSelector((state) => state.auth);

  // ================= MENU ITEMS =================
  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      roles: ["SUPER_ADMIN", "ADMIN", "USER"],
    },
    {
      name: "Projects",
      icon: FolderKanban,
      path: "/projects",
      roles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
      name: "Daily Logs",
      icon: ClipboardList,
      path: "/daily-logs",
      roles: ["USER", "ADMIN"],
    },
    {
      name: "Contractors",
      icon: Users,
      path: "/contractors",
      roles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
      name: "Extensions",
      icon: FileClock,
      path: "/extensions",
      roles: ["SUPER_ADMIN", "ADMIN"],
    },
  ];

  // ✅ Filter based on role (safe check)
  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <>
      {/* ================= MOBILE OVERLAY ================= */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => dispatch(closeSidebar())}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r z-50
          transition-all duration-300
          ${desktopCollapsed ? "w-20" : "w-64"}
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between p-5 border-b">
          {!desktopCollapsed && (
            <span className="text-xl font-bold text-gray-800">
              CivilTrack
            </span>
          )}

          <button
            onClick={() => dispatch(toggleDesktopCollapse())}
            className="hidden md:flex text-gray-600 hover:text-blue-600 transition"
          >
            {desktopCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        {/* ===== NAVIGATION ===== */}
        <nav className="mt-6 space-y-1 px-2">
          {filteredMenu.map((item, index) => {
            const Icon = item.icon;

            return (
              <NavLink key={index} to={item.path}>
                {({ isActive }) => (
                  <div
                    onClick={() => dispatch(closeSidebar())}
                    className={`
                      relative flex items-center
                      ${desktopCollapsed ? "justify-center" : "gap-3"}
                      px-3 py-2 rounded-md cursor-pointer
                      transition-all duration-200 group
                      ${
                        isActive
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    {/* Active Left Border */}
                    {isActive && (
                      <div className="absolute left-0 top-0 h-full w-1 bg-blue-600 rounded-r-md" />
                    )}

                    {/* Icon */}
                    <div className="transition-transform duration-200 group-hover:scale-110">
                      <Icon size={20} />
                    </div>

                    {!desktopCollapsed && (
                      <span className="text-sm font-medium transition-colors duration-200">
                        {item.name}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;