/**
 * @jest-environment node
 */
import { POST, DELETE } from '@/app/api/auth/route';

describe('Auth API route', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('POST /api/auth (login)', () => {
    it('returns 200 and sets cookie with correct password', async () => {
      const request = new Request('http://localhost/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'yahoo2026' }),
      });

      const res = await POST(request);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);

      // Check that the Set-Cookie header is present
      const setCookie = res.headers.get('set-cookie');
      expect(setCookie).toBeTruthy();
      expect(setCookie).toContain('admin_authenticated');
    });

    it('returns 200 when using custom ADMIN_PASS env', async () => {
      process.env.ADMIN_PASS = 'custom_pass_123';

      const request = new Request('http://localhost/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'custom_pass_123' }),
      });

      const res = await POST(request);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
    });

    it('returns 401 with wrong password', async () => {
      const request = new Request('http://localhost/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'wrong-password' }),
      });

      const res = await POST(request);
      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data.error).toBe('Incorrect password');
    });

    it('returns 500 when request body is invalid', async () => {
      const request = new Request('http://localhost/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not-json',
      });

      const res = await POST(request);
      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.error).toBe('Server error');
    });
  });

  describe('DELETE /api/auth (logout)', () => {
    it('clears the auth cookie', async () => {
      const res = await DELETE();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);

      const setCookie = res.headers.get('set-cookie');
      expect(setCookie).toBeTruthy();
      expect(setCookie).toContain('admin_authenticated');
      // maxAge=0 clears the cookie
      expect(setCookie).toContain('Max-Age=0');
    });
  });
});
