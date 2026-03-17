'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug } from '@/lib/articles';

export default function ArticlePage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Article not found
          </h1>
          <Link
            href="/"
            className="mt-4 inline-block text-yahoo-purple hover:underline"
          >
            &larr; Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-yahoo-purple text-white">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <Link
            href="/"
            className="text-sm font-medium hover:text-purple-200 transition-colors"
          >
            &larr; Back to Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <article>
          <span className="inline-block rounded bg-yahoo-purple px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {article.category}
          </span>

          <h1 className="mt-4 text-3xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl">
            {article.title}
          </h1>

          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>By {article.author}</span>
            <span>&middot;</span>
            <time>{article.date}</time>
          </div>

          <div className="mt-8 space-y-5 text-base leading-relaxed text-gray-700 dark:text-gray-300">
            {article.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </article>

        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-6">
          <Link
            href="/"
            className="text-yahoo-purple font-medium hover:underline"
          >
            &larr; Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
