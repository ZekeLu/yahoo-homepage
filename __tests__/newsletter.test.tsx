import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Newsletter from '@/components/Newsletter';

// We use the mocked global.fetch from jest.setup.ts
const mockedFetch = global.fetch as jest.Mock;

describe('Newsletter component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders email input and subscribe button', () => {
    render(<Newsletter />);

    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
    expect(screen.getByText('Stay informed')).toBeInTheDocument();
  });

  it('renders the descriptive text', () => {
    render(<Newsletter />);

    expect(
      screen.getByText('Get the latest news delivered straight to your inbox.')
    ).toBeInTheDocument();
  });

  it('shows success message after valid email submission', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    const user = userEvent.setup();
    render(<Newsletter />);

    const input = screen.getByPlaceholderText('Enter your email');
    const button = screen.getByRole('button', { name: /subscribe/i });

    await user.type(input, 'test@example.com');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('Thank you for subscribing!')).toBeInTheDocument();
    });
  });

  it('shows already-subscribed message when API returns non-ok', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Already subscribed' }),
    });

    const user = userEvent.setup();
    render(<Newsletter />);

    const input = screen.getByPlaceholderText('Enter your email');
    const button = screen.getByRole('button', { name: /subscribe/i });

    await user.type(input, 'existing@example.com');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("You're already subscribed!")).toBeInTheDocument();
    });
  });

  it('shows error when fetch fails (network error)', async () => {
    mockedFetch.mockRejectedValueOnce(new Error('Network error'));

    const user = userEvent.setup();
    render(<Newsletter />);

    const input = screen.getByPlaceholderText('Enter your email');
    const button = screen.getByRole('button', { name: /subscribe/i });

    await user.type(input, 'test@example.com');
    await user.click(button);

    await waitFor(() => {
      expect(
        screen.getByText('Failed to subscribe. Please try again.')
      ).toBeInTheDocument();
    });
  });

  it('does not submit when email is empty', async () => {
    const user = userEvent.setup();
    render(<Newsletter />);

    const button = screen.getByRole('button', { name: /subscribe/i });
    await user.click(button);

    // Should still show the form (not submitted)
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByText('Stay informed')).toBeInTheDocument();
    // fetch should not have been called
    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it('does not submit when email is only whitespace', async () => {
    render(<Newsletter />);

    const input = screen.getByPlaceholderText('Enter your email');
    const form = input.closest('form')!;

    // Programmatically set value to whitespace and submit form
    const { fireEvent } = require('@testing-library/react');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(form);

    // Should still show the form (not submitted)
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(mockedFetch).not.toHaveBeenCalled();
  });
});
