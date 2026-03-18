import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

function isKvConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

let generalLimiter: Ratelimit | null = null;
let authLimiter: Ratelimit | null = null;

function getGeneralLimiter(): Ratelimit | null {
  if (!isKvConfigured()) return null;
  if (!generalLimiter) {
    generalLimiter = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(30, '60 s'),
      prefix: 'ratelimit:general',
    });
  }
  return generalLimiter;
}

function getAuthLimiter(): Ratelimit | null {
  if (!isKvConfigured()) return null;
  if (!authLimiter) {
    authLimiter = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(5, '60 s'),
      prefix: 'ratelimit:auth',
    });
  }
  return authLimiter;
}

export interface RateLimitResult {
  limited: boolean;
  retryAfter?: number;
}

export async function checkRateLimit(
  ip: string,
  type: 'general' | 'auth' = 'general'
): Promise<RateLimitResult> {
  try {
    const limiter = type === 'auth' ? getAuthLimiter() : getGeneralLimiter();
    if (!limiter) {
      return { limited: false };
    }

    const result = await limiter.limit(ip);
    if (!result.success) {
      return {
        limited: true,
        retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
      };
    }

    return { limited: false };
  } catch (error) {
    console.error('Rate limiting error, gracefully degrading:', error);
    return { limited: false };
  }
}
