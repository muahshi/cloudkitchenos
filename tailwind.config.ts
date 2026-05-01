import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ── Brand colors ────────────────────────────────────────────────────
      colors: {
        brand: {
          indigo: {
            DEFAULT: "#6366f1",
            50: "#eef2ff",
            100: "#e0e7ff",
            400: "#818cf8",
            500: "#6366f1",
            600: "#4f46e5",
            700: "#4338ca",
            950: "#1e1b4b",
          },
          emerald: {
            DEFAULT: "#10b981",
            400: "#34d399",
            500: "#10b981",
            600: "#059669",
            950: "#022c22",
          },
        },
        surface: {
          1: "#0f172a",
          2: "#1e293b",
          3: "#334155",
        },
      },

      // ── Typography ──────────────────────────────────────────────────────
      fontFamily: {
        sans: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
        display: ["Sora", "var(--font-dm-sans)", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },

      // ── Border radius ───────────────────────────────────────────────────
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      // ── Custom shadows ──────────────────────────────────────────────────
      boxShadow: {
        "glow-indigo": "0 0 40px rgba(99, 102, 241, 0.2), 0 0 80px rgba(99, 102, 241, 0.05)",
        "glow-emerald": "0 0 40px rgba(16, 185, 129, 0.15), 0 0 60px rgba(16, 185, 129, 0.05)",
        "card": "0 4px 24px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 0, 0, 0.3)",
        "card-hover": "0 8px 40px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.4)",
      },

      // ── Animations ──────────────────────────────────────────────────────
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "spin-slow": "spin 3s linear infinite",
        "pulse-ring": "pulseRing 2s ease-in-out infinite",
        "typewriter": "typewriter 3s steps(40) forwards",
        "gradient-x": "gradientX 4s ease infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseRing: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(99, 102, 241, 0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(99, 102, 241, 0)" },
        },
        typewriter: {
          from: { width: "0" },
          to: { width: "100%" },
        },
        gradientX: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },

      // ── Background gradients ─────────────────────────────────────────────
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #6366f1 0%, #10b981 100%)",
        "gradient-dark": "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        "mesh-indigo": "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.1) 0%, transparent 60%)",
      },

      // ── Backdrop blur ────────────────────────────────────────────────────
      backdropBlur: {
        xs: "2px",
        "2xl": "40px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
  ],
};

export default config;
