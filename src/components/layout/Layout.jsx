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

import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../features/ui/uiSlice";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import { useState, useRef, useEffect } from "react";
import { LogOut, User } from "lucide-react";
import { logout } from "../../features/auth/authSlice";

const Layout = () => {
  const dispatch = useDispatch();

  // ✅ Get collapse state
  const { desktopCollapsed } = useSelector((state) => state.ui);

  return (
    <div className="flex min-h-screen bg-light">
      <Sidebar />

      {/* ✅ Content Wrapper */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300
       ${desktopCollapsed ? "ml-0 md:ml-20" : "ml-0 md:ml-64"}`}
      >
        {/* ================= TOPBAR ================= */}
       <header className="flex items-center justify-between bg-white shadow px-6 py-4 relative">
  <button
    onClick={() => dispatch(toggleSidebar())}
    className="md:hidden"
  >
    <Menu size={22} />
  </button>

  <h1 className="text-lg font-semibold">
    Civil Infrastructure Dashboard
  </h1>

  <UserDropdown />
</header>

        {/* ================= PAGE CONTENT ================= */}
        <main className="flex-1 p-6 space-y-6 transition-all duration-300">
          <Outlet />
        </main>
      </div>
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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer"
      >
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
          {user?.name?.charAt(0)}
        </div>
      </div>

      {open && (
        <div className="absolute right-0 mt-3 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
          <div className="px-4 py-2 text-sm text-gray-600 border-b">
            {user?.name}
          </div>

          <button
            onClick={() => dispatch(logout())}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Layout;