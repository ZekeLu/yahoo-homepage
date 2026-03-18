import { render } from '@testing-library/react';
import SkeletonCard from '@/components/SkeletonCard';

describe('SkeletonCard', () => {
  it('renders loading skeleton with pulse animation', () => {
    const { container } = render(<SkeletonCard />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toBeTruthy();
    expect(wrapper.className).toContain('animate-pulse');
  });

  it('renders three placeholder bars', () => {
    const { container } = render(<SkeletonCard />);
    const bars = container.querySelectorAll('.bg-gray-200');
    expect(bars.length).toBe(3);
  });
});
