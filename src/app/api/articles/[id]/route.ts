import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const articlesPath = path.join(process.cwd(), "src/data/articles.json");

interface Article {
  id: number;
  slug: string;
  title: string;
  snippet: string;
  category: string;
  section: string;
  subcategory?: string;
  author: string;
  date: string;
  body: string[];
  tags: string[];
  isFeatured: boolean;
}

function getArticles(): Article[] {
  return JSON.parse(fs.readFileSync(articlesPath, "utf8"));
}

function saveArticles(articles: Article[]) {
  fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2));
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const articles = getArticles();
    const article = articles.find((a) => a.id === parseInt(params.id));
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ error: "Failed to read article" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const articles = getArticles();
    const index = articles.findIndex((a) => a.id === parseInt(params.id));
    if (index === -1) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    articles[index] = { ...articles[index], ...body, id: articles[index].id };
    saveArticles(articles);
    return NextResponse.json(articles[index]);
  } catch {
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const articles = getArticles();
    const index = articles.findIndex((a) => a.id === parseInt(params.id));
    if (index === -1) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    articles.splice(index, 1);
    saveArticles(articles);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
