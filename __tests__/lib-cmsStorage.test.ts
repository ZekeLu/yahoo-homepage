import { cmsGet, cmsSet, cmsRemove, cmsGetOrSeed } from '@/lib/cmsStorage';

const mockedFetch = global.fetch as jest.Mock;

describe('cmsStorage', () => {
  let getItemSpy: jest.SpyInstance;
  let setItemSpy: jest.SpyInstance;
  let removeItemSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
    removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('cmsGet', () => {
    it('returns parsed value from localStorage', () => {
      getItemSpy.mockReturnValue('{"name":"test"}');
      const result = cmsGet<{ name: string }>('mykey');
      expect(result).toEqual({ name: 'test' });
      expect(getItemSpy).toHaveBeenCalledWith('yahoo_cms_mykey');
    });

    it('returns null when item does not exist', () => {
      getItemSpy.mockReturnValue(null);
      const result = cmsGet('missing');
      expect(result).toBeNull();
    });

    it('returns null when JSON parse fails', () => {
      getItemSpy.mockReturnValue('invalid json {{{');
      const result = cmsGet('bad');
      expect(result).toBeNull();
    });
  });

  describe('cmsSet', () => {
    it('stores stringified value in localStorage', () => {
      cmsSet('mykey', { name: 'test' });
      expect(setItemSpy).toHaveBeenCalledWith('yahoo_cms_mykey', '{"name":"test"}');
    });

    it('handles storage errors silently', () => {
      setItemSpy.mockImplementation(() => {
        throw new Error('QuotaExceeded');
      });
      // Should not throw
      expect(() => cmsSet('key', 'value')).not.toThrow();
    });
  });

  describe('cmsRemove', () => {
    it('removes item from localStorage', () => {
      cmsRemove('mykey');
      expect(removeItemSpy).toHaveBeenCalledWith('yahoo_cms_mykey');
    });
  });

  describe('cmsGetOrSeed', () => {
    it('returns cached value if available', async () => {
      getItemSpy.mockReturnValue('"cached"');
      const result = await cmsGetOrSeed<string>('key', '/api/test');
      expect(result).toBe('cached');
      expect(mockedFetch).not.toHaveBeenCalled();
    });

    it('fetches from API and caches when no cached value', async () => {
      getItemSpy.mockReturnValue(null);
      mockedFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ data: 'fresh' }),
      });

      const result = await cmsGetOrSeed<{ data: string }>('key', '/api/test');
      expect(result).toEqual({ data: 'fresh' });
      expect(mockedFetch).toHaveBeenCalledWith('/api/test');
      expect(setItemSpy).toHaveBeenCalledWith('yahoo_cms_key', '{"data":"fresh"}');
    });
  });
});
