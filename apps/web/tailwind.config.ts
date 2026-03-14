import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0a0a12',
        'dark-panel': '#12121f',
        'neon-cyan': '#00f5ff',
        'neon-pink': '#ff00aa',
        'neon-yellow': '#ffdd00',
        'neon-green': '#00ff88',
        'neon-red': '#ff4444',
        'text-primary': '#e0e0ff',
        'text-dim': '#6a6a8a',
      },
      fontFamily: {
        mono: ["'Courier New'", 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
