import { NextResponse } from 'next/server';
import { readDataFile, writeDataFile } from '@/lib/dataHelpers';
import settingsDefaults from '@/data/settings.json';

interface Settings {
  siteTitle: string;
  siteDescription: string;
  heroArticleSlug: string;
}

export async function GET() {
  try {
    const settings = await readDataFile<Settings>('settings.json').catch(
      () => settingsDefaults as Settings
    );
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(settingsDefaults);
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const current = await readDataFile<Settings>('settings.json').catch(
      () => settingsDefaults as Settings
    );
    const updated = { ...current, ...data };
    await writeDataFile('settings.json', updated);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
