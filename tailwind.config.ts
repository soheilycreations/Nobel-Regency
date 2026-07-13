import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F2D577",
          dark: "#9C7A22",
          bronze: "#8A6E2F",
        },
        charcoal: {
          DEFAULT: "#1A1A1A",
          soft: "#242424",
          deep: "#0E0E0E",
        },
        navy: {
          DEFAULT: "#10213A",
          light: "#1B3358",
          deep: "#0A1626",
        },
        ivory: "#FFFFFF",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #9C7A22 0%, #D4AF37 45%, #F2D577 60%, #D4AF37 78%, #9C7A22 100%)",
        "gold-line":
          "linear-gradient(90deg, transparent, #D4AF37, transparent)",
        "navy-gold":
          "linear-gradient(135deg, #0A1626 0%, #10213A 40%, #1B3358 70%, #10213A 100%)",
        grain: "url('/textures/grain.png')",
      },
      boxShadow: {
        gold: "0 0 0 1px rgba(212,175,55,0.35), 0 8px 30px -8px rgba(212,175,55,0.35)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        shimmer: "shimmer 2.8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
