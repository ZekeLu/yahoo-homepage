import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { readDataFile, writeDataFile } from '@/lib/dataHelpers';
import settingsDefaults from '@/data/settings.json';
import { SettingsSchema } from '@/lib/validation';
import { withRateLimit } from '@/lib/apiRateLimit';

interface Settings {
  siteTitle: string;
  siteDescription: string;
  heroArticleSlug: string;
}

export async function GET(request: Request) {
  const rateLimited = await withRateLimit(request);
  if (rateLimited) return rateLimited;

  try {
    const settings = await readDataFile<Settings>('settings.json').catch(
      () => settingsDefaults as Settings
    );
    return NextResponse.json(settings);
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(settingsDefaults);
  }
}

export async function PUT(request: Request) {
  const rateLimited = await withRateLimit(request);
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    const parsed = SettingsSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }
    const current = await readDataFile<Settings>('settings.json').catch(
      () => settingsDefaults as Settings
    );
    const updated = { ...current, ...parsed.data };
    await writeDataFile('settings.json', updated);
    return NextResponse.json(updated);
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
