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

import { GET, PUT } from '@/app/api/settings/route';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/settings', () => {
  it('returns settings from data file', async () => {
    const settings = { siteTitle: 'Yahoo!', siteDescription: 'News', heroArticleSlug: 'test' };
    mockReadDataFile.mockResolvedValue(settings);

    const res = await GET();
    const data = await res.json();

    expect(data).toEqual(settings);
    expect(mockReadDataFile).toHaveBeenCalledWith('settings.json');
  });

  it('returns defaults when readDataFile rejects', async () => {
    mockReadDataFile.mockRejectedValue(new Error('fail'));

    const res = await GET();
    const data = await res.json();

    expect(data).toHaveProperty('siteTitle');
  });

  it('returns defaults when outer catch triggers', async () => {
    mockReadDataFile.mockImplementationOnce(() => {
      throw new Error('sync error');
    });

    const res = await GET();
    const data = await res.json();

    expect(data).toHaveProperty('siteTitle');
  });
});

describe('PUT /api/settings', () => {
  it('updates settings and returns merged result', async () => {
    const current = { siteTitle: 'Yahoo!', siteDescription: 'News', heroArticleSlug: 'test' };
    mockReadDataFile.mockResolvedValue(current);
    mockWriteDataFile.mockResolvedValue(undefined);

    const request = new Request('http://localhost/api/settings', {
      method: 'PUT',
      body: JSON.stringify({ siteTitle: 'Updated Title' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await PUT(request);
    const data = await res.json();

    expect(data.siteTitle).toBe('Updated Title');
    expect(data.siteDescription).toBe('News');
    expect(mockWriteDataFile).toHaveBeenCalledWith('settings.json', expect.objectContaining({ siteTitle: 'Updated Title' }));
  });

  it('uses defaults when readDataFile rejects in PUT', async () => {
    mockReadDataFile.mockRejectedValue(new Error('fail'));
    mockWriteDataFile.mockResolvedValue(undefined);

    const request = new Request('http://localhost/api/settings', {
      method: 'PUT',
      body: JSON.stringify({ siteTitle: 'New' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await PUT(request);
    const data = await res.json();

    expect(data.siteTitle).toBe('New');
  });

  it('returns 500 on unexpected error', async () => {
    const request = new Request('http://localhost/api/settings', {
      method: 'PUT',
      body: 'invalid json',
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await PUT(request);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('Failed to update settings');
  });
});
