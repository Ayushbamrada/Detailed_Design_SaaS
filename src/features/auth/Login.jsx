// import { useDispatch } from "react-redux";
// import { loginSuccess } from "./authSlice";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { useState } from "react";

// const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [role, setRole] = useState("USER");

//   const handleLogin = () => {
//     const mockUser = {
//       id: "1",
//       name: "Ayush Bamrada",
//       role,
//       token: "mock-jwt-token",
//     };

//     dispatch(loginSuccess(mockUser));
//     navigate("/dashboard");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-light">
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white p-8 rounded-xl2 shadow-card w-96"
//       >
//         <h2 className="text-xl font-bold mb-6 text-center">
//           CivilTrack Login
//         </h2>

//         <div className="space-y-4">
//           <select
//             className="w-full p-3 border rounded-lg"
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//           >
//             <option value="SUPER_ADMIN">Super Admin</option>
//             <option value="ADMIN">Admin</option>
//             <option value="USER">User</option>
//           </select>

//           <button
//             onClick={handleLogin}
//             className="w-full bg-accent text-black py-3 rounded-lg font-semibold hover:opacity-90 transition"
//           >
//             Login
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Login;


import { useDispatch } from "react-redux";
import { loginSuccess } from "./authSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [role, setRole] = useState("SUPER_ADMIN"); // Default to SUPER_ADMIN for testing
  const [name, setName] = useState("Ayush Bamrada");

  const handleLogin = () => {
    const mockUser = {
      id: "1",
      name: name,
      role,
      token: "mock-jwt-token-" + Date.now(), // Unique token
    };

    console.log("Logging in with user:", mockUser);
    dispatch(loginSuccess(mockUser));
    
    // Small delay to ensure state is updated
    setTimeout(() => {
      navigate("/dashboard");
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Detailed Design Login
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
            </select>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;