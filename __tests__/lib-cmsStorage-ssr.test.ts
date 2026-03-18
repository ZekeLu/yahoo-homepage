/**
 * @jest-environment node
 */
import { cmsGet, cmsSet, cmsRemove } from '@/lib/cmsStorage';

describe('cmsStorage SSR (node environment)', () => {
  it('cmsGet returns null when window is undefined', () => {
    expect(typeof window).toBe('undefined');
    expect(cmsGet('key')).toBeNull();
  });

  it('cmsSet does nothing when window is undefined', () => {
    expect(typeof window).toBe('undefined');
    expect(() => cmsSet('key', 'value')).not.toThrow();
  });

  it('cmsRemove does nothing when window is undefined', () => {
    expect(typeof window).toBe('undefined');
    expect(() => cmsRemove('key')).not.toThrow();
  });
});
