// import { Outlet } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { toggleSidebar } from "../../features/ui/uiSlice";
// import { Menu } from "lucide-react";
// import Sidebar from "./Sidebar";

// const Layout = () => {
//   const dispatch = useDispatch();

//   return (
//     <div className="flex min-h-screen bg-light">
//       <Sidebar />

//       <div className="flex-1 flex flex-col">
//         {/* Topbar */}
//         <header className="flex items-center justify-between bg-white shadow px-6 py-4">
//           <button
//             onClick={() => dispatch(toggleSidebar())}
//             className="md:hidden"
//           >
//             <Menu size={22} />
//           </button>

//           <h1 className="text-lg font-semibold">
//             Civil Infrastructure Dashboard
//           </h1>
//         </header>

//         {/* Page Content */}
//         <main className="flex-1 p-6 space-y-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;

// import { Outlet } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { toggleSidebar } from "../../features/ui/uiSlice";
// import { Menu } from "lucide-react";
// import Sidebar from "./Sidebar";
// import { useState, useRef, useEffect } from "react";
// import { LogOut, User } from "lucide-react";
// import { logout } from "../../features/auth/authSlice";

// const Layout = () => {
//   const dispatch = useDispatch();

//   // ✅ Get collapse state
//   const { desktopCollapsed } = useSelector((state) => state.ui);

//   return (
//     <div className="flex min-h-screen bg-light">
//       <Sidebar />

//       {/* ✅ Content Wrapper */}
//       <div
//         className={`flex-1 flex flex-col transition-all duration-300
//        ${desktopCollapsed ? "ml-0 md:ml-20" : "ml-0 md:ml-64"}`}
//       >
//         {/* ================= TOPBAR ================= */}
//        <header className="flex items-center justify-between bg-white shadow px-6 py-4 relative">
//   <button
//     onClick={() => dispatch(toggleSidebar())}
//     className="md:hidden"
//   >
//     <Menu size={22} />
//   </button>

//   <h1 className="text-lg font-semibold">
//     Civil Infrastructure Dashboard
//   </h1>

//   <UserDropdown />
// </header>

//         {/* ================= PAGE CONTENT ================= */}
//         <main className="flex-1 p-6 space-y-6 transition-all duration-300">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };


// const UserDropdown = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef();

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <div
//         onClick={() => setOpen(!open)}
//         className="flex items-center gap-2 cursor-pointer"
//       >
//         <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
//           {user?.name?.charAt(0)}
//         </div>
//       </div>

//       {open && (
//         <div className="absolute right-0 mt-3 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
//           <div className="px-4 py-2 text-sm text-gray-600 border-b">
//             {user?.name}
//           </div>

//           <button
//             onClick={() => dispatch(logout())}
//             className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100"
//           >
//             <LogOut size={16} />
//             Logout
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Layout;
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../features/ui/uiSlice";
import {
  Menu,
  Bell,
  LogOut,
  User,
  Settings,
  Moon,
  Sun,
  Shield,
  UserCog
} from "lucide-react";
import Sidebar from "./Sidebar";
import { useState, useRef, useEffect } from "react";
import { logout } from "../../features/auth/authSlice";
import { motion, AnimatePresence } from "framer-motion";

const Layout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const { desktopCollapsed } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/projects")) return "Project Management";
    if (path.includes("/my-projects")) return "My Projects";
    if (path.includes("/dashboard")) return "Dashboard";
    if (path.includes("/daily-logs")) return "Daily Logs";
    if (path.includes("/contractors")) return "Contractor Management";
    if (path.includes("/extensions")) return "Extension Requests";
    if (path.includes("/equipment")) return "Equipment Management";
    if (path.includes("/materials")) return "Material Inventory";
    if (path.includes("/analytics")) return "Analytics";
    if (path.includes("/users")) return "User Management";
    if (path.includes("/settings")) return "Settings";
    return "Civil Infrastructure Dashboard";
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const getMarginLeft = () => {
    if (isMobile) return 0;
    return desktopCollapsed ? 80 : 260;
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar />

      <motion.div
        initial={false}
        animate={{
          marginLeft: getMarginLeft(),
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="flex-1 flex flex-col min-h-screen w-full transition-all duration-300"
      >
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between px-3 md:px-6 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => dispatch(toggleSidebar())}
                className="md:hidden p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Menu size={20} className="text-gray-600 dark:text-gray-300" />
              </button>

              <div>
                <motion.h1
                  key={location.pathname}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                >
                  {getPageTitle()}
                </motion.h1>
                <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 md:gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDarkMode(!darkMode)}
                className="relative p-1.5 md:p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <AnimatePresence mode="wait">
                  {darkMode ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                    >
                      <Sun size={16} className="text-yellow-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                    >
                      <Moon size={16} className="text-gray-600" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-1.5 md:p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Bell size={16} className="text-gray-600 dark:text-gray-300" />
                {notifications > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-3.5 h-3.5 md:w-4 md:h-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[8px] md:text-[10px] rounded-full flex items-center justify-center font-bold"
                  >
                    {notifications}
                  </motion.span>
                )}
              </motion.button>

              <UserDropdown />
            </div>
          </div>

          <motion.div
            className="h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.3 }}
          />
        </header>

        <main className="flex-1 p-3 md:p-6 overflow-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
};

const UserDropdown = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getRoleIcon = () => {
    switch (user?.role) {
      case "SUPER_ADMIN":
        return <Shield size={12} className="text-purple-500" />;
      case "ADMIN":
        return <UserCog size={12} className="text-blue-500" />;
      default:
        return <User size={12} className="text-green-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 md:gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="relative">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs md:text-sm shadow-md">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
        </div>
        <div className="hidden md:block text-left">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
            {user?.name || "User"}
          </p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-0.5">
            {getRoleIcon()}
            {user?.role || "USER"}
          </p>
        </div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: "spring", damping: 20 }}
            className="absolute right-0 mt-2 w-48 md:w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold text-sm md:text-base backdrop-blur-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="text-white">
                  <p className="font-semibold text-xs md:text-sm">{user?.name || "User"}</p>
                  <p className="text-[10px] opacity-90 flex items-center gap-0.5">
                    {getRoleIcon()}
                    {user?.role || "USER"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-1.5">
              <button className="w-full flex items-center gap-2 px-2.5 md:px-3 py-1.5 md:py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <User size={14} className="text-gray-500" />
                Profile Settings
              </button>

              <button className="w-full flex items-center gap-2 px-2.5 md:px-3 py-1.5 md:py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Bell size={14} className="text-gray-500" />
                Notifications
              </button>

              {user?.role === "SUPER_ADMIN" && (
                <button className="w-full flex items-center gap-2 px-2.5 md:px-3 py-1.5 md:py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Settings size={14} className="text-gray-500" />
                  System Settings
                </button>
              )}

              <div className="border-t border-gray-200 dark:border-gray-700 my-1.5" />

              <button
                onClick={() => {
                  dispatch(logout());
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 md:px-3 py-1.5 md:py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;