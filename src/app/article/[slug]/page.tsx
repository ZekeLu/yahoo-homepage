import type { Metadata } from 'next';
import { getArticleBySlug, allArticles } from '@/lib/articles';
import ArticleContent from './ArticleContent';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  if (!article) {
    return { title: 'Article Not Found | Yahoo! Portal' };
  }
  return {
    title: `${article.title} | Yahoo! Portal`,
    description: article.snippet,
    openGraph: {
      title: article.title,
      description: article.snippet,
      type: 'article',
      publishedTime: article.date,
    },
  };
}

export async function generateStaticParams() {
  return allArticles.map((article) => ({ slug: article.slug }));
}

export default function ArticlePage() {
  return <ArticleContent />;
}
