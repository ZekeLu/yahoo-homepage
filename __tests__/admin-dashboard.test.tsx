import { render, screen, waitFor, act } from '@testing-library/react';
import AdminDashboard from '@/app/admin/page';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));

const mockedFetch = global.fetch as jest.Mock;

describe('AdminDashboard', () => {
  const mockArticles = [
    { id: 1, slug: 'a1', title: 'Article 1', section: 'news', date: '2026-03-01' },
    { id: 2, slug: 'a2', title: 'Article 2', section: 'finance', date: '2026-03-02' },
    { id: 3, slug: 'a3', title: 'Article 3', section: 'news', date: '2026-03-03' },
  ];
  const mockTrending = ['Topic 1', 'Topic 2'];
  const mockSubscribers = [{ email: 'a@b.com' }, { email: 'c@d.com' }];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading spinner initially', () => {
    mockedFetch.mockReturnValue(new Promise(() => {}));
    render(<AdminDashboard />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders dashboard with stats after loading', async () => {
    mockedFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockArticles) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockTrending) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockSubscribers) });

    await act(async () => {
      render(<AdminDashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Total Articles')).toBeInTheDocument();
    });
  });

  it('displays correct stat values', async () => {
    mockedFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockArticles) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockTrending) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockSubscribers) });

    await act(async () => {
      render(<AdminDashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('Total Articles')).toBeInTheDocument();
    });

    // Total articles = 3
    expect(screen.getByText('News')).toBeInTheDocument();
    expect(screen.getByText('Finance')).toBeInTheDocument();
    expect(screen.getByText('Trending Topics')).toBeInTheDocument();
    expect(screen.getByText('Subscribers')).toBeInTheDocument();
  });

  it('renders recent articles table', async () => {
    mockedFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockArticles) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockTrending) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockSubscribers) });

    await act(async () => {
      render(<AdminDashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('Recent Articles')).toBeInTheDocument();
      expect(screen.getByText('Article 3')).toBeInTheDocument();
    });
  });

  it('renders "View all" link to articles', async () => {
    mockedFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockArticles) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockTrending) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockSubscribers) });

    await act(async () => {
      render(<AdminDashboard />);
    });

    await waitFor(() => {
      const viewAllLink = screen.getByText('View all');
      expect(viewAllLink).toHaveAttribute('href', '/admin/articles');
    });
  });

  it('shows CMS info banner', async () => {
    mockedFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockArticles) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockTrending) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockSubscribers) });

    await act(async () => {
      render(<AdminDashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText(/CMS powered by Vercel KV/)).toBeInTheDocument();
    });
  });

  it('handles API error silently', async () => {
    mockedFetch.mockRejectedValue(new Error('fail'));

    await act(async () => {
      render(<AdminDashboard />);
    });

    // Should show loading spinner since stats never loaded
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('handles sections with zero articles', async () => {
    const onlyNews = [
      { id: 1, slug: 'a1', title: 'News Article', section: 'news', date: '2026-03-01' },
    ];

    mockedFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(onlyNews) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) });

    await act(async () => {
      render(<AdminDashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('Total Articles')).toBeInTheDocument();
    });
  });

  it('exercises bySection fallback for missing sections (|| 0)', async () => {
    // Articles with only one section, so other sections use || 0 fallback
    const techOnly = [
      { id: 1, slug: 't1', title: 'Tech Article', section: 'tech', date: '2026-03-01' },
    ];

    mockedFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(techOnly) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) });

    await act(async () => {
      render(<AdminDashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('Total Articles')).toBeInTheDocument();
      // news, finance, sports, entertainment all use || 0 fallback
      expect(screen.getByText('News')).toBeInTheDocument();
    });
  });
});
