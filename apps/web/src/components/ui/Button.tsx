import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  cn(
    "relative inline-flex items-center justify-center",
    "font-mono font-black uppercase tracking-wider",
    "transition-all duration-200 ease-out",
    "border-2",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan",
    "disabled:opacity-50 disabled:cursor-not-allowed"
  ),
  {
    variants: {
      variant: {
        mode: cn(
          "px-6 py-2 sm:px-8 sm:py-3",
          "text-sm sm:text-base",
          "bg-dark-panel border-neon-cyan text-neon-cyan",
          "hover:border-neon-cyan hover:bg-neon-cyan hover:text-dark-bg",
          "hover:shadow-[0_0_20px_var(--accent-cyan)]",
          "active:transform active:scale-95"
        ),
        control: cn(
          "p-3 sm:p-4",
          "text-lg sm:text-xl",
          "bg-gradient-to-b from-[#2a2a4a] to-dark-panel",
          "border-neon-cyan text-neon-cyan",
          "hover:bg-neon-cyan hover:text-dark-bg",
          "hover:shadow-[0_0_20px_var(--accent-cyan)]",
          "hover:scale-110",
          "active:scale-95"
        ),
        settings: cn(
          "px-4 sm:px-6 py-2 sm:py-3",
          "text-sm sm:text-base",
          "bg-dark-panel",
          "border-neon-cyan text-neon-cyan",
          "hover:bg-neon-cyan hover:text-dark-bg",
          "hover:shadow-[0_0_15px_var(--accent-cyan)]",
          "active:scale-95"
        ),
      },
      isActive: {
        true: "shadow-[0_0_30px_currentColor]",
        false: "",
      },
      colorScheme: {
        cyan: "border-neon-cyan text-neon-cyan hover:shadow-[0_0_20px_var(--accent-cyan)]",
        pink: "border-neon-pink text-neon-pink hover:shadow-[0_0_20px_var(--accent-pink)]",
        yellow: "border-neon-yellow text-neon-yellow hover:shadow-[0_0_20px_var(--accent-yellow)]",
        green: "border-neon-green text-neon-green hover:shadow-[0_0_20px_var(--accent-green)]",
      },
    },
    defaultVariants: {
      variant: "control",
      isActive: false,
      colorScheme: "cyan",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, isActive, colorScheme, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        buttonVariants({ variant, isActive, colorScheme }),
        className
      )}
      {...props}
    />
  )
);

Button.displayName = "Button";

export { Button, buttonVariants };
