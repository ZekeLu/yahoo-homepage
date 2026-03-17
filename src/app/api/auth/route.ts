import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPass = process.env.ADMIN_PASS || 'admin123';
    if (username === adminUser && password === adminPass) {
      return NextResponse.json({ token: 'admin-session-token' });
    }
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
