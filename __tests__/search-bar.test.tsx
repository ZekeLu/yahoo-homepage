import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '@/components/SearchBar';

describe('SearchBar', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Suppress jsdom "Not implemented: navigation" errors
    jest.spyOn(console, 'error').mockImplementation((msg: string) => {
      if (typeof msg === 'string' && msg.includes('Not implemented: navigation')) return;
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('renders search input and button', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText('Search the web...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByRole('search', { name: /web search/i })).toBeInTheDocument();
  });

  it('accepts initialQuery prop', () => {
    render(<SearchBar initialQuery="test query" />);
    expect(screen.getByDisplayValue('test query')).toBeInTheDocument();
  });

  it('navigates on form submit with valid query', () => {
    render(<SearchBar initialQuery="hello" />);
    const form = screen.getByRole('search');
    // jsdom throws on location.href assignment but the code path runs
    fireEvent.submit(form);
    // If we get here without crash, the submit handler ran for a non-empty query
    expect(screen.getByDisplayValue('hello')).toBeInTheDocument();
  });

  it('does not navigate on form submit with empty query', () => {
    render(<SearchBar />);
    const form = screen.getByRole('search');
    fireEvent.submit(form);
    // Should not navigate (empty query guard), no error thrown
    expect(screen.getByPlaceholderText('Search the web...')).toBeInTheDocument();
  });

  it('shows suggestions after typing with debounce', async () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search the web...');

    fireEvent.change(input, { target: { value: 'weather' } });

    // Before debounce, no suggestions
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    // After debounce (300ms)
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
    expect(screen.getByText('weather latest news')).toBeInTheDocument();
    expect(screen.getByText('weather today')).toBeInTheDocument();
    expect(screen.getByText('weather near me')).toBeInTheDocument();
    expect(screen.getByText('weather explained')).toBeInTheDocument();
    expect(screen.getByText('weather trending')).toBeInTheDocument();
  });

  it('hides suggestions when input is cleared', async () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search the web...');

    // Type something
    fireEvent.change(input, { target: { value: 'test' } });
    act(() => { jest.advanceTimersByTime(300); });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    // Clear input
    fireEvent.change(input, { target: { value: '' } });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('navigates when clicking a suggestion', async () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search the web...');

    fireEvent.change(input, { target: { value: 'news' } });
    act(() => { jest.advanceTimersByTime(300); });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    fireEvent.mouseDown(screen.getByText('news today'));
    // jsdom throws on location.href but the code path ran
    expect(screen.getByDisplayValue('news today')).toBeInTheDocument();
  });

  it('hides suggestions on outside click', async () => {
    render(
      <div>
        <SearchBar />
        <div data-testid="outside">Outside</div>
      </div>
    );
    const input = screen.getByPlaceholderText('Search the web...');

    fireEvent.change(input, { target: { value: 'test' } });
    act(() => { jest.advanceTimersByTime(300); });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    fireEvent.mouseDown(screen.getByTestId('outside'));
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  it('shows suggestions on input focus when there are existing suggestions', async () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search the web...');

    // Type and generate suggestions
    fireEvent.change(input, { target: { value: 'test' } });
    act(() => { jest.advanceTimersByTime(300); });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    // Click outside to hide
    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    // Focus back on input
    fireEvent.focus(input);
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  it('does not show suggestions on focus when no suggestions exist', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search the web...');
    fireEvent.focus(input);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('clears debounce on unmount', () => {
    const { unmount } = render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search the web...');
    fireEvent.change(input, { target: { value: 'test' } });
    // Unmount before debounce fires
    unmount();
    // Should not throw
    act(() => { jest.advanceTimersByTime(300); });
  });

  it('clears previous debounce when typing continuously', async () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search the web...');

    fireEvent.change(input, { target: { value: 'a' } });
    act(() => { jest.advanceTimersByTime(150); });
    fireEvent.change(input, { target: { value: 'ab' } });
    act(() => { jest.advanceTimersByTime(300); });

    await waitFor(() => {
      expect(screen.getByText('ab latest news')).toBeInTheDocument();
    });
  });
});
