import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Design tokens - Neon color palette
 * These map to CSS variables defined in globals.css
 */
export const COLORS = {
  cyan: "#00f5ff",
  pink: "#ff00aa",
  yellow: "#ffdd00",
  green: "#00ff88",
  darkBg: "#0a0a12",
  darkPanel: "#12121f",
  textPrimary: "#e0e0ff",
  textDim: "#6a6a8a",
} as const;

export type ColorKey = keyof typeof COLORS;

/**
 * Get CSS variable name for a color
 */
export function getColorVar(color: ColorKey): string {
  const varMap: Record<ColorKey, string> = {
    cyan: "var(--accent-cyan)",
    pink: "var(--accent-pink)",
    yellow: "var(--accent-yellow)",
    green: "var(--accent-green)",
    darkBg: "var(--bg-dark)",
    darkPanel: "var(--bg-panel)",
    textPrimary: "var(--text-primary)",
    textDim: "var(--text-dim)",
  };
  return varMap[color];
}
