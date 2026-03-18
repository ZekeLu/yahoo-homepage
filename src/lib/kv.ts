import { kv } from '@vercel/kv';
import { allArticles, type Article } from '@/lib/articles';
import trendingDefaults from '@/data/trending.json';
import settingsDefaults from '@/data/settings.json';
import subscribersDefaults from '@/data/subscribers.json';

const KV_PREFIX = 'yahoo_cms:';

function key(name: string): string {
  return `${KV_PREFIX}${name}`;
}

async function isKvAvailable(): Promise<boolean> {
  return !!(
    process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
  );
}

export async function kvGet<T>(name: string): Promise<T | null> {
  if (!(await isKvAvailable())) return null;
  try {
    return await kv.get<T>(key(name));
  } catch (err) {
    console.error(`KV get error for ${name}:`, err);
    return null;
  }
}

export async function kvSet<T>(name: string, value: T): Promise<void> {
  if (!(await isKvAvailable())) return;
  try {
    await kv.set(key(name), value);
  } catch (err) {
    console.error(`KV set error for ${name}:`, err);
  }
}

export async function kvSetWithTTL<T>(
  name: string,
  value: T,
  ttlSeconds: number
): Promise<void> {
  if (!(await isKvAvailable())) return;
  try {
    await kv.set(key(name), value, { ex: ttlSeconds });
  } catch (err) {
    console.error(`KV set error for ${name}:`, err);
  }
}

interface Subscriber {
  email: string;
  date: string;
}

interface Settings {
  siteTitle: string;
  siteDescription: string;
  heroArticleSlug: string;
}

const DEFAULTS: Record<string, unknown> = {
  articles: allArticles,
  trending: trendingDefaults,
  subscribers: subscribersDefaults,
  settings: settingsDefaults,
};

export async function kvGetOrSeed<T>(name: string): Promise<T> {
  const existing = await kvGet<T>(name);
  if (existing !== null) return existing;

  const fallback = DEFAULTS[name] as T;
  if (fallback !== undefined) {
    await kvSet(name, fallback);
  }
  return fallback as T;
}

export type { Article, Subscriber, Settings };
