import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Panel } from '@/components/ui/Panel';

describe('Panel Component', () => {
  it('should render panel with children', () => {
    const { getByText } = render(<Panel>Panel Content</Panel>);
    expect(getByText('Panel Content')).toBeInTheDocument();
  });

  it('should apply variant styles', () => {
    const { container: primary } = render(<Panel variant="primary">Primary</Panel>);
    const primaryPanel = primary.querySelector('div');
    expect(primaryPanel).toHaveClass('border-neon-cyan');

    const { container: secondary } = render(<Panel variant="secondary">Secondary</Panel>);
    const secondaryPanel = secondary.querySelector('div');
    expect(secondaryPanel).toHaveClass('border-neon-pink');
  });

  it('should apply size classes', () => {
    const sizes = ['sm', 'md', 'lg', 'xl'] as const;
    sizes.forEach(size => {
      const { container } = render(<Panel size={size}>Content</Panel>);
      const panel = container.querySelector('div');
      
      const sizeMap = {
        sm: ['p-4', 'sm:p-6'],
        md: ['p-6', 'sm:p-8', 'md:p-10'],
        lg: ['p-8', 'sm:p-10', 'md:p-12', 'lg:p-16'],
        xl: ['p-10', 'sm:p-12', 'md:p-16', 'lg:p-20'],
      };
      
      expect(panel).toHaveClass(...sizeMap[size]);
    });
  });

  it('should apply rounded corners', () => {
    const { container } = render(<Panel>Content</Panel>);
    const panel = container.querySelector('div');
    expect(panel).toHaveClass('rounded-2xl', 'sm:rounded-3xl');
  });

  it('should apply border styling', () => {
    const { container } = render(<Panel>Content</Panel>);
    const panel = container.querySelector('div');
    expect(panel).toHaveClass('border-2');
  });

  it('should accept custom className', () => {
    const { container } = render(<Panel className="custom-class">Content</Panel>);
    const panel = container.querySelector('div');
    expect(panel).toHaveClass('custom-class');
  });

  it('should combine variant, size, and custom classes', () => {
    const { container } = render(
      <Panel variant="secondary" size="lg" className="custom">
        Content
      </Panel>
    );
    const panel = container.querySelector('div');
    expect(panel).toHaveClass('border-neon-pink', 'p-8', 'sm:p-10', 'custom');
  });
});