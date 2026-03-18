import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { readDataFile, writeDataFile } from '@/lib/dataHelpers';
import trendingDefaults from '@/data/trending.json';
import { TrendingTopicsArraySchema } from '@/lib/validation';
import { withRateLimit } from '@/lib/apiRateLimit';

export async function GET(request: Request) {
  const rateLimited = await withRateLimit(request);
  if (rateLimited) return rateLimited;

  try {
    const trending = await readDataFile<string[]>('trending.json').catch(
      () => trendingDefaults as string[]
    );
    return NextResponse.json(trending);
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(trendingDefaults);
  }
}

export async function PUT(request: Request) {
  const rateLimited = await withRateLimit(request);
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    const parsed = TrendingTopicsArraySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }
    await writeDataFile('trending.json', parsed.data);
    return NextResponse.json(parsed.data);
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { error: 'Failed to update trending' },
      { status: 500 }
    );
  }
}
