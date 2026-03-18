'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ShareButtons from '@/components/ShareButtons';
import SkeletonCard from '@/components/SkeletonCard';
import { allArticles as bundledArticles, type Article } from '@/lib/articles';

interface HeroNewsProps {
  articles?: Article[];
  loading?: boolean;
}

export default function HeroNews({ articles, loading: externalLoading }: HeroNewsProps) {
  const [internalLoading, setInternalLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInternalLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const isLoading = externalLoading ?? internalLoading;
  const sourceArticles = articles ?? bundledArticles;
  const heroArticle = sourceArticles.find((a) => a.slug === "global-leaders-climate-summit-geneva")
    ?? sourceArticles.find((a) => a.section === "news")
    ?? sourceArticles[0];
  const sideArticles = heroArticle
    ? sourceArticles.filter((a) => a.section === "news" && a.slug !== heroArticle.slug)
    : [];

  if (isLoading) {
    return (
      <section id="news" aria-label="Top stories" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Top Stories</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700 h-72 sm:h-96" />
          </div>
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="news" aria-label="Top stories" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Top Stories</h2>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Hero card */}
        <Link href={`/article/${heroArticle.slug}`} className="lg:col-span-2 block group">
          <article className="relative overflow-hidden rounded-lg shadow-md h-72 sm:h-96">
            <Image
              src={heroArticle.imageUrl}
              alt={heroArticle.title}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-6 text-white">
              <span className="mb-2 inline-block w-fit rounded bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur-sm">
                {heroArticle.category}
              </span>
              <h3 className="text-xl font-bold leading-tight sm:text-2xl lg:text-3xl group-hover:underline">
                {heroArticle.title}
              </h3>
              <p className="mt-2 text-sm text-gray-200 line-clamp-2">{heroArticle.snippet}</p>
            </div>
          </article>
        </Link>

        {/* Side article list */}
        <div className="flex flex-col gap-3">
          {sideArticles.map((article) => (
            <Link href={`/article/${article.slug}`} key={article.slug} className="group">
              <article className="flex items-start gap-3 rounded-lg bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                <div className="h-10 w-10 flex-shrink-0 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-lg" aria-hidden="true">
                  📰
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-yahoo-purple">
                      {article.category}
                    </span>
                    <ShareButtons title={article.title} slug={article.slug} />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug group-hover:underline">
                    {article.title}
                  </h3>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
