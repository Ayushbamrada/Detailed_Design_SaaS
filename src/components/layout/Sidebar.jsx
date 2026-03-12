
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

//   // ✅ Get user from auth
//   const { user } = useSelector((state) => state.auth);

//   // ================= MENU ITEMS =================
//   const menuItems = [
//     {
//       name: "Dashboard",
//       icon: LayoutDashboard,
//       path: "/dashboard",
//       roles: ["SUPER_ADMIN", "ADMIN", "USER"],
//     },
//     {
//       name: "Projects",
//       icon: FolderKanban,
//       path: "/projects",
//       roles: ["SUPER_ADMIN", "ADMIN"],
//     },
//     {
//       name: "Daily Logs",
//       icon: ClipboardList,
//       path: "/daily-logs",
//       roles: ["USER", "ADMIN"],
//     },
//     {
//       name: "Contractors",
//       icon: Users,
//       path: "/contractors",
//       roles: ["SUPER_ADMIN", "ADMIN"],
//     },
//     {
//       name: "Extensions",
//       icon: FileClock,
//       path: "/extensions",
//       roles: ["SUPER_ADMIN", "ADMIN"],
//     },
//   ];

//   // ✅ Filter based on role (safe check)
//   const filteredMenu = menuItems.filter((item) =>
//     item.roles.includes(user?.role)
//   );

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
//         <nav className="mt-6 space-y-1 px-2">
//           {filteredMenu.map((item, index) => {
//             const Icon = item.icon;

//             return (
//               <NavLink key={index} to={item.path}>
//                 {({ isActive }) => (
//                   <div
//                     onClick={() => dispatch(closeSidebar())}
//                     className={`
//                       relative flex items-center
//                       ${desktopCollapsed ? "justify-center" : "gap-3"}
//                       px-3 py-2 rounded-md cursor-pointer
//                       transition-all duration-200 group
//                       ${
//                         isActive
//                           ? "text-blue-600 bg-blue-50"
//                           : "text-gray-700 hover:bg-gray-100"
//                       }
//                     `}
//                   >
//                     {/* Active Left Border */}
//                     {isActive && (
//                       <div className="absolute left-0 top-0 h-full w-1 bg-blue-600 rounded-r-md" />
//                     )}

//                     {/* Icon */}
//                     <div className="transition-transform duration-200 group-hover:scale-110">
//                       <Icon size={20} />
//                     </div>

//                     {!desktopCollapsed && (
//                       <span className="text-sm font-medium transition-colors duration-200">
//                         {item.name}
//                       </span>
//                     )}
//                   </div>
//                 )}
//               </NavLink>
//             );
//           })}
//         </nav>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;

import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { closeSidebar, toggleDesktopCollapse } from "../../features/ui/uiSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  FileClock,
  ChevronLeft,
  ChevronRight,
  Settings,
  TrendingUp,
  UserCog,
  Shield,
  HardHat,
  Truck,
  Wrench,
} from "lucide-react";

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const { sidebarOpen, desktopCollapsed } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      dispatch(closeSidebar());
    }
  }, [location, dispatch, isMobile]);

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      roles: ["SUPER_ADMIN", "ADMIN", "USER"],
      badge: null,
      description: "Overview & Analytics",
    },
    {
      name: "Projects",
      icon: FolderKanban,
      path: "/projects",
      roles: ["SUPER_ADMIN", "ADMIN", "USER"],
      badge: null,
      description: "Manage all projects",
    },
    {
      name: "Daily Logs",
      icon: ClipboardList,
      path: "/daily-logs",
      roles: ["SUPER_ADMIN", "ADMIN", "USER"],
      badge: null,
      description: "Daily work updates",
    },
    {
      name: "Contractors",
      icon: HardHat,
      path: "/contractors",
      roles: ["SUPER_ADMIN", "ADMIN"],
      badge: null,
      description: "Manage contractors",
    },
    {
      name: "Extensions",
      icon: FileClock,
      path: "/extensions",
      roles: ["SUPER_ADMIN", "ADMIN"],
      badge: "pending",
      description: "Extension requests",
    },
    {
      name: "Equipment",
      icon: Wrench,
      path: "/equipment",
      roles: ["SUPER_ADMIN", "ADMIN"],
      badge: null,
      description: "Equipment management",
    },
    {
      name: "Materials",
      icon: Truck,
      path: "/materials",
      roles: ["SUPER_ADMIN", "ADMIN"],
      badge: null,
      description: "Material inventory",
    },
    {
      name: "Analytics",
      icon: TrendingUp,
      path: "/analytics",
      roles: ["SUPER_ADMIN"],
      badge: null,
      description: "Advanced analytics",
    },
    {
      name: "User Management",
      icon: UserCog,
      path: "/users",
      roles: ["SUPER_ADMIN"],
      badge: null,
      description: "Manage users & roles",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
      roles: ["SUPER_ADMIN"],
      badge: null,
      description: "System settings",
    },
  ];

  const filteredMenu = menuItems.filter((item) => item.roles.includes(user?.role));

  const mainMenu = filteredMenu.slice(0, 3);
  const managementMenu = filteredMenu.slice(3, 7);
  const adminMenu = filteredMenu.slice(7);

  const getBadgeColor = (badge) => {
    if (badge === "pending") return "bg-yellow-500";
    if (badge === "new") return "bg-green-500";
    if (badge === "alert") return "bg-red-500";
    return "bg-blue-500";
  };

  const getSidebarWidth = () => {
    if (isMobile) return 280;
    return desktopCollapsed ? 88 : 280;
  };

  return (
    <>
      {sidebarOpen && isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => dispatch(closeSidebar())}
        />
      )}

      <motion.aside
        initial={false}
        animate={{
          width: getSidebarWidth(),
          x: isMobile ? (sidebarOpen ? 0 : -280) : 0,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
        className={`
          fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 to-gray-800
          text-white shadow-2xl z-50
          ${isMobile ? "" : "md:block"}
        `}
      >
        <div className="relative h-full flex flex-col">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="relative flex items-center justify-between px-4 py-5 border-b border-gray-700/50 min-h-[76px]">
            {!desktopCollapsed || isMobile ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 min-w-0"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-lg">CT</span>
                </div>
                <div className="min-w-0">
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block leading-tight">
                    CivilTrack
                  </span>
                  <span className="block text-xs text-gray-400">Enterprise Suite</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-10 h-10 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
              >
                <span className="text-white font-bold text-lg">CT</span>
              </motion.div>
            )}

            {!isMobile && (
              // <button
              //   onClick={() => dispatch(toggleDesktopCollapse())}
              //   className="
              //     absolute top-1/2 -translate-y-1/2
              //     right-2
              //     w-8 h-8 rounded-full
              //     bg-gray-700 hover:bg-gray-600
              //     border border-gray-600
              //     flex items-center justify-center
              //     text-white shadow-lg
              //     transition-all duration-200
              //     z-30
              //   "
              // >
              <button
  onClick={() => dispatch(toggleDesktopCollapse())}
  className="
    absolute
    top-1/2
    -right-4
    -translate-y-1/2
    w-8
    h-8
    rounded-full
    bg-gray-700 hover:bg-gray-600
    border border-gray-600
    flex items-center justify-center
    text-white
    shadow-lg
    z-50
  "
>
                {desktopCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
            )}
          </div>

          {/* Navigation */}
          <div
            className="flex-1 overflow-y-auto overflow-x-visible scrollbar-none"
          >
            <nav className="p-3 space-y-6">
              {mainMenu.length > 0 && (
                <div className="space-y-1">
                  {(!desktopCollapsed || isMobile) && (
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                      Main
                    </p>
                  )}
                  {mainMenu.map((item, index) => (
                    <MenuItem
                      key={index}
                      item={item}
                      desktopCollapsed={desktopCollapsed && !isMobile}
                      hoveredItem={hoveredItem}
                      setHoveredItem={setHoveredItem}
                      getBadgeColor={getBadgeColor}
                      isMobile={isMobile}
                    />
                  ))}
                </div>
              )}

              {managementMenu.length > 0 && (
                <div className="space-y-1">
                  {(!desktopCollapsed || isMobile) && (
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                      Management
                    </p>
                  )}
                  {managementMenu.map((item, index) => (
                    <MenuItem
                      key={index}
                      item={item}
                      desktopCollapsed={desktopCollapsed && !isMobile}
                      hoveredItem={hoveredItem}
                      setHoveredItem={setHoveredItem}
                      getBadgeColor={getBadgeColor}
                      isMobile={isMobile}
                    />
                  ))}
                </div>
              )}

              {adminMenu.length > 0 && (
                <div className="space-y-1">
                  {(!desktopCollapsed || isMobile) && (
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                      Administration
                    </p>
                  )}
                  {adminMenu.map((item, index) => (
                    <MenuItem
                      key={index}
                      item={item}
                      desktopCollapsed={desktopCollapsed && !isMobile}
                      hoveredItem={hoveredItem}
                      setHoveredItem={setHoveredItem}
                      getBadgeColor={getBadgeColor}
                      isMobile={isMobile}
                    />
                  ))}
                </div>
              )}
            </nav>
          </div>

          {/* Footer user */}
          {!desktopCollapsed || isMobile ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative p-4 border-t border-gray-700/50"
            >
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Shield size={10} />
                    {user?.role || "USER"}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="relative p-4 border-t border-gray-700/50 flex justify-center"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-gray-800" />
              </div>
            </motion.div>
          )}
        </div>
      </motion.aside>
    </>
  );
};

const MenuItem = ({
  item,
  desktopCollapsed,
  hoveredItem,
  setHoveredItem,
  getBadgeColor,
  isMobile,
}) => {
  const Icon = item.icon;
  const location = useLocation();
  const [showTooltip, setShowTooltip] = useState(false);

  const isActive =
    location.pathname === item.path ||
    (item.path !== "/" && location.pathname.startsWith(item.path));

  const shouldShowText = !desktopCollapsed || isMobile;
  const shouldShowTooltip = desktopCollapsed && !isMobile && showTooltip;

  return (
    <NavLink to={item.path}>
      {({ isActive: routeActive }) => (
        <div className="relative">
          <motion.div
            onHoverStart={() => {
              setHoveredItem(item.name);
              if (desktopCollapsed && !isMobile) {
                setShowTooltip(true);
              }
            }}
            onHoverEnd={() => {
              setHoveredItem(null);
              setShowTooltip(false);
            }}
            whileHover={{ x: shouldShowText ? 5 : 0 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative flex items-center
              ${shouldShowText ? "gap-3 px-3" : "justify-center px-0"}
              py-2.5 rounded-xl cursor-pointer
              transition-all duration-200 group
              ${routeActive || isActive
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "text-gray-300 hover:text-white hover:bg-gray-700/50"
              }
            `}
          >
            {shouldShowText && (routeActive || isActive) && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
                transition={{ type: "spring", damping: 20 }}
              />
            )}

            <div className="relative">
              <Icon
                size={shouldShowText ? 20 : 22}
                className={`
                  transition-all duration-200
                  ${!shouldShowText ? "mx-auto" : ""}
                  group-hover:scale-110
                `}
              />

              {item.badge && (
                <span
                  className={`absolute -top-1 -right-1 w-2 h-2 ${getBadgeColor(
                    item.badge
                  )} rounded-full`}
                />
              )}
            </div>

            {shouldShowText && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 text-sm font-medium"
              >
                {item.name}
              </motion.span>
            )}
          </motion.div>

          <AnimatePresence>
            {shouldShowTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-[999] shadow-2xl pointer-events-none border border-gray-700"
              >
                {item.name}
                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45 border-l border-b border-gray-700" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </NavLink>
  );
};

export default Sidebar;


// import { NavLink, useLocation } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { closeSidebar, toggleDesktopCollapse } from "../../features/ui/uiSlice";
// import { motion, AnimatePresence } from "framer-motion";
// import { useState, useEffect } from "react";

// import {
//   LayoutDashboard,
//   FolderKanban,
//   ClipboardList,
//   FileClock,
//   ChevronLeft,
//   ChevronRight,
//   Settings,
//   TrendingUp,
//   UserCog,
//   Shield,
//   HardHat,
//   Truck,
//   Wrench,
// } from "lucide-react";

// const Sidebar = () => {
//   const dispatch = useDispatch();
//   const location = useLocation();

//   const { sidebarOpen, desktopCollapsed } = useSelector((state) => state.ui);
//   const { user } = useSelector((state) => state.auth);

//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     if (isMobile) dispatch(closeSidebar());
//   }, [location]);

//   const menuItems = [
//     {
//       name: "Dashboard",
//       icon: LayoutDashboard,
//       path: "/dashboard",
//       roles: ["SUPER_ADMIN", "ADMIN", "USER"],
//     },
//     {
//       name: "Projects",
//       icon: FolderKanban,
//       path: "/projects",
//       roles: ["SUPER_ADMIN", "ADMIN", "USER"],
//     },
//     {
//       name: "Daily Logs",
//       icon: ClipboardList,
//       path: "/daily-logs",
//       roles: ["SUPER_ADMIN", "ADMIN", "USER"],
//     },
//     {
//       name: "Contractors",
//       icon: HardHat,
//       path: "/contractors",
//       roles: ["SUPER_ADMIN", "ADMIN"],
//     },
//     {
//       name: "Extensions",
//       icon: FileClock,
//       path: "/extensions",
//       roles: ["SUPER_ADMIN", "ADMIN"],
//     },
//     {
//       name: "Equipment",
//       icon: Wrench,
//       path: "/equipment",
//       roles: ["SUPER_ADMIN", "ADMIN"],
//     },
//     {
//       name: "Materials",
//       icon: Truck,
//       path: "/materials",
//       roles: ["SUPER_ADMIN", "ADMIN"],
//     },
//     {
//       name: "Analytics",
//       icon: TrendingUp,
//       path: "/analytics",
//       roles: ["SUPER_ADMIN"],
//     },
//     {
//       name: "User Management",
//       icon: UserCog,
//       path: "/users",
//       roles: ["SUPER_ADMIN"],
//     },
//     {
//       name: "Settings",
//       icon: Settings,
//       path: "/settings",
//       roles: ["SUPER_ADMIN"],
//     },
//   ];

//   const filteredMenu = menuItems.filter((i) => i.roles.includes(user?.role));

//   const getWidth = () => {
//     if (isMobile) return 280;
//     return desktopCollapsed ? 88 : 280;
//   };

//   return (
//     <>
//       {/* Mobile overlay */}
//       {sidebarOpen && isMobile && (
//         <div
//           className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
//           onClick={() => dispatch(closeSidebar())}
//         />
//       )}

//       <motion.aside
//         animate={{
//           width: getWidth(),
//           x: isMobile ? (sidebarOpen ? 0 : -280) : 0,
//         }}
//         transition={{ type: "spring", damping: 18 }}
//         className="fixed top-0 left-0 h-full z-50
//         bg-gradient-to-b from-gray-900 to-gray-800
//         text-white shadow-2xl"
//       >
//         <div className="h-full flex flex-col">

//           {/* HEADER */}
//           <div className="relative flex items-center justify-center h-20 border-b border-gray-700">

//             {!desktopCollapsed || isMobile ? (
//               <div className="flex items-center gap-2">
//                 <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center font-bold">
//                   CT
//                 </div>

//                 <div>
//                   <p className="font-bold text-lg">CivilTrack</p>
//                   <p className="text-xs text-gray-400">
//                     Enterprise Suite
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center font-bold">
//                 CT
//               </div>
//             )}

//             {/* collapse button */}
//             {!isMobile && (
//               <button
//                 onClick={() => dispatch(toggleDesktopCollapse())}
//                 className="absolute -right-4 top-1/2 -translate-y-1/2
//                 w-8 h-8 rounded-full
//                 bg-gray-700 hover:bg-gray-600
//                 border border-gray-600
//                 flex items-center justify-center
//                 shadow-lg z-50"
//               >
//                 {desktopCollapsed ? (
//                   <ChevronRight size={16} />
//                 ) : (
//                   <ChevronLeft size={16} />
//                 )}
//               </button>
//             )}
//           </div>

//           {/* NAVIGATION */}
//           <nav className="flex-1 px-3 py-6 space-y-2 overflow-visible">

//             {filteredMenu.map((item) => (
//               <MenuItem
//                 key={item.name}
//                 item={item}
//                 collapsed={desktopCollapsed && !isMobile}
//               />
//             ))}

//           </nav>

//           {/* USER */}
//           <div className="border-t border-gray-700 p-4">

//             {!desktopCollapsed ? (
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center font-bold">
//                   {user?.name?.charAt(0)}
//                 </div>

//                 <div>
//                   <p className="text-sm font-semibold">{user?.name}</p>
//                   <p className="text-xs text-gray-400 flex items-center gap-1">
//                     <Shield size={12} /> {user?.role}
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex justify-center">
//                 <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center font-bold">
//                   {user?.name?.charAt(0)}
//                 </div>
//               </div>
//             )}

//           </div>
//         </div>
//       </motion.aside>
//     </>
//   );
// };

// const MenuItem = ({ item, collapsed }) => {
//   const Icon = item.icon;
//   const location = useLocation();
//   const [showTooltip, setShowTooltip] = useState(false);

//   const active =
//     location.pathname === item.path ||
//     location.pathname.startsWith(item.path);

//   return (
//     <NavLink to={item.path}>
//       <div
//         onMouseEnter={() => setShowTooltip(true)}
//         onMouseLeave={() => setShowTooltip(false)}
//         className="relative"
//       >
//         <motion.div
//           whileHover={{ scale: 1.03 }}
//           whileTap={{ scale: 0.97 }}
//           className={`flex items-center
//           ${collapsed ? "justify-center" : "gap-3"}
//           px-3 py-2.5 rounded-xl
//           cursor-pointer transition-all

//           ${
//             active
//               ? "bg-gradient-to-r from-blue-600 to-purple-600"
//               : "hover:bg-gray-700/60"
//           }`}
//         >
//           <Icon
//             size={collapsed ? 22 : 20}
//             className="transition-transform group-hover:scale-110"
//           />

//           {!collapsed && (
//             <span className="text-sm font-medium">
//               {item.name}
//             </span>
//           )}
//         </motion.div>

//         {/* Tooltip when collapsed */}
//         <AnimatePresence>
//           {collapsed && showTooltip && (
//             <motion.div
//               initial={{ opacity: 0, x: 10 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: 10 }}
//               className="fixed px-3 py-2
//               bg-gray-900 text-white text-sm
//               rounded-lg shadow-xl whitespace-nowrap
//               pointer-events-none z-[9999]"
//               style={{
//                 left: 95,
//                 top: "auto",
//               }}
//             >
//               {item.name}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </NavLink>
//   );
// };

// export default Sidebar;