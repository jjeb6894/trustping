import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#dcecff",
          200: "#b9d9ff",
          300: "#8ac0ff",
          400: "#559dff",
          500: "#2f78f5",
          600: "#1f5bd1",
          700: "#1c48a8",
          800: "#1b3d87",
          900: "#1a3570",
        },
        tier: {
          insured: "#0ea86f",
          trusted: "#2f78f5",
          caution: "#e8a83c",
          risk: "#e2483d",
        },
      },
      backgroundImage: {
        "trust-gradient":
          "linear-gradient(135deg, #eef4ff 0%, #f5fbff 45%, #eafff4 100%)",
        "hero-gradient":
          "radial-gradient(circle at 20% 20%, rgba(47,120,245,0.18), transparent 45%), radial-gradient(circle at 80% 0%, rgba(14,168,111,0.15), transparent 40%)",
      },
      animation: {
        "ticker-scroll": "ticker-scroll 28s linear infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out both",
        "letter-cycle": "letter-cycle 4s ease-in-out both",
        "bubble-float": "bubble-float 4s ease-in-out both",
        "brand-drift": "brand-drift 6s ease-in-out infinite",
      },
      keyframes: {
        "ticker-scroll": {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(-50%)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(47,120,245,0.35)" },
          "70%": { boxShadow: "0 0 0 12px rgba(47,120,245,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(47,120,245,0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "letter-cycle": {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.92)" },
          "12%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "85%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(-8px) scale(0.92)" },
        },
        "bubble-float": {
          "0%": { opacity: "0", transform: "translateY(16px) scale(0.75)" },
          "14%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-10px) scale(1)" },
          "82%": { opacity: "1", transform: "translateY(-18px) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(-36px) scale(0.85)" },
        },
        "brand-drift": {
          "0%, 100%": { transform: "translateY(0) scale(1)", opacity: "0.55" },
          "50%": { transform: "translateY(-14px) scale(1.05)", opacity: "0.9" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
