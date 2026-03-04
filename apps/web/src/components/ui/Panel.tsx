import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glowMap: Record<string, string> = {
  cyan: "shadow-[0_0_30px_var(--accent-cyan),inset_0_0_30px_rgba(0,245,255,0.05)] hover:shadow-[0_0_50px_var(--accent-cyan),inset_0_0_30px_rgba(0,245,255,0.08)]",
  pink: "shadow-[0_0_30px_rgba(255,0,170,0.4),inset_0_0_20px_rgba(255,0,170,0.05)] hover:shadow-[0_0_40px_rgba(255,0,170,0.5),inset_0_0_25px_rgba(255,0,170,0.1)]",
};

const panelVariants = cva(
  cn(
    "relative rounded-2xl sm:rounded-3xl border-2",
    "transition-shadow duration-300"
  ),
  {
    variants: {
      variant: {
        primary: cn("bg-gradient-to-br from-dark-panel to-[#1a1a2e] border-neon-cyan", glowMap.cyan),
        secondary: cn("bg-gradient-to-br from-dark-panel to-[#1a1a2e] border-neon-pink", glowMap.pink),
      },
      size: {
        sm: "p-4 sm:p-6",
        md: "p-6 sm:p-8 md:p-10",
        lg: "p-8 sm:p-10 md:p-12 lg:p-16",
        xl: "p-10 sm:p-12 md:p-16 lg:p-20",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface PanelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof panelVariants> {}

const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(panelVariants({ variant, size }), className)}
      {...props}
    />
  )
);

Panel.displayName = "Panel";

export { Panel, panelVariants };
