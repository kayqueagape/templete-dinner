/** @type {import("tailwindcss").Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0f0e0c",
        surface: "#1a1916",
        surface2: "#242220",
        border: "#2e2c29",
        text: "#f0ebe3",
        muted: "#8a8278",
        accent: {
          DEFAULT: "#d4a853",
          hover: "#e8bf6e",
          light: "rgba(212,168,83,0.12)",
        },
        danger: "#e05252",
        success: "#5eb87e",
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        serif: ["DM Serif Display", "Georgia", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease both",
        "slide-up": "slideUp 0.45s ease both",
        "scale-in": "scaleIn 0.3s ease both",
        "spin-slow": "spin 1.5s linear infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { transform: "translateY(16px)", opacity: "0" }, to: { transform: "translateY(0)", opacity: "1" } },
        scaleIn: { from: { transform: "scale(0.96)", opacity: "0" }, to: { transform: "scale(1)", opacity: "1" } },
      },
      borderRadius: { DEFAULT: "8px" },
      boxShadow: {
        "glow": "0 0 20px rgba(212,168,83,0.15)",
        "deep": "0 20px 60px rgba(0,0,0,0.5)",
      }
    },
  },
  plugins: [],
}