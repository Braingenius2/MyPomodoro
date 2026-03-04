import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const baseButtonStyles = cn(
  "relative inline-flex items-center justify-center",
  "font-mono font-black uppercase tracking-wider",
  "transition-all duration-200 ease-out",
  "border-2",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan",
  "disabled:opacity-50 disabled:cursor-not-allowed",
  "active:scale-95"
);

const colorGlowMap: Record<string, string> = {
  cyan: "shadow-[0_0_20px_var(--accent-cyan)]",
  pink: "shadow-[0_0_20px_var(--accent-pink)]",
  yellow: "shadow-[0_0_20px_var(--accent-yellow)]",
  green: "shadow-[0_0_20px_var(--accent-green)]",
};

const buttonVariants = cva(baseButtonStyles, {
  variants: {
    variant: {
      mode: "px-6 py-2 sm:px-8 sm:py-3 text-sm sm:text-base bg-dark-panel",
      control: "p-3 sm:p-4 text-lg sm:text-xl bg-gradient-to-b from-[#2a2a4a] to-dark-panel hover:scale-110",
      settings: "px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-dark-panel",
    },
    isActive: {
      true: "shadow-[0_0_30px_currentColor]",
      false: "",
    },
    colorScheme: {
      cyan: "border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-dark-bg",
      pink: "border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-dark-bg",
      yellow: "border-neon-yellow text-neon-yellow hover:bg-neon-yellow hover:text-dark-bg",
      green: "border-neon-green text-neon-green hover:bg-neon-green hover:text-dark-bg",
    },
  },
  defaultVariants: {
    variant: "control",
    isActive: false,
    colorScheme: "cyan",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, isActive, colorScheme, ...props }, ref) => {
    const glowClass = colorScheme ? `hover:${colorGlowMap[colorScheme]}` : "";
    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, isActive, colorScheme }),
          glowClass,
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
