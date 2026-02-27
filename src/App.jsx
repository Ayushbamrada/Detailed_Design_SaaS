import AppRoutes from "./app/routes";
import Snackbar from "./features/notifications/Snackbar";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

function App() {
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <AppRoutes />
        </motion.div>
      </AnimatePresence>

      <Snackbar />
    </>
  );
}

export default App;