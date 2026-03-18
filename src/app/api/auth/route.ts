import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { withRateLimit } from '@/lib/apiRateLimit';

export async function POST(request: Request) {
  const rateLimited = await withRateLimit(request, 'auth');
  if (rateLimited) return rateLimited;

  try {
    const { password } = await request.json();
    const adminPass = process.env.ADMIN_PASS || 'yahoo2026';
    if (password === adminPass) {
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_authenticated', 'true', {
        path: '/admin',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });
      return response;
    }
    return NextResponse.json(
      { error: 'Incorrect password' },
      { status: 401 }
    );
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const rateLimited = await withRateLimit(request, 'auth');
  if (rateLimited) return rateLimited;

  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_authenticated', '', {
    path: '/admin',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 0,
  });
  return response;
}
