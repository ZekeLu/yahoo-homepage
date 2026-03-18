/**
 * @jest-environment node
 */

jest.mock('@vercel/kv', () => ({
  kv: { get: jest.fn(), set: jest.fn() },
}));

const mockReadDataFile = jest.fn();
const mockWriteDataFile = jest.fn();
jest.mock('@/lib/dataHelpers', () => ({
  readDataFile: (...args: unknown[]) => mockReadDataFile(...args),
  writeDataFile: (...args: unknown[]) => mockWriteDataFile(...args),
}));

import { GET, PUT } from '@/app/api/trending/route';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/trending', () => {
  it('returns trending topics from data file', async () => {
    const topics = ['Topic 1', 'Topic 2'];
    mockReadDataFile.mockResolvedValue(topics);

    const res = await GET();
    const data = await res.json();

    expect(data).toEqual(topics);
    expect(mockReadDataFile).toHaveBeenCalledWith('trending.json');
  });

  it('returns defaults when readDataFile rejects', async () => {
    mockReadDataFile.mockRejectedValue(new Error('fail'));

    const res = await GET();
    const data = await res.json();

    expect(Array.isArray(data)).toBe(true);
  });

  it('returns defaults when outer catch triggers', async () => {
    mockReadDataFile.mockImplementationOnce(() => {
      throw new Error('sync error');
    });

    const res = await GET();
    const data = await res.json();

    expect(Array.isArray(data)).toBe(true);
  });
});

describe('PUT /api/trending', () => {
  it('updates trending topics', async () => {
    mockWriteDataFile.mockResolvedValue(undefined);

    const newTopics = ['New Topic 1', 'New Topic 2'];
    const request = new Request('http://localhost/api/trending', {
      method: 'PUT',
      body: JSON.stringify(newTopics),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await PUT(request);
    const data = await res.json();

    expect(data).toEqual(newTopics);
    expect(mockWriteDataFile).toHaveBeenCalledWith('trending.json', newTopics);
  });

  it('returns 500 on error', async () => {
    const request = new Request('http://localhost/api/trending', {
      method: 'PUT',
      body: 'invalid json',
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await PUT(request);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('Failed to update trending');
  });
});
