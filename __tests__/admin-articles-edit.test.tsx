import { render, screen, waitFor, act } from '@testing-library/react';
import EditArticlePage from '@/app/admin/articles/[id]/edit/page';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useParams: () => ({ id: 'test-article' }),
}));

const mockedFetch = global.fetch as jest.Mock;

describe('EditArticlePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders page heading', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{
        title: 'Test',
        slug: 'test-article',
        section: 'news',
        category: 'Cat',
        subcategory: '',
        author: 'Auth',
        date: '2026-01-01',
        snippet: '',
        body: [],
        tags: [],
        isFeatured: false,
      }]),
    });

    await act(async () => {
      render(<EditArticlePage />);
    });

    expect(screen.getByText('Edit Article')).toBeInTheDocument();
    expect(screen.getByText('Update article details')).toBeInTheDocument();
  });

  it('passes articleId from useParams to ArticleForm', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{
        title: 'Test',
        slug: 'test-article',
        section: 'news',
        category: 'Cat',
        subcategory: '',
        author: 'Auth',
        date: '2026-01-01',
        snippet: '',
        body: [],
        tags: [],
        isFeatured: false,
      }]),
    });

    await act(async () => {
      render(<EditArticlePage />);
    });

    await waitFor(() => {
      expect(screen.getByText('Update Article')).toBeInTheDocument();
    });
  });

  it('handles non-string params.id (array)', async () => {
    const navigation = require('next/navigation');
    const originalUseParams = navigation.useParams;
    navigation.useParams = () => ({ id: ['array', 'value'] });

    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await act(async () => {
      render(<EditArticlePage />);
    });

    expect(screen.getByText('Edit Article')).toBeInTheDocument();

    navigation.useParams = originalUseParams;
  });
});
