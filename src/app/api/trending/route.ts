import { NextResponse } from 'next/server';
import { readDataFile, writeDataFile } from '@/lib/dataHelpers';
import trendingDefaults from '@/data/trending.json';

export async function GET() {
  try {
    const trending = await readDataFile<string[]>('trending.json').catch(
      () => trendingDefaults as string[]
    );
    return NextResponse.json(trending);
  } catch {
    return NextResponse.json(trendingDefaults);
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    await writeDataFile('trending.json', data);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Failed to update trending' },
      { status: 500 }
    );
  }
}
