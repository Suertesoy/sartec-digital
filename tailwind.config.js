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
        bg: { DEFAULT: "#0D1B16", 2: "#10241C" },
        surface: {
          DEFAULT: "#132A21",
          2: "#1B362A",
          hover: "#264236",
        },
        green: {
          DEFAULT: "#22C55E",
          light: "#4ADE80",
        },
        ink: {
          DEFAULT: "#F3F5F4",
          2: "#B7C4BD",
          3: "#869089",
          // Aditivos (Fase 1 — Home): quase-preto real, sem tingimento
          // verde — usado só pelos componentes novos (hero, territórios).
          950: "#0A0B0A",
          900: "#121312",
        },
        line: {
          DEFAULT: "rgba(243, 245, 244, 0.08)",
          light: "rgba(243, 245, 244, 0.14)",
        },
        // Aditivo (Fase 1 — Home): off-white usado só pela seção
        // Territórios, para o ritmo claro/escuro da página.
        paper: {
          DEFAULT: "#F4F2EC",
          ink: "#17181A",
          "ink-2": "#55584f",
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
        card: "0 8px 30px -12px rgba(0, 0, 0, 0.55)",
        "card-hover": "0 16px 44px -14px rgba(0, 0, 0, 0.7)",
        glow: "0 0 0 1px rgba(34, 197, 94, 0.28), 0 0 40px -8px rgba(34, 197, 94, 0.40)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
