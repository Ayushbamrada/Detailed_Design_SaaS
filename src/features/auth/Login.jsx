import { useDispatch } from "react-redux";
import { loginSuccess } from "./authSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [role, setRole] = useState("USER");

  const handleLogin = () => {
    const mockUser = {
      id: "1",
      name: "Ayush Bamrada",
      role,
      token: "mock-jwt-token",
    };

    dispatch(loginSuccess(mockUser));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-xl2 shadow-card w-96"
      >
        <h2 className="text-xl font-bold mb-6 text-center">
          CivilTrack Login
        </h2>

        <div className="space-y-4">
          <select
            className="w-full p-3 border rounded-lg"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </select>

          <button
            onClick={handleLogin}
            className="w-full bg-accent text-black py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;