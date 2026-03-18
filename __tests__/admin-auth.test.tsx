import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminAuthProvider, { useAdminAuth } from '@/components/AdminAuth';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockedFetch = global.fetch as jest.Mock;

function LogoutButton() {
  const { logout } = useAdminAuth();
  return <button onClick={logout}>Logout</button>;
}

describe('AdminAuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children', () => {
    render(
      <AdminAuthProvider>
        <span>Admin Content</span>
      </AdminAuthProvider>
    );
    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('provides logout function that calls DELETE /api/auth and redirects', async () => {
    mockedFetch.mockResolvedValueOnce({ ok: true });
    const user = userEvent.setup();

    render(
      <AdminAuthProvider>
        <LogoutButton />
      </AdminAuthProvider>
    );

    await user.click(screen.getByText('Logout'));

    await waitFor(() => {
      expect(mockedFetch).toHaveBeenCalledWith('/api/auth', { method: 'DELETE' });
      expect(mockPush).toHaveBeenCalledWith('/admin/login');
    });
  });
});

describe('useAdminAuth outside provider', () => {
  it('returns default context', () => {
    function Consumer() {
      const { logout } = useAdminAuth();
      return <button onClick={logout}>Logout</button>;
    }
    render(<Consumer />);
    // Default logout is a no-op
    expect(() => screen.getByText('Logout').click()).not.toThrow();
  });
});
