import { render, screen, fireEvent, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '@/components/Navbar';
import ThemeProvider from '@/components/ThemeProvider';

// Mock IntersectionObserver
beforeAll(() => {
  const mockIO = jest.fn();
  mockIO.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIO;
});

function renderNavbar() {
  return render(
    <ThemeProvider>
      <Navbar />
    </ThemeProvider>
  );
}

const originalMatchMedia = window.matchMedia;

describe('Navbar', () => {
  beforeEach(() => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
    window.matchMedia = jest.fn().mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }) as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    window.matchMedia = originalMatchMedia;
  });

  it('renders logo', () => {
    renderNavbar();
    expect(screen.getByText('Yahoo!')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderNavbar();
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(within(nav).getAllByText('News').length).toBeGreaterThanOrEqual(1);
    expect(within(nav).getAllByText('Finance').length).toBeGreaterThanOrEqual(1);
    expect(within(nav).getAllByText('Sports').length).toBeGreaterThanOrEqual(1);
    expect(within(nav).getAllByText('Entertainment').length).toBeGreaterThanOrEqual(1);
    expect(within(nav).getAllByText('Tech').length).toBeGreaterThanOrEqual(1);
  });

  it('renders dark mode toggle button', () => {
    renderNavbar();
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument();
  });

  it('toggles dark mode when clicking the button', async () => {
    const user = userEvent.setup();
    renderNavbar();

    const toggleBtn = screen.getByRole('button', { name: /switch to dark mode/i });
    await user.click(toggleBtn);

    expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument();
  });

  it('renders mobile menu hamburger button', () => {
    renderNavbar();
    const menuBtn = screen.getByRole('button', { name: /open main menu/i });
    expect(menuBtn).toBeInTheDocument();
  });

  it('toggles mobile menu on hamburger click', async () => {
    const user = userEvent.setup();
    renderNavbar();

    const menuBtn = screen.getByRole('button', { name: /open main menu/i });
    await user.click(menuBtn);

    expect(screen.getByRole('button', { name: /close main menu/i })).toBeInTheDocument();

    // Click again to close
    await user.click(screen.getByRole('button', { name: /close main menu/i }));
    expect(screen.getByRole('button', { name: /open main menu/i })).toBeInTheDocument();
  });

  it('scrolls to section when clicking desktop nav link', async () => {
    const scrollIntoViewMock = jest.fn();
    const section = document.createElement('div');
    section.id = 'finance';
    section.scrollIntoView = scrollIntoViewMock;
    document.body.appendChild(section);

    const user = userEvent.setup();
    renderNavbar();

    // Desktop nav links
    const desktopList = screen.getAllByRole('list')[0];
    const financeLink = within(desktopList).getByText('Finance');
    await user.click(financeLink);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });

    document.body.removeChild(section);
  });

  it('scrolls to section and closes menu when clicking mobile nav link', async () => {
    const scrollIntoViewMock = jest.fn();
    const section = document.createElement('div');
    section.id = 'sports';
    section.scrollIntoView = scrollIntoViewMock;
    document.body.appendChild(section);

    const user = userEvent.setup();
    renderNavbar();

    // Open mobile menu first
    await user.click(screen.getByRole('button', { name: /open main menu/i }));

    // Mobile nav links (in the mobile-menu div)
    const mobileMenu = document.getElementById('mobile-menu')!;
    const sportsLink = within(mobileMenu).getByText('Sports');
    await user.click(sportsLink);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });

    document.body.removeChild(section);
  });

  it('handles click on nav link when target section does not exist', async () => {
    const user = userEvent.setup();
    renderNavbar();

    const desktopList = screen.getAllByRole('list')[0];
    const newsLink = within(desktopList).getByText('News');
    // Should not throw even if #news doesn't exist in DOM
    await user.click(newsLink);
  });

  it('sets active section based on IntersectionObserver', () => {
    // Store callbacks per section so we can trigger them independently
    const observerCallbacks: Record<string, (entries: { isIntersecting: boolean }[]) => void> = {};
    let callIndex = 0;
    const sectionIds = ['news', 'finance', 'sports', 'entertainment', 'tech'];

    (window.IntersectionObserver as jest.Mock).mockImplementation((cb: (entries: { isIntersecting: boolean }[]) => void) => {
      const idx = callIndex++;
      if (idx < sectionIds.length) {
        observerCallbacks[sectionIds[idx]] = cb;
      }
      return {
        observe: () => null,
        unobserve: () => null,
        disconnect: () => null,
      };
    });

    // Create section elements
    const elements = sectionIds.map(id => {
      const el = document.createElement('div');
      el.id = id;
      document.body.appendChild(el);
      return el;
    });

    const { rerender } = render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    );

    // Trigger finance section as active - this exercises the isActive === true branch
    act(() => {
      if (observerCallbacks['finance']) {
        observerCallbacks['finance']([{ isIntersecting: true }]);
      }
    });

    // Force re-render to pick up the state change
    rerender(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    );

    // Verify the active styling is applied (the isActive branch on line 72 and 144-150)
    const desktopList = screen.getAllByRole('list')[0];
    const financeLink = within(desktopList).getByText('Finance');
    expect(financeLink.className).toContain('font-bold');
    expect(financeLink.className).toContain('underline');

    // Also check mobile menu - open it first
    const menuBtn = screen.getByRole('button', { name: /open main menu/i });
    fireEvent.click(menuBtn);

    const mobileMenu = document.getElementById('mobile-menu')!;
    const mobileFinanceLink = within(mobileMenu).getByText('Finance');
    expect(mobileFinanceLink.className).toContain('font-bold');
    expect(mobileFinanceLink.className).toContain('underline');

    // Trigger with isIntersecting: false to cover that branch
    act(() => {
      if (observerCallbacks['finance']) {
        observerCallbacks['finance']([{ isIntersecting: false }]);
      }
    });

    expect(window.IntersectionObserver).toHaveBeenCalled();

    elements.forEach(el => document.body.removeChild(el));
  });

  it('handles mobile nav link click when target section does not exist', async () => {
    const user = userEvent.setup();
    renderNavbar();

    // Open mobile menu
    await user.click(screen.getByRole('button', { name: /open main menu/i }));

    // Click on a section that doesn't exist in DOM - no section elements added
    // The href is #news but querySelector('#news') returns null, so scrollIntoView is not called
    const mobileMenu = document.getElementById('mobile-menu')!;
    const techLink = within(mobileMenu).getByText('Tech');
    await user.click(techLink);

    // Should not crash even if #tech doesn't exist
  });

  it('disconnects observers on unmount', () => {
    const disconnectMock = jest.fn();
    (window.IntersectionObserver as jest.Mock).mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: disconnectMock,
    });

    // Create elements for observers to attach to
    const sections = ['news', 'finance', 'sports', 'entertainment', 'tech'];
    const elements = sections.map(id => {
      const el = document.createElement('div');
      el.id = id;
      document.body.appendChild(el);
      return el;
    });

    const { unmount } = renderNavbar();
    unmount();

    expect(disconnectMock).toHaveBeenCalled();

    elements.forEach(el => document.body.removeChild(el));
  });
});
