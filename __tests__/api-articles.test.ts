/**
 * @jest-environment node
 */
import { allArticles } from '@/lib/articles';

// Mock @vercel/kv so @/lib/kv can be imported
jest.mock('@vercel/kv', () => ({
  kv: { get: jest.fn(), set: jest.fn() },
}));

// Mock @/lib/dataHelpers
const mockReadDataFile = jest.fn();
const mockWriteDataFile = jest.fn();
jest.mock('@/lib/dataHelpers', () => ({
  readDataFile: (...args: unknown[]) => mockReadDataFile(...args),
  writeDataFile: (...args: unknown[]) => mockWriteDataFile(...args),
}));

import { GET, POST } from '@/app/api/articles/route';

beforeEach(() => {
  jest.clearAllMocks();
  mockReadDataFile.mockResolvedValue([...allArticles]);
  mockWriteDataFile.mockResolvedValue(undefined);
});

describe('Articles API route', () => {
  describe('GET /api/articles', () => {
    it('returns a list of articles as JSON', async () => {
      const res = await GET();
      const data = await res.json();
      expect(res.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });

    it('falls back to allArticles when readDataFile rejects', async () => {
      mockReadDataFile.mockRejectedValueOnce(new Error('fail'));
      const res = await GET();
      const data = await res.json();
      expect(res.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });

    it('falls back to allArticles when outer catch triggers', async () => {
      // Make readDataFile.catch itself throw to trigger outer catch
      mockReadDataFile.mockImplementationOnce(() => {
        throw new Error('sync error');
      });
      const res = await GET();
      const data = await res.json();
      expect(res.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('POST /api/articles', () => {
    it('creates a new article with valid data', async () => {
      const newArticle = {
        slug: 'test-article',
        title: 'Test Article',
        snippet: 'A test',
        category: 'Tech',
        section: 'news',
        author: 'Tester',
        date: 'March 18, 2026',
        body: ['Paragraph one.'],
        imageUrl: 'https://example.com/img.jpg',
      };

      const request = new Request('http://localhost/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle),
      });

      const res = await POST(request);
      const data = await res.json();

      expect(res.status).toBe(201);
      expect(data.slug).toBe('test-article');
      expect(data.title).toBe('Test Article');
      expect(mockWriteDataFile).toHaveBeenCalledWith(
        'articles.json',
        expect.arrayContaining([expect.objectContaining({ slug: 'test-article' })])
      );
    });

    it('returns 500 when request body is invalid JSON', async () => {
      const request = new Request('http://localhost/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not json',
      });

      const res = await POST(request);
      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.error).toBeDefined();
    });

    it('falls back to allArticles in POST when readDataFile rejects', async () => {
      mockReadDataFile.mockRejectedValueOnce(new Error('fail'));
      const article = {
        slug: 'fallback-post',
        title: 'Fallback',
        author: 'A',
        snippet: '',
        category: 'News',
        section: 'news',
        date: '',
        body: [],
        imageUrl: '',
      };

      const req = new Request('http://localhost/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      });

      const res = await POST(req);
      expect(res.status).toBe(201);
      expect(mockWriteDataFile).toHaveBeenCalled();
    });

    it('appends the new article to the existing list', async () => {
      const article = {
        slug: 'appended',
        title: 'Appended',
        author: 'A',
        snippet: '',
        category: 'News',
        section: 'news',
        date: '',
        body: [],
        imageUrl: '',
      };

      const req = new Request('http://localhost/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      });

      const res = await POST(req);
      expect(res.status).toBe(201);
      expect(mockWriteDataFile).toHaveBeenCalled();

      const savedArticles = mockWriteDataFile.mock.calls[0][1];
      expect(savedArticles.length).toBe(allArticles.length + 1);
    });
  });
});
