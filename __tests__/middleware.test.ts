/**
 * @jest-environment node
 */
import { middleware } from '@/middleware';
import { NextRequest } from 'next/server';

function createMockRequest(
  url: string,
  cookies: Record<string, string> = {}
): NextRequest {
  const req = new NextRequest(new URL(url, 'http://localhost:3000'));
  for (const [name, value] of Object.entries(cookies)) {
    req.cookies.set(name, value);
  }
  return req;
}

describe('Middleware', () => {
  it('redirects unauthenticated users from /admin/dashboard to /admin/login', () => {
    const req = createMockRequest('/admin/dashboard');
    const res = middleware(req);

    expect(res.status).toBe(307); // redirect status
    const location = res.headers.get('location');
    expect(location).toContain('/admin/login');
  });

  it('redirects unauthenticated users from /admin/settings to /admin/login', () => {
    const req = createMockRequest('/admin/settings');
    const res = middleware(req);

    expect(res.status).toBe(307);
    const location = res.headers.get('location');
    expect(location).toContain('/admin/login');
  });

  it('allows authenticated users to access /admin/dashboard', () => {
    const req = createMockRequest('/admin/dashboard', {
      admin_authenticated: 'true',
    });
    const res = middleware(req);

    // Should not redirect (status 200)
    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
  });

  it('does not redirect /admin/login itself', () => {
    const req = createMockRequest('/admin/login');
    const res = middleware(req);

    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
  });

  it('does not redirect API routes under /api/', () => {
    const req = createMockRequest('/api/articles');
    const res = middleware(req);

    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
  });

  it('redirects when cookie value is not "true"', () => {
    const req = createMockRequest('/admin/dashboard', {
      admin_authenticated: 'false',
    });
    const res = middleware(req);

    expect(res.status).toBe(307);
    const location = res.headers.get('location');
    expect(location).toContain('/admin/login');
  });
});
