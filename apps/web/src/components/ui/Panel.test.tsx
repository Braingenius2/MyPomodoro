import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Panel } from "@/components/ui/Panel";

describe("Panel", () => {
  it("renders its children", () => {
    render(<Panel>Panel content</Panel>);

    expect(screen.getByText("Panel content")).toBeInTheDocument();
  });

  it("supports the glass variant", () => {
    const { container } = render(<Panel variant="glass">Glass panel</Panel>);

    expect(container.firstChild).toHaveClass("bg-dark-panel/50", "backdrop-blur-xl");
  });

  it("applies glow styles when requested", () => {
    const { container } = render(<Panel glow="yellow">Glowing panel</Panel>);

    expect(container.firstChild).toHaveClass(
      "border-neon-yellow/30",
      "shadow-[0_0_40px_rgba(255,221,0,0.15),0_0_80px_rgba(255,221,0,0.05)]"
    );
  });

  it("merges custom classes", () => {
    const { container } = render(<Panel className="custom-panel">Custom panel</Panel>);

    expect(container.firstChild).toHaveClass("custom-panel");
  });
});
