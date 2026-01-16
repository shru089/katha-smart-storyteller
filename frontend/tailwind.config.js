/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ec6d13",
        "background-light": "#f8f7f6",
        "background-dark": "#0F0A0A",
        "surface-dark": "#1A1410",
        "surface-light": "#ffffff",
        "text-muted": "#cbbc90",
        "text-main": "#1c1c0d",
        "text-secondary": "#6b6a45",
        "card-light": "#ffffff",
        "card-dark": "#1C1412",
        "accent-orange": "#e07a5f",
        saffron: "#ec6d13",
        amber: "#f59e0b",
        sand: "#f5efe0",
        earth: "#1a1410",
        secondary: "#c2410c", // Deep orange instead of purple
        accent: "#fbbf24",    // Golden yellow
        surface: "#1a1410",
        card: "#261c15",
        soft: "#ffedd5",
      },
      fontFamily: {
        display: '"Newsreader", serif',
        sans: '"Noto Sans", sans-serif',
        body: '"Noto Sans", sans-serif',
      },
      boxShadow: {
        glow: "0 0 15px rgba(242, 185, 13, 0.3)",
        "card-up": "0 -4px 20px rgba(0, 0, 0, 0.4)",
        float: "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        fadeIn: "fadeIn 1.2s ease-in-out",
        pan: "pan 12s ease-in-out infinite",
        shimmer: "shimmer 3s infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pan: {
          "0%": { transform: "scale(1.1) translateY(20px)" },
          "100%": { transform: "scale(1.2) translateY(-20px)" },
        },
        shimmer: {
          "0%": { left: "-100%" },
          "20%": { left: "200%" },
          "100%": { left: "200%" },
        },
      },
    },
  },
  plugins: [],
};
