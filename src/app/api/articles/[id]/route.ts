import { NextResponse } from 'next/server';
import { readDataFile, writeDataFile } from '@/lib/dataHelpers';
import { allArticles, Article } from '@/lib/articles';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const articles = await readDataFile<Article[]>('articles.json').catch(
      () => allArticles
    );
    const article = articles.find((a) => a.slug === id);
    if (!article) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const updates = await request.json();
    const articles = await readDataFile<Article[]>('articles.json').catch(
      () => [...allArticles]
    );
    const index = articles.findIndex((a) => a.slug === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    articles[index] = { ...articles[index], ...updates };
    await writeDataFile('articles.json', articles);
    return NextResponse.json(articles[index]);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const articles = await readDataFile<Article[]>('articles.json').catch(
      () => [...allArticles]
    );
    const filtered = articles.filter((a) => a.slug !== id);
    if (filtered.length === articles.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    await writeDataFile('articles.json', filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
