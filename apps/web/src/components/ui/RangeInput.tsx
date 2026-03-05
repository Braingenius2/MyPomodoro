import { forwardRef } from "react";

interface RangeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  color?: "cyan" | "pink" | "yellow" | "green";
}

const colorMap = {
  cyan: "#00f5ff",
  pink: "#ff00aa",
  yellow: "#ffdd00",
  green: "#00ff88",
};

export const RangeInput = forwardRef<HTMLInputElement, RangeInputProps>(
  ({ className, color = "cyan", min, max, value, ...props }, ref) => {
    const trackColor = colorMap[color];
    const percentage = ((Number(value) - Number(min)) / (Number(max) - Number(min))) * 100;

    return (
      <div className="relative">
        <style>{`
          input[data-range="${color}"] {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 6px;
            background: linear-gradient(to right, ${trackColor} 0%, ${trackColor} ${percentage}%, rgba(255,255,255,0.1) ${percentage}%, rgba(255,255,255,0.1) 100%);
            border-radius: 3px;
            cursor: pointer;
          }
          input[data-range="${color}"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: ${trackColor};
            cursor: pointer;
            box-shadow: 0 0 10px ${trackColor}80;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          input[data-range="${color}"]::-webkit-slider-thumb:hover {
            transform: scale(1.15);
            box-shadow: 0 0 20px ${trackColor};
          }
          input[data-range="${color}"]::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: ${trackColor};
            cursor: pointer;
            border: none;
            box-shadow: 0 0 10px ${trackColor}80;
          }
        `}</style>
        <input
          ref={ref}
          type="range"
          data-range={color}
          min={min}
          max={max}
          value={value}
          className={className}
          {...props}
        />
      </div>
    );
  }
);

RangeInput.displayName = "RangeInput";
