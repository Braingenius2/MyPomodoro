import { cn } from "@/lib/utils";

type CornerPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";
type ColorVariant = "cyan" | "pink" | "yellow" | "green";

interface CornerDecorationProps {
  position: CornerPosition;
  color?: ColorVariant;
  size?: "sm" | "md" | "lg";
}

const colorClasses: Record<ColorVariant, string> = {
  cyan: "border-neon-cyan",
  pink: "border-neon-pink",
  yellow: "border-neon-yellow",
  green: "border-neon-green",
};

const sizeClasses: Record<string, { outer: string; inner: string }> = {
  sm: {
    outer: "w-2 h-2",
    inner: "border-t border-l border-t-[1px] border-l-[1px]",
  },
  md: {
    outer: "w-3 h-3",
    inner: "border-t-2 border-l-2",
  },
  lg: {
    outer: "w-4 h-4",
    inner: "border-t-4 border-l-4",
  },
};

const positionClasses: Record<CornerPosition, string> = {
  "top-left": "top-0 left-0 border-t border-l",
  "top-right": "top-0 right-0 border-t border-r",
  "bottom-left": "bottom-0 left-0 border-b border-l",
  "bottom-right": "bottom-0 right-0 border-b border-r",
};

/**
 * CornerDecoration - Reusable corner accent element
 * Displays a pixel-art style corner decoration in neon colors
 *
 * @example
 * <CornerDecoration position="top-left" color="cyan" size="md" />
 */
export function CornerDecoration({
  position,
  color = "cyan",
  size = "md",
}: CornerDecorationProps) {
  return (
    <div
      className={cn(
        "absolute pointer-events-none",
        sizeClasses[size].outer,
        positionClasses[position],
        colorClasses[color]
      )}
      aria-hidden="true"
    />
  );
}

export default CornerDecoration;
