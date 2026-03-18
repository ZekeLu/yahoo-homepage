// Mock @vercel/kv so @/lib/kv can be imported
jest.mock('@vercel/kv', () => ({
  kv: { get: jest.fn(), set: jest.fn() },
}));

// Mock @/lib/kv before importing dataHelpers
const mockKvGetOrSeed = jest.fn();
const mockKvSet = jest.fn();
jest.mock('@/lib/kv', () => ({
  kvGetOrSeed: (...args: unknown[]) => mockKvGetOrSeed(...args),
  kvSet: (...args: unknown[]) => mockKvSet(...args),
}));

import { readDataFile, writeDataFile } from '@/lib/dataHelpers';

describe('dataHelpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readDataFile', () => {
    it('returns data from KV when available', async () => {
      const kvData = [{ slug: 'kv-article', title: 'From KV' }];
      mockKvGetOrSeed.mockResolvedValueOnce(kvData);

      const result = await readDataFile('articles.json');
      expect(result).toEqual(kvData);
      expect(mockKvGetOrSeed).toHaveBeenCalledWith('articles');
    });

    it('strips .json extension for the KV key', async () => {
      mockKvGetOrSeed.mockResolvedValueOnce({ key: 'value' });

      await readDataFile('settings.json');
      expect(mockKvGetOrSeed).toHaveBeenCalledWith('settings');
    });

    it('handles filename without .json extension', async () => {
      mockKvGetOrSeed.mockResolvedValueOnce({ key: 'value' });

      await readDataFile('trending');
      expect(mockKvGetOrSeed).toHaveBeenCalledWith('trending');
    });

    it('falls back to reading from filesystem when KV returns null/undefined', async () => {
      mockKvGetOrSeed.mockResolvedValueOnce(null);

      // This will try to read from the file system, which should either
      // succeed (if the file exists) or throw
      await expect(readDataFile('nonexistent.json')).rejects.toThrow();
    });
  });

  describe('writeDataFile', () => {
    it('calls kvSet with stripped key and data', async () => {
      mockKvSet.mockResolvedValueOnce(undefined);

      const data = [{ slug: 'test', title: 'Test' }];
      await writeDataFile('articles.json', data);

      expect(mockKvSet).toHaveBeenCalledWith('articles', data);
    });

    it('passes data directly to kvSet', async () => {
      mockKvSet.mockResolvedValueOnce(undefined);

      const settings = { siteTitle: 'Yahoo' };
      await writeDataFile('settings.json', settings);

      expect(mockKvSet).toHaveBeenCalledWith('settings', settings);
    });
  });
});
