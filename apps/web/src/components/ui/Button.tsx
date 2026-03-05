import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "mode";
  colorScheme?: "cyan" | "pink" | "yellow" | "green";
  size?: "sm" | "md" | "lg";
  isActive?: boolean;
}

const colorMap = {
  cyan: {
    bg: "bg-neon-cyan",
    text: "text-neon-cyan",
    glow: "shadow-[0_0_20px_rgba(0,245,255,0.4)]",
    border: "border-neon-cyan/40",
    hoverBg: "hover:bg-neon-cyan hover:text-dark-bg",
  },
  pink: {
    bg: "bg-neon-pink",
    text: "text-neon-pink",
    glow: "shadow-[0_0_20px_rgba(255,0,170,0.4)]",
    border: "border-neon-pink/40",
    hoverBg: "hover:bg-neon-pink hover:text-dark-bg",
  },
  yellow: {
    bg: "bg-neon-yellow",
    text: "text-neon-yellow",
    glow: "shadow-[0_0_20px_rgba(255,221,0,0.4)]",
    border: "border-neon-yellow/40",
    hoverBg: "hover:bg-neon-yellow hover:text-dark-bg",
  },
  green: {
    bg: "bg-neon-green",
    text: "text-neon-green",
    glow: "shadow-[0_0_20px_rgba(0,255,136,0.4)]",
    border: "border-neon-green/40",
    hoverBg: "hover:bg-neon-green hover:text-dark-bg",
  },
};

const sizeMap = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", colorScheme = "cyan", size = "md", isActive, children, ...props }, ref) => {
    const colors = colorMap[colorScheme];
    
    const baseStyles = `
      relative inline-flex items-center justify-center gap-2
      font-mono font-black uppercase tracking-wider
      transition-all duration-300 ease-out
      rounded-xl border
      focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-95
    `;

    const variantStyles = {
      primary: `bg-gradient-to-b from-dark-surface to-dark-panel ${colors.border} ${colors.text} ${colors.hoverBg}`,
      secondary: `bg-transparent ${colors.border} ${colors.text} hover:${colors.glow}`,
      ghost: `bg-transparent border-transparent ${colors.text} hover:bg-white/5`,
      mode: `bg-dark-panel/50 ${colors.border} ${colors.text} ${isActive ? colors.glow : ''}`,
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeMap[size],
          isActive && colors.glow,
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
