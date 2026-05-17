import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FDF8F0",          // warm cream — replaces cold white
        foreground: "#2D2A26",          // slightly warmer than pure charcoal
        teal: {
          DEFAULT: "#1A7A6D",
          light: "#E6F4F1",
          dark: "#145f55",
        },
        terracotta: {
          DEFAULT: "#C4725A",
          light: "#F7EDE9",
        },
        mustard: {
          DEFAULT: "#D4A017",
          light: "#FDF3D0",
        },
        card: "#FFFFFF",                // white cards on cream = depth without shadow
        muted: "#8A8070",               // warm, not cold grey
        "warm-border": "#E8E2D9",       // warm parchment border
        // Legacy aliases kept for PromptDetail blurs etc.
        yellow: {
          pro: "#D4A017",              // upgraded from bright #F5C800 → rich mustard
          "pro-light": "#FDF3D0",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
