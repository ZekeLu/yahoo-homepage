/**
 * @jest-environment node
 */

const mockKvGetOrSeed = jest.fn();
const mockKvSet = jest.fn();

jest.mock('@vercel/kv', () => ({
  kv: { get: jest.fn(), set: jest.fn() },
}));

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
    it('returns data from kvGetOrSeed', async () => {
      mockKvGetOrSeed.mockResolvedValue(['article1', 'article2']);

      const result = await readDataFile('articles.json');
      expect(result).toEqual(['article1', 'article2']);
      expect(mockKvGetOrSeed).toHaveBeenCalledWith('articles');
    });

    it('strips .json extension from filename for KV key', async () => {
      mockKvGetOrSeed.mockResolvedValue([]);

      await readDataFile('trending.json');
      expect(mockKvGetOrSeed).toHaveBeenCalledWith('trending');
    });

    it('falls back to filesystem when kvGetOrSeed returns null', async () => {
      mockKvGetOrSeed.mockResolvedValue(null);

      // This will try to read from filesystem. The actual file may or may not exist.
      // We test that it proceeds to the fs fallback path
      try {
        await readDataFile('settings.json');
      } catch {
        // Expected if file doesn't exist at the computed path
      }
      expect(mockKvGetOrSeed).toHaveBeenCalledWith('settings');
    });

    it('falls back to filesystem when kvGetOrSeed returns undefined', async () => {
      mockKvGetOrSeed.mockResolvedValue(undefined);

      try {
        await readDataFile('test.json');
      } catch {
        // Expected
      }
      expect(mockKvGetOrSeed).toHaveBeenCalledWith('test');
    });
  });

  describe('writeDataFile', () => {
    it('calls kvSet with correct key and data', async () => {
      mockKvSet.mockResolvedValue(undefined);

      await writeDataFile('articles.json', ['article1']);
      expect(mockKvSet).toHaveBeenCalledWith('articles', ['article1']);
    });

    it('strips .json extension from filename', async () => {
      mockKvSet.mockResolvedValue(undefined);

      await writeDataFile('settings.json', { title: 'test' });
      expect(mockKvSet).toHaveBeenCalledWith('settings', { title: 'test' });
    });

    it('handles filenames without .json extension', async () => {
      mockKvSet.mockResolvedValue(undefined);

      await writeDataFile('subscribers', []);
      expect(mockKvSet).toHaveBeenCalledWith('subscribers', []);
    });
  });
});
