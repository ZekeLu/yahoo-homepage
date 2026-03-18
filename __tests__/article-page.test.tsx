import { render, screen, waitFor } from '@testing-library/react';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({ slug: 'global-leaders-climate-summit-geneva' }),
  usePathname: () => '/article/global-leaders-climate-summit-geneva',
}));

// Mock IntersectionObserver
beforeAll(() => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
});

// Use the mocked global.fetch from jest.setup.ts
const mockedFetch = global.fetch as jest.Mock;

import ArticleContent from '@/app/article/[slug]/ArticleContent';
import { allArticles } from '@/lib/articles';

describe('Article page (ArticleContent)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders article title, author, and date for a valid slug', async () => {
    // Mock fetch to return articles from API
    mockedFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(allArticles),
    });

    render(<ArticleContent />);

    await waitFor(() => {
      expect(
        screen.getByText('Global Leaders Gather for Historic Climate Summit in Geneva')
      ).toBeInTheDocument();
    });

    expect(screen.getByText(/Sarah Mitchell/)).toBeInTheDocument();
    expect(screen.getByText('March 17, 2026')).toBeInTheDocument();
  });

  it('renders the article category badge', async () => {
    mockedFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(allArticles),
    });

    render(<ArticleContent />);

    await waitFor(() => {
      expect(screen.getByText('World News')).toBeInTheDocument();
    });
  });

  it('renders related articles section', async () => {
    mockedFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(allArticles),
    });

    render(<ArticleContent />);

    await waitFor(() => {
      expect(screen.getByText('Related Articles')).toBeInTheDocument();
    });
  });

  it('renders back to home link', async () => {
    mockedFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(allArticles),
    });

    render(<ArticleContent />);

    await waitFor(() => {
      expect(screen.getByText(/Back to Home/)).toBeInTheDocument();
    });
  });

  it('shows not-found state for an invalid slug', async () => {
    // Override useParams for this test
    const navigation = require('next/navigation');
    const originalUseParams = navigation.useParams;
    navigation.useParams = () => ({ slug: 'non-existent-article-slug' });

    mockedFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(allArticles),
    });

    render(<ArticleContent />);

    await waitFor(() => {
      expect(screen.getByText('Article not found')).toBeInTheDocument();
    });

    // Restore
    navigation.useParams = originalUseParams;
  });
});
