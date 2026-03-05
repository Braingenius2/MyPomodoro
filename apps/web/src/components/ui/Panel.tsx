import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "glass";
  glow?: "cyan" | "pink" | "yellow" | "green";
}

const glowMap = {
  cyan: "shadow-[0_0_40px_rgba(0,245,255,0.15),0_0_80px_rgba(0,245,255,0.05)]",
  pink: "shadow-[0_0_40px_rgba(255,0,170,0.15),0_0_80px_rgba(255,0,170,0.05)]",
  yellow: "shadow-[0_0_40px_rgba(255,221,0,0.15),0_0_80px_rgba(255,221,0,0.05)]",
  green: "shadow-[0_0_40px_rgba(0,255,136,0.15),0_0_80px_rgba(0,255,136,0.05)]",
};

const borderMap = {
  cyan: "border-neon-cyan/30",
  pink: "border-neon-pink/30",
  yellow: "border-neon-yellow/30",
  green: "border-neon-green/30",
};

const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ className, variant = "primary", glow, children, ...props }, ref) => {
    const baseStyles = "relative rounded-[2rem] transition-all duration-500";
    
    const variantStyles = {
      primary: "bg-gradient-to-b from-dark-panel to-dark-surface border border-white/5",
      secondary: "bg-gradient-to-b from-dark-surface to-dark-panel border border-white/5",
      glass: "bg-dark-panel/50 backdrop-blur-xl border border-white/10",
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          glow && glowMap[glow],
          glow && borderMap[glow],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Panel.displayName = "Panel";

export { Panel };
