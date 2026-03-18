import { render, screen, fireEvent } from '@testing-library/react';
import BackToTop from '@/components/BackToTop';

describe('BackToTop', () => {
  let scrollToSpy: jest.SpyInstance;

  beforeEach(() => {
    scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders a back-to-top button', () => {
    render(<BackToTop />);
    expect(screen.getByRole('button', { name: /back to top/i })).toBeInTheDocument();
  });

  it('becomes visible when scrolled past 300px', () => {
    render(<BackToTop />);
    const button = screen.getByRole('button', { name: /back to top/i });

    // Initially hidden (has opacity-0)
    expect(button.className).toContain('opacity-0');

    // Simulate scroll past 300
    Object.defineProperty(window, 'scrollY', { value: 400, writable: true });
    fireEvent.scroll(window);

    expect(button.className).toContain('opacity-100');
  });

  it('hides when scrolled back up below 300px', () => {
    render(<BackToTop />);
    const button = screen.getByRole('button', { name: /back to top/i });

    // Scroll down
    Object.defineProperty(window, 'scrollY', { value: 400, writable: true });
    fireEvent.scroll(window);
    expect(button.className).toContain('opacity-100');

    // Scroll back up
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    fireEvent.scroll(window);
    expect(button.className).toContain('opacity-0');
  });

  it('scrolls to top smoothly when clicked', () => {
    render(<BackToTop />);
    const button = screen.getByRole('button', { name: /back to top/i });

    fireEvent.click(button);
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('removes scroll listener on unmount', () => {
    const removeSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = render(<BackToTop />);
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    removeSpy.mockRestore();
  });
});
