import { useDispatch, useSelector } from "react-redux";
import { hideSnackbar } from "./notificationSlice";
import { useEffect } from "react";

const Snackbar = () => {
  const dispatch = useDispatch();
  const { open, message, type } = useSelector(
    (state) => state.notification
  );

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        dispatch(hideSnackbar());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!open) return null;

  const colors = {
    info: "bg-blue-600",
    success: "bg-green-600",
    warning: "bg-yellow-500",
    error: "bg-red-600",
  };

  return (
    <div
      className={`fixed bottom-5 right-5 text-white px-4 py-3 rounded-lg shadow-lg ${colors[type]}`}
    >
      {message}
    </div>
  );
};

export default Snackbar;