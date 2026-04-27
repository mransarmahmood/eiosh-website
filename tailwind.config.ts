import type { Config } from "tailwindcss";

// EIOSH design tokens — navy authority + cyan clarity + gold conversion.
// Derived from the EIOSH Global logo. All semantic colors route through these scales
// so theming and Arabic RTL inversion stay consistent.
const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx,md,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        navy: {
          50: "#EEF2F9",
          100: "#D6DEEE",
          200: "#AEBDDD",
          300: "#7D92C3",
          400: "#4E69A5",
          500: "#2B4886",
          600: "#1A3670",
          700: "#12295C",
          800: "#0D204B",
          900: "#0A1F44",
          950: "#06142E",
        },
        cyan: {
          50: "#EAFAFE",
          100: "#CFF3FC",
          200: "#9FE6F8",
          300: "#6FD7F2",
          400: "#3FC6EA",
          500: "#1FB6E0",
          600: "#0C95BC",
          700: "#0A7698",
          800: "#0A5A76",
          900: "#0C445A",
        },
        gold: {
          50: "#FBF6E8",
          100: "#F4E7BC",
          200: "#ECD382",
          300: "#E3BD48",
          400: "#D4A017",
          500: "#B4851A",
          600: "#8F6818",
          700: "#6B4E15",
          800: "#4A3610",
          900: "#2E2109",
        },
        ink: {
          DEFAULT: "#0F172A",
          muted: "#475569",
          soft: "#64748B",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#F8FAFC",
          sunken: "#F1F5F9",
        },
        border: {
          DEFAULT: "#D8DEE9",
          strong: "#B7C0CD",
        },
      },
      fontFamily: {
        heading: ["Lexend", "system-ui", "sans-serif"],
        body: ["'Source Sans 3'", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Pragmatic type scale for executive education readability.
        "display-xl": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "600" }],
        "display-lg": ["3.5rem", { lineHeight: "1.08", letterSpacing: "-0.02em", fontWeight: "600" }],
        "display-md": ["2.75rem", { lineHeight: "1.1", letterSpacing: "-0.015em", fontWeight: "600" }],
        "display-sm": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "600" }],
      },
      boxShadow: {
        // Stronger default elevation so white-on-white cards read clearly at arm's length.
        elevated: "0 2px 4px rgba(10, 31, 68, 0.06), 0 12px 28px -10px rgba(10, 31, 68, 0.22)",
        floating: "0 6px 16px rgba(10, 31, 68, 0.1), 0 28px 56px -18px rgba(10, 31, 68, 0.3)",
        ring: "0 0 0 1px rgba(10, 31, 68, 0.12)",
      },
      backgroundImage: {
        "grid-subtle":
          "linear-gradient(to right, rgba(10, 31, 68, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(10, 31, 68, 0.04) 1px, transparent 1px)",
        "brand-gradient": "linear-gradient(135deg, #0A1F44 0%, #12295C 45%, #0C95BC 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, #EEF2F9 0%, #EAFAFE 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both",
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
