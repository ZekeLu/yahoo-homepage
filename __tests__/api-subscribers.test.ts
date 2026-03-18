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

import { GET, POST, DELETE } from '@/app/api/subscribers/route';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/subscribers', () => {
  it('returns subscribers list', async () => {
    const subscribers = [{ email: 'test@test.com', date: '2026-01-01' }];
    mockReadDataFile.mockResolvedValue(subscribers);

    const res = await GET();
    const data = await res.json();

    expect(data).toEqual(subscribers);
    expect(mockReadDataFile).toHaveBeenCalledWith('subscribers.json');
  });

  it('returns empty array when readDataFile rejects', async () => {
    mockReadDataFile.mockRejectedValue(new Error('fail'));

    const res = await GET();
    const data = await res.json();

    expect(data).toEqual([]);
  });

  it('returns empty array when outer catch triggers', async () => {
    mockReadDataFile.mockImplementationOnce(() => {
      throw new Error('sync error');
    });

    const res = await GET();
    const data = await res.json();

    expect(data).toEqual([]);
  });
});

describe('POST /api/subscribers', () => {
  it('adds new subscriber', async () => {
    mockReadDataFile.mockResolvedValue([]);
    mockWriteDataFile.mockResolvedValue(undefined);

    const request = new Request('http://localhost/api/subscribers', {
      method: 'POST',
      body: JSON.stringify({ email: 'new@test.com' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(request);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);

    expect(mockWriteDataFile).toHaveBeenCalledWith(
      'subscribers.json',
      expect.arrayContaining([
        expect.objectContaining({ email: 'new@test.com' }),
      ])
    );
  });

  it('returns 400 when email is missing', async () => {
    const request = new Request('http://localhost/api/subscribers', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(request);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Email required');
  });

  it('returns 500 on unexpected error', async () => {
    const request = new Request('http://localhost/api/subscribers', {
      method: 'POST',
      body: 'invalid json',
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(request);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('Failed to subscribe');
  });

  it('uses empty array fallback when readDataFile rejects in POST', async () => {
    mockReadDataFile.mockRejectedValue(new Error('no file'));
    mockWriteDataFile.mockResolvedValue(undefined);

    const request = new Request('http://localhost/api/subscribers', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(request);
    expect(res.status).toBe(201);
  });
});

describe('DELETE /api/subscribers', () => {
  it('removes subscriber by email', async () => {
    const subscribers = [
      { email: 'keep@test.com', date: '2026-01-01' },
      { email: 'remove@test.com', date: '2026-01-02' },
    ];
    mockReadDataFile.mockResolvedValue(subscribers);
    mockWriteDataFile.mockResolvedValue(undefined);

    const request = new Request('http://localhost/api/subscribers', {
      method: 'DELETE',
      body: JSON.stringify({ email: 'remove@test.com' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await DELETE(request);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(mockWriteDataFile).toHaveBeenCalledWith(
      'subscribers.json',
      [{ email: 'keep@test.com', date: '2026-01-01' }]
    );
  });

  it('returns 500 on error in DELETE', async () => {
    const request = new Request('http://localhost/api/subscribers', {
      method: 'DELETE',
      body: 'invalid json',
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await DELETE(request);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('Failed to delete');
  });

  it('uses empty array fallback when readDataFile rejects in DELETE', async () => {
    mockReadDataFile.mockRejectedValue(new Error('no file'));
    mockWriteDataFile.mockResolvedValue(undefined);

    const request = new Request('http://localhost/api/subscribers', {
      method: 'DELETE',
      body: JSON.stringify({ email: 'test@example.com' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await DELETE(request);
    const data = await res.json();
    expect(data.success).toBe(true);
  });
});
