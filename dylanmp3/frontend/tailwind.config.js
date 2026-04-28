/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0f",
        card: "#16161f",
        accent: "#ff0000",
        accent2: "#ff4444",
        success: "#00d4aa",
        fore: "#f0f0f8",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
