import articlesData from "@/data/articles.json";

export interface Article {
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

export const allArticles: Article[] = articlesData as Article[];

export function getArticleBySlug(slug: string): Article | undefined {
  return allArticles.find((a) => a.slug === slug);
}

export function getArticlesBySection(section: string): Article[] {
  return allArticles.filter((a) => a.section === section);
}
