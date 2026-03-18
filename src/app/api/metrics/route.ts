import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface Article {
  id: number;
  title: string;
}

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'src', 'data');

    const [articlesRaw, subscribersRaw] = await Promise.all([
      fs.readFile(path.join(dataDir, 'articles.json'), 'utf-8'),
      fs.readFile(path.join(dataDir, 'subscribers.json'), 'utf-8'),
    ]);

    const articles: Article[] = JSON.parse(articlesRaw);
    const subscribers: unknown[] = JSON.parse(subscribersRaw);

    return NextResponse.json({
      articleCount: articles.length,
      subscriberCount: subscribers.length,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to retrieve metrics' },
      { status: 500 },
    );
  }
}
