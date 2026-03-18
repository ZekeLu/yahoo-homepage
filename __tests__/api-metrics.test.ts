/**
 * @jest-environment node
 */

import { GET } from '@/app/api/metrics/route';

jest.mock('fs', () => {
  const actual = jest.requireActual('fs');
  return {
    ...actual,
    promises: {
      ...actual.promises,
      readFile: jest.fn(),
    },
  };
});

import { promises as fs } from 'fs';

const mockReadFile = fs.readFile as jest.MockedFunction<typeof fs.readFile>;

describe('Metrics API route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns article and subscriber counts', async () => {
    const articles = JSON.stringify([{ id: 1 }, { id: 2 }, { id: 3 }]);
    const subscribers = JSON.stringify([{ email: 'a@b.com' }]);

    mockReadFile
      .mockResolvedValueOnce(articles as unknown as Buffer)
      .mockResolvedValueOnce(subscribers as unknown as Buffer);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.articleCount).toBe(3);
    expect(data.subscriberCount).toBe(1);
    expect(data).toHaveProperty('timestamp');
  });

  it('returns zero counts for empty data', async () => {
    mockReadFile
      .mockResolvedValueOnce('[]' as unknown as Buffer)
      .mockResolvedValueOnce('[]' as unknown as Buffer);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.articleCount).toBe(0);
    expect(data.subscriberCount).toBe(0);
  });

  it('returns 500 when file read fails', async () => {
    mockReadFile.mockRejectedValueOnce(new Error('File not found'));

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe('Failed to retrieve metrics');
  });
});
