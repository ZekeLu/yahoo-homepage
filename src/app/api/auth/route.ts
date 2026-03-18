import { NextResponse } from 'next/server';

export async function POST(request: Request) {
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
  } catch {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_authenticated', '', {
    path: '/admin',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 0,
  });
  return response;
}
