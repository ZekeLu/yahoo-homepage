import { NextResponse } from 'next/server';
import { readDataFile, writeDataFile } from '@/lib/dataHelpers';
import { allArticles, Article } from '@/lib/articles';

export async function GET() {
  try {
    const articles = await readDataFile<Article[]>('articles.json').catch(
      () => allArticles
    );
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json(allArticles);
  }
}

export async function POST(request: Request) {
  try {
    const newArticle = await request.json();
    const articles = await readDataFile<Article[]>('articles.json').catch(
      () => [...allArticles]
    );
    articles.push(newArticle);
    await writeDataFile('articles.json', articles);
    return NextResponse.json(newArticle, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}
