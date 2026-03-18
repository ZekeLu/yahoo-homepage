/**
 * @jest-environment node
 */

import { GET } from '@/app/api/health/route';

describe('Health API route', () => {
  it('returns status ok with expected fields', async () => {
    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.status).toBe('ok');
    expect(data).toHaveProperty('version');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('env');
    expect(typeof data.timestamp).toBe('string');
  });

  it('returns a valid ISO timestamp', async () => {
    const res = await GET();
    const data = await res.json();

    const parsed = new Date(data.timestamp);
    expect(parsed.toISOString()).toBe(data.timestamp);
  });

  it('includes the current NODE_ENV', async () => {
    const res = await GET();
    const data = await res.json();

    expect(data.env).toBe(process.env.NODE_ENV);
  });
});
