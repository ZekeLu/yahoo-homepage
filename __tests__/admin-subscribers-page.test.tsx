import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminSubscribersPage from '@/app/admin/subscribers/page';

const mockedFetch = global.fetch as jest.Mock;

describe('AdminSubscribersPage', () => {
  const mockSubscribers = [
    { email: 'alice@test.com', date: '2026-01-15T00:00:00Z' },
    { email: 'bob@test.com', date: '2026-02-20T00:00:00Z' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders page heading', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSubscribers),
    });

    await act(async () => {
      render(<AdminSubscribersPage />);
    });

    expect(screen.getByText('Newsletter Subscribers')).toBeInTheDocument();
  });

  it('displays subscribers from API', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSubscribers),
    });

    await act(async () => {
      render(<AdminSubscribersPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('alice@test.com')).toBeInTheDocument();
      expect(screen.getByText('bob@test.com')).toBeInTheDocument();
    });
  });

  it('shows subscriber count', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSubscribers),
    });

    await act(async () => {
      render(<AdminSubscribersPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('2 total subscribers')).toBeInTheDocument();
    });
  });

  it('filters subscribers by search', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSubscribers),
    });

    const user = userEvent.setup();

    await act(async () => {
      render(<AdminSubscribersPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('alice@test.com')).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText('Search by email...'), 'alice');

    expect(screen.getByText('alice@test.com')).toBeInTheDocument();
    expect(screen.queryByText('bob@test.com')).not.toBeInTheDocument();
  });

  it('shows "No subscribers yet" when empty', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await act(async () => {
      render(<AdminSubscribersPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('No subscribers yet')).toBeInTheDocument();
    });
  });

  it('shows "No matching subscribers" when search has no results', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSubscribers),
    });

    const user = userEvent.setup();

    await act(async () => {
      render(<AdminSubscribersPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('alice@test.com')).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText('Search by email...'), 'nonexistent');

    expect(screen.getByText('No matching subscribers')).toBeInTheDocument();
  });

  it('deletes a subscriber', async () => {
    mockedFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSubscribers),
      })
      .mockResolvedValueOnce({ ok: true });

    const user = userEvent.setup();

    await act(async () => {
      render(<AdminSubscribersPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('alice@test.com')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('alice@test.com')).not.toBeInTheDocument();
    });

    expect(mockedFetch).toHaveBeenCalledWith('/api/subscribers', expect.objectContaining({
      method: 'DELETE',
    }));
  });

  it('exports CSV', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSubscribers),
    });

    const createObjectURL = jest.fn().mockReturnValue('blob:test');
    const revokeObjectURL = jest.fn();
    global.URL.createObjectURL = createObjectURL;
    global.URL.revokeObjectURL = revokeObjectURL;

    const clickMock = jest.fn();
    const origCreateElement = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') {
        const anchor = origCreateElement('a');
        anchor.click = clickMock;
        return anchor;
      }
      return origCreateElement(tag);
    });

    const user = userEvent.setup();

    await act(async () => {
      render(<AdminSubscribersPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('alice@test.com')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Export CSV'));

    expect(createObjectURL).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalled();

    jest.restoreAllMocks();
  });

  it('disables Export CSV when no subscribers', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await act(async () => {
      render(<AdminSubscribersPage />);
    });

    await waitFor(() => {
      const btn = screen.getByText('Export CSV');
      expect(btn).toHaveAttribute('disabled');
    });
  });

  it('handles API error gracefully', async () => {
    mockedFetch.mockResolvedValueOnce({ ok: false });

    await act(async () => {
      render(<AdminSubscribersPage />);
    });

    expect(screen.getByText('Newsletter Subscribers')).toBeInTheDocument();
  });

  it('exercises useEffect fetch catch when fetch rejects', async () => {
    mockedFetch.mockRejectedValueOnce(new Error('network error'));

    await act(async () => {
      render(<AdminSubscribersPage />);
    });

    // Should not crash, catch callback handles the error
    expect(screen.getByText('Newsletter Subscribers')).toBeInTheDocument();
  });

  it('exercises handleDelete fetch catch when delete rejects', async () => {
    mockedFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSubscribers),
      })
      .mockRejectedValueOnce(new Error('delete failed'));

    const user = userEvent.setup();

    await act(async () => {
      render(<AdminSubscribersPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('alice@test.com')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    await user.click(deleteButtons[0]);

    // Should not crash, catch callback handles the error
    // The subscriber is still removed from local state
    await waitFor(() => {
      expect(screen.queryByText('alice@test.com')).not.toBeInTheDocument();
    });
  });
});
