import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const articlesPath = path.join(process.cwd(), "src/data/articles.json");

function getArticles() {
  return JSON.parse(fs.readFileSync(articlesPath, "utf8"));
}

function saveArticles(articles: Record<string, unknown>[]) {
  fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2));
}

export async function GET() {
  try {
    const articles = getArticles();
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json({ error: "Failed to read articles" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const articles = getArticles();
    const maxId = articles.reduce((max: number, a: { id: number }) => Math.max(max, a.id), 0);
    const newArticle = {
      id: maxId + 1,
      slug: body.slug || "",
      title: body.title || "",
      snippet: body.snippet || "",
      category: body.category || "",
      section: body.section || "",
      subcategory: body.subcategory || "",
      author: body.author || "",
      date: body.date || "",
      body: body.body || [],
      tags: body.tags || [],
      isFeatured: body.isFeatured || false,
    };
    articles.push(newArticle);
    saveArticles(articles);
    return NextResponse.json(newArticle, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
