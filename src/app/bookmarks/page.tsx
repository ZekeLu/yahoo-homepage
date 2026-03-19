'use client';

import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookmarkButton from '@/components/BookmarkButton';
import { useBookmarks } from '@/hooks/useBookmarks';

export default function BookmarksPage() {
  const { bookmarks, loaded } = useBookmarks();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main id="main-content" role="main" className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            Saved Bookmarks
          </h1>

          {!loaded ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-lg bg-white dark:bg-gray-800 p-4 shadow-sm">
                  <div className="flex gap-4">
                    <div className="h-20 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                      <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="rounded-lg bg-white dark:bg-gray-800 p-12 text-center shadow-sm">
              <p className="text-4xl mb-4" aria-hidden="true">
                {'\uD83D\uDD16'}
              </p>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                No bookmarks yet
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Click the bookmark icon on any article to save it here.
              </p>
              <Link
                href="/"
                className="mt-6 inline-block rounded-lg bg-yahoo-purple px-6 py-2 text-sm font-medium text-white hover:bg-yahoo-purple-dark transition-colors"
              >
                Browse articles
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookmarks.map((article) => (
                <div
                  key={article.slug}
                  className="group flex gap-4 rounded-lg bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <Link href={`/article/${article.slug}`} className="flex-shrink-0">
                    <div className="relative h-20 w-32 overflow-hidden rounded">
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    </div>
                  </Link>
                  <div className="flex flex-1 items-start justify-between gap-2 min-w-0">
                    <div className="min-w-0">
                      <span className="text-xs font-semibold uppercase tracking-wide text-yahoo-purple">
                        {article.category}
                      </span>
                      <Link href={`/article/${article.slug}`}>
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:underline line-clamp-2">
                          {article.title}
                        </h2>
                      </Link>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                        {article.snippet}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        By {article.author} &middot; {article.date}
                      </p>
                    </div>
                    <BookmarkButton article={article} size="md" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
