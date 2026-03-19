'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ShareButtons from '@/components/ShareButtons';
import BookmarkButton from '@/components/BookmarkButton';
import SkeletonCard from '@/components/SkeletonCard';
import { type Article } from '@/lib/articles';

const PAGE_SIZE = 10;

export default function InfiniteNewsFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(1);

  const fetchPage = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/articles?page=${pageNum}&limit=${PAGE_SIZE}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      const newArticles: Article[] = data.articles ?? [];
      const more: boolean = data.hasMore ?? false;

      setArticles((prev) => {
        const existingSlugs = new Set(prev.map((a) => a.slug));
        const unique = newArticles.filter((a: Article) => !existingSlugs.has(a.slug));
        return [...prev, ...unique];
      });
      setHasMore(more);
    } catch {
      // Keep existing articles on error
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, []);

  // Load first page
  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          pageRef.current += 1;
          fetchPage(pageRef.current);
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, fetchPage]);

  if (initialLoading) {
    return (
      <section aria-label="News feed" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Latest News</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section aria-label="News feed" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Latest News</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link href={`/article/${article.slug}`} key={article.slug} className="group block">
            <article className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-xs font-semibold uppercase tracking-wide text-yahoo-purple">
                      {article.category}
                    </span>
                    <h3 className="text-sm font-semibold leading-snug text-gray-900 dark:text-white group-hover:underline">
                      {article.title}
                    </h3>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <BookmarkButton article={article} />
                    <ShareButtons title={article.title} slug={article.slug} />
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {article.snippet}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* Sentinel element for Intersection Observer */}
      <div ref={sentinelRef} className="h-1" />

      {loading && !initialLoading && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={`loading-${i}`} />
          ))}
        </div>
      )}

      {!hasMore && articles.length > 0 && (
        <p className="mt-6 text-center text-sm text-gray-400">
          You&apos;ve reached the end of the feed.
        </p>
      )}
    </section>
  );
}
