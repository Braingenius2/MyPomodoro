import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-bg": "var(--bg-dark)",
        "dark-panel": "var(--bg-panel)",
        "neon-cyan": "var(--accent-cyan)",
        "neon-pink": "var(--accent-pink)",
        "neon-yellow": "var(--accent-yellow)",
        "neon-green": "var(--accent-green)",
        "text-primary": "var(--text-primary)",
        "text-dim": "var(--text-dim)",
      },
      fontFamily: {
        mono: ["'Courier New', monospace"],
      },
      keyframes: {
        "progress-glow": {
          "0%, 100%": { opacity: "0.8" },
          "50%": { opacity: "1" },
        },
        scanlines: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 4px" },
        },
      },
      animation: {
        "progress-glow": "progress-glow 2s ease-in-out infinite",
        scanlines: "scanlines 8s linear infinite",
      },
      boxShadow: {
        "glow-cyan": "0 0 10px var(--accent-cyan), 0 0 20px var(--accent-cyan), 0 0 40px var(--accent-cyan)",
        "glow-pink": "0 0 10px var(--accent-pink), 0 0 20px var(--accent-pink)",
        "glow-yellow": "0 0 10px var(--accent-yellow), 0 0 20px var(--accent-yellow)",
        "glow-green": "0 0 10px var(--accent-green), 0 0 20px var(--accent-green)",
      },
    },
  },
  plugins: [],
};

export default config;
