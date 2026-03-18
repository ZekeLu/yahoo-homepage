/**
 * @jest-environment node
 */

const mockKvGet = jest.fn();
const mockKvSet = jest.fn();

jest.mock('@vercel/kv', () => ({
  kv: {
    get: (...args: unknown[]) => mockKvGet(...args),
    set: (...args: unknown[]) => mockKvSet(...args),
  },
}));

import { kvGet, kvSet, kvSetWithTTL, kvGetOrSeed } from '@/lib/kv';

describe('kv module', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('kvGet', () => {
    it('returns null when KV is not available', async () => {
      delete process.env.KV_REST_API_URL;
      delete process.env.KV_REST_API_TOKEN;
      const result = await kvGet('test');
      expect(result).toBeNull();
      expect(mockKvGet).not.toHaveBeenCalled();
    });

    it('returns value from KV when available', async () => {
      process.env.KV_REST_API_URL = 'https://kv.test';
      process.env.KV_REST_API_TOKEN = 'token123';
      mockKvGet.mockResolvedValue({ data: 'test' });

      const result = await kvGet('mykey');
      expect(result).toEqual({ data: 'test' });
      expect(mockKvGet).toHaveBeenCalledWith('yahoo_cms:mykey');
    });

    it('returns null on KV error', async () => {
      process.env.KV_REST_API_URL = 'https://kv.test';
      process.env.KV_REST_API_TOKEN = 'token123';
      mockKvGet.mockRejectedValue(new Error('KV error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const result = await kvGet('mykey');
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('KV get error for mykey:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('kvSet', () => {
    it('does nothing when KV is not available', async () => {
      delete process.env.KV_REST_API_URL;
      delete process.env.KV_REST_API_TOKEN;
      await kvSet('key', 'value');
      expect(mockKvSet).not.toHaveBeenCalled();
    });

    it('sets value in KV when available', async () => {
      process.env.KV_REST_API_URL = 'https://kv.test';
      process.env.KV_REST_API_TOKEN = 'token123';
      mockKvSet.mockResolvedValue(undefined);

      await kvSet('mykey', 'myvalue');
      expect(mockKvSet).toHaveBeenCalledWith('yahoo_cms:mykey', 'myvalue');
    });

    it('handles KV set error', async () => {
      process.env.KV_REST_API_URL = 'https://kv.test';
      process.env.KV_REST_API_TOKEN = 'token123';
      mockKvSet.mockRejectedValue(new Error('KV set error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      await kvSet('mykey', 'value');
      expect(consoleSpy).toHaveBeenCalledWith('KV set error for mykey:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('kvSetWithTTL', () => {
    it('does nothing when KV is not available', async () => {
      delete process.env.KV_REST_API_URL;
      delete process.env.KV_REST_API_TOKEN;
      await kvSetWithTTL('key', 'value', 60);
      expect(mockKvSet).not.toHaveBeenCalled();
    });

    it('sets value with TTL in KV when available', async () => {
      process.env.KV_REST_API_URL = 'https://kv.test';
      process.env.KV_REST_API_TOKEN = 'token123';
      mockKvSet.mockResolvedValue(undefined);

      await kvSetWithTTL('mykey', 'myvalue', 300);
      expect(mockKvSet).toHaveBeenCalledWith('yahoo_cms:mykey', 'myvalue', { ex: 300 });
    });

    it('handles KV setWithTTL error', async () => {
      process.env.KV_REST_API_URL = 'https://kv.test';
      process.env.KV_REST_API_TOKEN = 'token123';
      mockKvSet.mockRejectedValue(new Error('KV error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      await kvSetWithTTL('mykey', 'value', 60);
      expect(consoleSpy).toHaveBeenCalledWith('KV set error for mykey:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('kvGetOrSeed', () => {
    it('returns existing value from KV', async () => {
      process.env.KV_REST_API_URL = 'https://kv.test';
      process.env.KV_REST_API_TOKEN = 'token123';
      mockKvGet.mockResolvedValue(['Topic 1']);

      const result = await kvGetOrSeed<string[]>('trending');
      expect(result).toEqual(['Topic 1']);
    });

    it('seeds defaults when no existing value for known key', async () => {
      process.env.KV_REST_API_URL = 'https://kv.test';
      process.env.KV_REST_API_TOKEN = 'token123';
      mockKvGet.mockResolvedValue(null);
      mockKvSet.mockResolvedValue(undefined);

      const result = await kvGetOrSeed<string[]>('trending');
      expect(Array.isArray(result)).toBe(true);
      expect(mockKvSet).toHaveBeenCalled();
    });

    it('returns fallback for known keys', async () => {
      // When KV not available, kvGet returns null
      delete process.env.KV_REST_API_URL;
      delete process.env.KV_REST_API_TOKEN;

      const result = await kvGetOrSeed<string[]>('trending');
      expect(Array.isArray(result)).toBe(true);
    });

    it('returns undefined for unknown keys', async () => {
      delete process.env.KV_REST_API_URL;
      delete process.env.KV_REST_API_TOKEN;

      const result = await kvGetOrSeed('unknownkey');
      expect(result).toBeUndefined();
    });

    it('seeds articles default', async () => {
      delete process.env.KV_REST_API_URL;
      const result = await kvGetOrSeed('articles');
      expect(Array.isArray(result)).toBe(true);
    });

    it('seeds settings default', async () => {
      delete process.env.KV_REST_API_URL;
      const result = await kvGetOrSeed('settings');
      expect(result).toHaveProperty('siteTitle');
    });

    it('seeds subscribers default', async () => {
      delete process.env.KV_REST_API_URL;
      const result = await kvGetOrSeed('subscribers');
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
