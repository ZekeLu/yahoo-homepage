/**
 * @jest-environment node
 */

// Mock @vercel/kv so @/lib/kv can be imported
jest.mock('@vercel/kv', () => ({
  kv: { get: jest.fn(), set: jest.fn() },
}));

// Mock @/lib/kv
const mockKvGet = jest.fn();
const mockKvSetWithTTL = jest.fn();
jest.mock('@/lib/kv', () => ({
  kvGet: (...args: unknown[]) => mockKvGet(...args),
  kvSetWithTTL: (...args: unknown[]) => mockKvSetWithTTL(...args),
}));

import { GET } from '@/app/api/stocks/route';

const originalFetch = global.fetch;

describe('Stocks API route', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    mockKvGet.mockResolvedValue(null);
    mockKvSetWithTTL.mockResolvedValue(undefined);
    global.fetch = jest.fn();
  });

  afterAll(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
  });

  it('returns cached data from KV when available', async () => {
    const cachedStocks = [
      { symbol: 'AAPL', price: 200.0, change: 5.0, changePercent: 2.5 },
    ];
    mockKvGet.mockResolvedValueOnce(cachedStocks);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual(cachedStocks);
    expect(mockKvGet).toHaveBeenCalledWith('stocks_cache');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns fallback data when no API key is set', async () => {
    delete process.env.FINNHUB_API_KEY;

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(8);
    expect(data[0]).toHaveProperty('symbol');
    expect(data[0]).toHaveProperty('price');
    expect(data[0]).toHaveProperty('change');
    expect(data[0]).toHaveProperty('changePercent');
  });

  it('fetches from Finnhub and caches when API key is set', async () => {
    process.env.FINNHUB_API_KEY = 'test-api-key';

    const mockQuote = { c: 200.5, d: 3.25, dp: 1.65, h: 201, l: 198, o: 199, pc: 197.25 };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockQuote),
    });

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(8);
    expect(data[0].price).toBe(200.5);
    expect(data[0].change).toBe(3.25);
    expect(data[0].changePercent).toBe(1.65);

    expect(mockKvSetWithTTL).toHaveBeenCalledWith('stocks_cache', expect.any(Array), 300);
  });

  it('falls back to static data when Finnhub returns error', async () => {
    process.env.FINNHUB_API_KEY = 'test-api-key';

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    });

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(8);
    expect(data[0].symbol).toBe('AAPL');
  });

  it('falls back when fetch throws an error', async () => {
    process.env.FINNHUB_API_KEY = 'test-api-key';

    (global.fetch as jest.Mock).mockRejectedValue(new Error('network error'));

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data[0].symbol).toBe('AAPL');
    expect(data[0].price).toBe(198.45);
  });

  it('returns fallback when outer catch triggers', async () => {
    // Force kvGet to throw synchronously to trigger the outer catch
    mockKvGet.mockImplementationOnce(() => {
      throw new Error('sync kv error');
    });

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(8);
  });

  it('falls back when Finnhub returns zero price', async () => {
    process.env.FINNHUB_API_KEY = 'test-api-key';

    const zeroQuote = { c: 0, d: 0, dp: 0, h: 0, l: 0, o: 0, pc: 0 };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(zeroQuote),
    });

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data[0].symbol).toBe('AAPL');
    expect(data[0].price).toBe(198.45);
  });
});
