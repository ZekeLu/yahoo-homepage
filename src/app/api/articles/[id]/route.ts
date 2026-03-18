import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { readDataFile, writeDataFile } from '@/lib/dataHelpers';
import { allArticles, Article } from '@/lib/articles';
import { ArticleSchema } from '@/lib/validation';
import { sanitizeHtml } from '@/lib/sanitize';
import { withRateLimit } from '@/lib/apiRateLimit';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimited = await withRateLimit(_request);
  if (rateLimited) return rateLimited;

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
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimited = await withRateLimit(request);
  if (rateLimited) return rateLimited;

  const { id } = await params;
  try {
    const body = await request.json();
    const parsed = ArticleSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }
    const updates = { ...parsed.data };
    if (updates.content !== undefined) {
      updates.content = sanitizeHtml(updates.content);
    }
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
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimited = await withRateLimit(_request);
  if (rateLimited) return rateLimited;

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
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
