import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/ratelimit';

export async function withRateLimit(
  request: Request,
  type: 'general' | 'auth' = 'general'
): Promise<NextResponse | null> {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      '127.0.0.1';

    const result = await checkRateLimit(ip, type);

    if (result.limited) {
      return NextResponse.json(
        { error: 'Too many requests', retryAfter: result.retryAfter },
        { status: 429 }
      );
    }
  } catch {
    // Gracefully degrade if rate limiting is unavailable
  }
  return null;
}
