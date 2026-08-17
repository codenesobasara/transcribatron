import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Dark theme — warm-ink canvas so the light product shots pop.
        // Accent stays the exact app orange (#FF6B00, sampled from the shot).
        bg: "#15130F",
        surface: "#211D17",
        "surface-2": "#2B261F",
        ink: "#FAF8F3",
        "ink-2": "#B5AFA3",
        "ink-3": "#8B867C",
        accent: "#FF6B00",
        "accent-soft": "#2C1D10",
        sep: "#322D25",
        positive: "#4FBF8B",
        warning: "#E0913F",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      maxWidth: {
        container: "72rem",
      },
      borderRadius: {
        "2xl": "1.25rem",
      },
      fontSize: {
        "hero-mobile": ["3rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "hero": ["5rem", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
      },
    },
  },
  plugins: [],
};

export default config;
