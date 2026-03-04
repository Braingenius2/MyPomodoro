import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  it('should render button with label', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should handle click events', async () => {
    const handleClick = () => {};
    const spy = vi.fn(handleClick);
    render(<Button onClick={spy}>Click</Button>);
    
    await userEvent.click(screen.getByText('Click'));
    expect(spy).toHaveBeenCalled();
  });

  it('should apply correct variant styles', () => {
    const { container } = render(<Button variant="mode">Mode Button</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('px-6', 'py-2', 'sm:px-8', 'sm:py-3');
  });

  it('should apply colorScheme styles', () => {
    const { container } = render(<Button colorScheme="cyan">Color Button</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('border-neon-cyan', 'text-neon-cyan');
  });

  it('should apply active state styles', () => {
    const { container } = render(
      <Button isActive={true} colorScheme="cyan">
        Active Button
      </Button>
    );
    const button = container.querySelector('button');
    expect(button).toHaveClass('shadow-[0_0_30px_currentColor]');
  });

  it('should be disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('should render with icon children', () => {
    render(
      <Button>
        <span data-testid="icon">⚙</span>
        Settings
      </Button>
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should support different color schemes', () => {
    const colors = ['cyan', 'pink', 'yellow', 'green'] as const;
    colors.forEach(color => {
      const { container } = render(<Button colorScheme={color}>Test</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass(`border-neon-${color}`, `text-neon-${color}`);
    });
  });
});