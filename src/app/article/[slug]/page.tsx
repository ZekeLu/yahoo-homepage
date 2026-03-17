'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getArticleBySlug, allArticles } from '@/lib/articles';

function calculateReadingTime(body: string[]): number {
  const wordCount = body.join(' ').split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export default function ArticlePage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
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
        <Footer />
      </div>
    );
  }

  const readingTime = calculateReadingTime(article.body);
  const relatedArticles = allArticles
    .filter((a) => a.section === article.section && a.slug !== article.slug)
    .slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        {/* Hero image */}
        <div className="relative h-64 w-full overflow-hidden sm:h-80 md:h-96">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <article className="mx-auto max-w-3xl px-4 py-8">
          {/* Category badge */}
          <span className="inline-block rounded bg-yahoo-purple px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {article.category}
          </span>

          {/* Title */}
          <h1 className="mt-4 text-3xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl">
            {article.title}
          </h1>

          {/* Author + date + reading time */}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
            <span>By {article.author}</span>
            <span>&middot;</span>
            <time>{article.date}</time>
            <span>&middot;</span>
            <span>{readingTime} min read</span>
          </div>

          {/* Body paragraphs */}
          <div className="mt-8 space-y-5 text-base leading-relaxed text-gray-700 dark:text-gray-300">
            {article.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </article>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <section className="mx-auto max-w-3xl px-4 pb-12">
            <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
              Related Articles
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {relatedArticles.map((related) => (
                <Link
                  key={related.slug}
                  href={`/article/${related.slug}`}
                  className="group block overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={related.imageUrl}
                      alt={related.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <span className="text-xs font-semibold uppercase text-yahoo-purple">
                      {related.category}
                    </span>
                    <h3 className="mt-1 text-sm font-semibold text-gray-900 group-hover:underline dark:text-white">
                      {related.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to home */}
        <div className="mx-auto max-w-3xl border-t border-gray-200 px-4 py-6 dark:border-gray-700">
          <Link
            href="/"
            className="font-medium text-yahoo-purple hover:underline"
          >
            &larr; Back to Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
