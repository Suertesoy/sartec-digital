/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./script.js"],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: "1.75rem",
      screens: { xl: "1200px" },
    },
    extend: {
      colors: {
        bg: { DEFAULT: "#10245d", 2: "#142b68", 3: "#0b1844" },
        surface: {
          DEFAULT: "rgba(19, 39, 91, 0.72)",
          2: "rgba(25, 49, 108, 0.78)",
        },
        blue: {
          DEFAULT: "#292D96",
          light: "#8ea2ff",
        },
        red: {
          DEFAULT: "#FF1720",
          light: "#ff5b62",
        },
        ink: {
          DEFAULT: "#f4f7ff",
          2: "#c2cbed",
          3: "#a3b1de",
        },
        line: {
          DEFAULT: "rgba(183, 199, 255, 0.16)",
          light: "rgba(206, 216, 255, 0.26)",
        },
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        sm: "10px",
        md: "14px",
        lg: "20px",
        pill: "100px",
      },
      boxShadow: {
        card: "0 8px 30px -12px rgba(4, 10, 32, 0.55)",
        "card-hover": "0 16px 44px -14px rgba(4, 10, 32, 0.7)",
        glow: "0 0 0 1px rgba(142, 162, 255, 0.28), 0 0 40px -8px rgba(41, 45, 150, 0.55)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
