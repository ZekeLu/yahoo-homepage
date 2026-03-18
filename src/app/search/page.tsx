'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import { type Article } from '@/lib/articles';
import { useCmsArticles } from '@/hooks/useCmsData';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { articles } = useCmsArticles();

  const results = query.trim()
    ? articles.filter((article: Article) => {
        const q = query.toLowerCase();
        return (
          article.title.toLowerCase().includes(q) ||
          article.snippet.toLowerCase().includes(q) ||
          article.body.some((p: string) => p.toLowerCase().includes(q))
        );
      })
    : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {query.trim()
          ? `Search results for "${query}"`
          : "Enter a search term"}
      </h1>

      {query.trim() && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {results.length} {results.length === 1 ? "result" : "results"} found
        </p>
      )}

      {query.trim() && results.length === 0 && (
        <p className="mt-6 text-gray-600 dark:text-gray-400">
          No results found for &ldquo;{query}&rdquo;
        </p>
      )}

      <div className="mt-6 space-y-4">
        {results.map((article) => (
          <Link
            key={article.slug}
            href={`/article/${article.slug}`}
            className="group block rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800"
          >
            <div className="flex gap-4">
              <div className="hidden aspect-video w-40 flex-shrink-0 overflow-hidden rounded sm:block">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <span className="text-xs font-semibold uppercase text-yahoo-purple">
                  {article.category}
                </span>
                <h2 className="mt-1 text-lg font-semibold text-gray-900 group-hover:underline dark:text-white">
                  {article.title}
                </h2>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2 dark:text-gray-400">
                  {article.snippet}
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  {article.author} &middot; {article.date}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get('q') || '';

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <SearchBar initialQuery={currentQuery} />
      <main className="flex-1">
        <SearchResults />
      </main>
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <main className="flex-1">
            <div className="mx-auto max-w-3xl px-4 py-8">
              <div className="h-8 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
