import type { Metadata } from 'next';
import { getArticleBySlug, allArticles } from '@/lib/articles';
import ArticleContent from './ArticleContent';
import { JsonLd } from '@/components/JsonLd';

const SITE_URL = 'https://yahoo-homepage.vercel.app';

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
    alternates: {
      canonical: `/article/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.snippet,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
      url: `${SITE_URL}/article/${article.slug}`,
      images: [
        {
          url: article.imageUrl,
          width: 800,
          height: 450,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.snippet,
      images: [article.imageUrl],
    },
  };
}

export async function generateStaticParams() {
  return allArticles.map((article) => ({ slug: article.slug }));
}

export default function ArticlePage({ params }: PageProps) {
  const article = getArticleBySlug(params.slug);

  const articleSchema = article
    ? {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: article.title,
        description: article.snippet,
        image: article.imageUrl,
        datePublished: article.date,
        author: {
          '@type': 'Person',
          name: article.author,
        },
        publisher: {
          '@type': 'NewsMediaOrganization',
          name: 'Yahoo! Portal',
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/logo.png`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${SITE_URL}/article/${article.slug}`,
        },
      }
    : null;

  return (
    <>
      {articleSchema && <JsonLd data={articleSchema} />}
      <ArticleContent />
    </>
  );
}
