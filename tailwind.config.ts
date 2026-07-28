import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FAF8F3",
        surface: "#FFFFFF",
        "surface-2": "#F3EFE7",
        ink: "#151510",
        "ink-2": "#4A4740",
        "ink-3": "#8A867E",
        accent: "#FF6B00",
        "accent-soft": "#FFF1E5",
        sep: "#EAE5DB",
        positive: "#2E7D5B",
        warning: "#B45309",
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
