import { motion, AnimatePresence } from "framer-motion";
import aimantraLogo from "../../assets/aimantraa.png";

const LoadingModal = ({ isVisible = true }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="flex items-center justify-center"
          >
            
            <motion.img
              src={aimantraLogo}
              alt="Amantra Logo"
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain"
              animate={{ 
                rotate: 360,
              }}
              transition={{ 
                rotate: { 
                  duration: 2.5, 
                  repeat: Infinity, 
                  ease: "linear" 
                }
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='url(%23grad)'/%3E%3Ctext x='50' y='70' text-anchor='middle' fill='white' font-size='40' font-weight='bold'%3EA%3C/text%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%233B82F6'/%3E%3Cstop offset='100%25' stop-color='%238B5CF6'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E";
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingModal;