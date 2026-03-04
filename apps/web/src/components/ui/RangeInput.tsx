import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface RangeInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  color?: "cyan" | "pink" | "yellow" | "green";
}

export const RangeInput = forwardRef<HTMLInputElement, RangeInputProps>(
  ({ className, label, color = "cyan", ...props }, ref) => {
    const colorMap = {
      cyan: {
        track: "#00f5ff",
        bg: "#1a1a2e",
      },
      pink: {
        track: "#ff00aa",
        bg: "#1a1a2e",
      },
      yellow: {
        track: "#ffdd00",
        bg: "#1a1a2e",
      },
      green: {
        track: "#00ff88",
        bg: "#1a1a2e",
      },
    };

    const colors = colorMap[color];

    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="text-sm sm:text-base font-mono text-text-primary">
            {label}
          </label>
        )}
        <style>{`
          input[data-range-color="${color}"]::-webkit-slider-runnable-track {
            background: linear-gradient(
              to right,
              ${colors.track} 0%,
              ${colors.track} var(--value, 0%),
              ${colors.bg} var(--value, 0%),
              ${colors.bg} 100%
            );
            height: 8px;
            border: 2px solid ${colors.track};
            border-radius: 4px;
            padding: 0;
            box-shadow: 0 0 10px ${colors.track}33;
          }

          input[data-range-color="${color}"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: ${colors.track};
            cursor: pointer;
            box-shadow: 0 0 15px ${colors.track};
            border: 2px solid ${colors.bg};
            transition: all 0.2s;
          }

          input[data-range-color="${color}"]::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 0 25px ${colors.track};
          }

          input[data-range-color="${color}"]::-moz-range-track {
            background: ${colors.bg};
            height: 8px;
            border: 2px solid ${colors.track};
            border-radius: 4px;
            box-shadow: 0 0 10px ${colors.track}33;
          }

          input[data-range-color="${color}"]::-moz-range-progress {
            background: ${colors.track};
            height: 8px;
            border-radius: 4px;
            box-shadow: 0 0 10px ${colors.track}33;
          }

          input[data-range-color="${color}"]::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: ${colors.track};
            cursor: pointer;
            box-shadow: 0 0 15px ${colors.track};
            border: 2px solid ${colors.bg};
            transition: all 0.2s;
          }

          input[data-range-color="${color}"]::-moz-range-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 0 25px ${colors.track};
          }

          input[data-range-color="${color}"]:focus-visible {
            outline: 2px solid ${colors.track};
            outline-offset: 2px;
          }
        `}</style>
        <input
          ref={ref}
          type="range"
          data-range-color={color}
          className={cn(
            "w-full h-2 sm:h-3",
            "bg-dark-panel rounded-lg appearance-none cursor-pointer",
            "transition-all duration-200",
            className
          )}
          style={
            {
              "--value": `${
                ((Number(props.value) - (Number(props.min) || 0)) /
                  ((Number(props.max) || 100) - (Number(props.min) || 0))) *
                100
              }%`,
            } as React.CSSProperties
          }
          {...props}
        />
      </div>
    );
  }
);

RangeInput.displayName = "RangeInput";
