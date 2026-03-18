import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeProvider, { useTheme } from '@/components/ThemeProvider';

// Helper component to expose theme context
function ThemeConsumer() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  let getItemSpy: jest.SpyInstance;
  let setItemSpy: jest.SpyInstance;
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    getItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
    window.matchMedia = jest.fn().mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }) as unknown as typeof window.matchMedia;
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    window.matchMedia = originalMatchMedia;
  });

  it('defaults to light theme', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('reads stored "dark" theme from localStorage', () => {
    getItemSpy.mockReturnValue('dark');
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  it('reads stored "light" theme from localStorage', () => {
    getItemSpy.mockReturnValue('light');
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('uses system preference when no stored theme', () => {
    getItemSpy.mockReturnValue(null);
    (window.matchMedia as jest.Mock).mockReturnValue({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  it('toggles from light to dark and back', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme').textContent).toBe('light');

    await user.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(setItemSpy).toHaveBeenCalledWith('theme', 'dark');

    await user.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('theme').textContent).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(setItemSpy).toHaveBeenCalledWith('theme', 'light');
  });

  it('adds dark class to html element when theme is dark', () => {
    getItemSpy.mockReturnValue('dark');
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('renders children', () => {
    render(
      <ThemeProvider>
        <span>child content</span>
      </ThemeProvider>
    );
    expect(screen.getByText('child content')).toBeInTheDocument();
  });
});

describe('useTheme outside provider', () => {
  it('returns default context values', () => {
    function Consumer() {
      const { theme, toggleTheme } = useTheme();
      return (
        <div>
          <span data-testid="theme">{theme}</span>
          <button onClick={toggleTheme}>Toggle</button>
        </div>
      );
    }
    render(<Consumer />);
    expect(screen.getByTestId('theme').textContent).toBe('light');
    // toggleTheme is a no-op, should not throw
    expect(() => screen.getByText('Toggle').click()).not.toThrow();
  });
});
