import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { readDataFile, writeDataFile } from '@/lib/dataHelpers';
import { allArticles, Article } from '@/lib/articles';
import { ArticleSchema } from '@/lib/validation';
import { sanitizeHtml } from '@/lib/sanitize';
import { withRateLimit } from '@/lib/apiRateLimit';

export async function GET(request: Request) {
  const rateLimited = await withRateLimit(request);
  if (rateLimited) return rateLimited;

  try {
    const articles = await readDataFile<Article[]>('articles.json').catch(
      () => allArticles
    );

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '0', 10);
    const limit = parseInt(searchParams.get('limit') ?? '0', 10);

    // If pagination params are provided, return paginated results
    if (page > 0 && limit > 0) {
      const start = (page - 1) * limit;
      const paginated = articles.slice(start, start + limit);
      return NextResponse.json({
        articles: paginated,
        page,
        limit,
        total: articles.length,
        hasMore: start + limit < articles.length,
      });
    }

    return NextResponse.json(articles);
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(allArticles);
  }
}

export async function POST(request: Request) {
  const rateLimited = await withRateLimit(request);
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    const parsed = ArticleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }
    const newArticle = {
      ...parsed.data,
      ...(parsed.data.content !== undefined && {
        content: sanitizeHtml(parsed.data.content),
      }),
    };
    const articles = await readDataFile<Article[]>('articles.json').catch(
      () => [...allArticles]
    );
    articles.push(newArticle as unknown as Article);
    await writeDataFile('articles.json', articles);
    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}
