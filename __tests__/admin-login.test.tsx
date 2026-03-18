import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminLoginPage from '@/app/admin/login/page';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockedFetch = global.fetch as jest.Mock;

describe('AdminLoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form', () => {
    render(<AdminLoginPage />);
    expect(screen.getByText('Yahoo!')).toBeInTheDocument();
    expect(screen.getByText('Content Management System')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('submits password and redirects on success', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    const user = userEvent.setup();
    render(<AdminLoginPage />);

    await user.type(screen.getByLabelText('Password'), 'correct-password');
    await user.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(mockedFetch).toHaveBeenCalledWith('/api/auth', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ password: 'correct-password' }),
      }));
      expect(mockPush).toHaveBeenCalledWith('/admin');
    });
  });

  it('shows error on failed login', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Invalid password' }),
    });

    const user = userEvent.setup();
    render(<AdminLoginPage />);

    await user.type(screen.getByLabelText('Password'), 'wrong-password');
    await user.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(screen.getByText('Invalid password')).toBeInTheDocument();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('shows default error message when no error in response', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({}),
    });

    const user = userEvent.setup();
    render(<AdminLoginPage />);

    await user.type(screen.getByLabelText('Password'), 'wrong');
    await user.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(screen.getByText('Incorrect password')).toBeInTheDocument();
    });
  });

  it('shows error on network failure', async () => {
    mockedFetch.mockRejectedValueOnce(new Error('network error'));

    const user = userEvent.setup();
    render(<AdminLoginPage />);

    await user.type(screen.getByLabelText('Password'), 'test');
    await user.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument();
    });
  });

  it('shows loading state during submission', async () => {
    mockedFetch.mockReturnValueOnce(new Promise(() => {})); // never resolves

    const user = userEvent.setup();
    render(<AdminLoginPage />);

    await user.type(screen.getByLabelText('Password'), 'test');
    await user.click(screen.getByText('Sign in'));

    expect(screen.getByText('Signing in...')).toBeInTheDocument();
  });

  it('disables button during loading', async () => {
    mockedFetch.mockReturnValueOnce(new Promise(() => {}));

    const user = userEvent.setup();
    render(<AdminLoginPage />);

    await user.type(screen.getByLabelText('Password'), 'test');
    await user.click(screen.getByText('Sign in'));

    expect(screen.getByText('Signing in...')).toBeDisabled();
  });

  it('clears error before new submission', async () => {
    mockedFetch
      .mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Bad password' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

    const user = userEvent.setup();
    render(<AdminLoginPage />);

    // First failed attempt
    await user.type(screen.getByLabelText('Password'), 'wrong');
    await user.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(screen.getByText('Bad password')).toBeInTheDocument();
    });

    // Second successful attempt
    await user.clear(screen.getByLabelText('Password'));
    await user.type(screen.getByLabelText('Password'), 'correct');
    await user.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(screen.queryByText('Bad password')).not.toBeInTheDocument();
    });
  });

  it('handles ok:true but success:false response', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: false, error: 'Wrong credentials' }),
    });

    const user = userEvent.setup();
    render(<AdminLoginPage />);

    await user.type(screen.getByLabelText('Password'), 'bad');
    await user.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(screen.getByText('Wrong credentials')).toBeInTheDocument();
    });
  });
});
