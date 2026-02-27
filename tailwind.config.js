/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        primary: "#0F172A",     // Deep Navy
        secondary: "#1E293B",   // Steel Gray
        accent: "#F59E0B",      // Construction Yellow
        success: "#16A34A",
        danger: "#DC2626",
        warning: "#FACC15",
        light: "#F8FAFC",
      },
      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.08)",
        sidebar: "4px 0 10px rgba(0,0,0,0.15)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
};