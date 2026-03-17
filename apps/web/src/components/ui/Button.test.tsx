import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders its children", () => {
    render(<Button>Start</Button>);

    expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
  });

  it("calls the click handler", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Click me</Button>);
    await user.click(screen.getByRole("button", { name: "Click me" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("supports disabled buttons", () => {
    render(<Button disabled>Disabled</Button>);

    expect(screen.getByRole("button", { name: "Disabled" })).toBeDisabled();
  });

  it("applies the active glow for mode buttons", () => {
    render(
      <Button variant="mode" colorScheme="green" isActive>
        Active mode
      </Button>
    );

    expect(screen.getByRole("button", { name: "Active mode" })).toHaveClass(
      "bg-dark-panel/50",
      "border-neon-green/40",
      "shadow-[0_0_20px_rgba(0,255,136,0.4)]"
    );
  });

  it("merges custom classes with the component styles", () => {
    render(<Button className="custom-class">Custom</Button>);

    expect(screen.getByRole("button", { name: "Custom" })).toHaveClass("custom-class");
  });
});
