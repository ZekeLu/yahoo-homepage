import { renderHook, waitFor } from '@testing-library/react';
import { useCmsData, useCmsArticles } from '@/hooks/useCmsData';

const mockedFetch = global.fetch as jest.Mock;

describe('useCmsData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns bundled articles and default trending initially', () => {
    mockedFetch.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useCmsData());

    expect(result.current.loading).toBe(true);
    expect(result.current.articles.length).toBeGreaterThan(0);
    expect(result.current.trending).toContain('Climate Summit');
  });

  it('fetches articles and trending from API', async () => {
    const apiArticles = [{ slug: 'api-article', title: 'API Article', section: 'news', category: 'World', author: 'Test', date: '2026-01-01', snippet: '', body: [], imageUrl: '' }];
    const apiTrending = ['API Topic 1', 'API Topic 2'];

    mockedFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(apiArticles) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(apiTrending) });

    const { result } = renderHook(() => useCmsData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.articles).toEqual(apiArticles);
    expect(result.current.trending).toEqual(apiTrending);
  });

  it('keeps defaults when API returns empty arrays', async () => {
    mockedFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) });

    const { result } = renderHook(() => useCmsData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.articles.length).toBeGreaterThan(0);
    expect(result.current.trending).toContain('Climate Summit');
  });

  it('keeps defaults when API returns non-ok', async () => {
    mockedFetch
      .mockResolvedValueOnce({ ok: false })
      .mockResolvedValueOnce({ ok: false });

    const { result } = renderHook(() => useCmsData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.articles.length).toBeGreaterThan(0);
    expect(result.current.trending).toContain('Climate Summit');
  });

  it('keeps defaults when fetch rejects', async () => {
    mockedFetch.mockRejectedValue(new Error('network error'));

    const { result } = renderHook(() => useCmsData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.articles.length).toBeGreaterThan(0);
  });

  it('keeps defaults when API returns non-array', async () => {
    mockedFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve('not an array') })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(null) });

    const { result } = renderHook(() => useCmsData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.articles.length).toBeGreaterThan(0);
    expect(result.current.trending).toContain('Climate Summit');
  });
});

describe('useCmsArticles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns bundled articles initially', () => {
    mockedFetch.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useCmsArticles());

    expect(result.current.loading).toBe(true);
    expect(result.current.articles.length).toBeGreaterThan(0);
  });

  it('fetches articles from API', async () => {
    const apiArticles = [{ slug: 'api', title: 'API', section: 'news', category: 'World', author: 'Test', date: '2026-01-01', snippet: '', body: [], imageUrl: '' }];

    mockedFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(apiArticles) });

    const { result } = renderHook(() => useCmsArticles());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.articles).toEqual(apiArticles);
  });

  it('keeps defaults when API returns empty', async () => {
    mockedFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) });

    const { result } = renderHook(() => useCmsArticles());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.articles.length).toBeGreaterThan(0);
  });

  it('keeps defaults when API fails', async () => {
    mockedFetch.mockResolvedValueOnce({ ok: false });

    const { result } = renderHook(() => useCmsArticles());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.articles.length).toBeGreaterThan(0);
  });

  it('keeps defaults when fetch rejects', async () => {
    mockedFetch.mockRejectedValueOnce(new Error('fail'));

    const { result } = renderHook(() => useCmsArticles());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.articles.length).toBeGreaterThan(0);
  });

  it('keeps defaults when API returns non-array', async () => {
    mockedFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(null) });

    const { result } = renderHook(() => useCmsArticles());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.articles.length).toBeGreaterThan(0);
  });
});
