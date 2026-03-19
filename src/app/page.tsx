'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import HeroNews from "@/components/HeroNews";
import ContentColumns from "@/components/ContentColumns";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { useCmsData } from "@/hooks/useCmsData";
import ErrorBoundary from "@/components/ErrorBoundary";

const InfiniteNewsFeed = dynamic(() => import("@/components/InfiniteNewsFeed"), {
  loading: () => (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-4" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg bg-white dark:bg-gray-800 p-4 shadow-sm animate-pulse">
            <div className="aspect-video rounded bg-gray-200 dark:bg-gray-700 mb-3" />
            <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
      </div>
    </section>
  ),
  ssr: false,
});

const StockTicker = dynamic(() => import("@/components/StockTicker"), {
  loading: () => (
    <div className="overflow-hidden bg-gray-900 py-2 text-sm">
      <div className="flex animate-pulse space-x-8 px-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-4 w-12 rounded bg-gray-700" />
            <div className="h-4 w-16 rounded bg-gray-700" />
          </div>
        ))}
      </div>
    </div>
  ),
  ssr: false,
});

const Sidebar = dynamic(() => import("@/components/Sidebar"), {
  loading: () => (
    <aside className="space-y-6">
      <div className="rounded-lg bg-white dark:bg-gray-800 p-5 shadow-sm">
        <div className="h-5 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-3" />
        <div className="animate-pulse space-y-3" style={{ minHeight: '120px' }}>
          <div className="h-12 w-12 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-8 w-20 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </aside>
  ),
});

const Newsletter = dynamic(() => import("@/components/Newsletter"), {
  loading: () => (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-xl bg-gradient-to-r from-yahoo-purple to-[#1a1a5e] p-8 text-center text-white shadow-lg sm:p-12 animate-pulse">
        <div className="h-8 w-48 mx-auto rounded bg-white/20" />
        <div className="h-4 w-64 mx-auto mt-4 rounded bg-white/10" />
      </div>
    </section>
  ),
});

export default function Home() {
  const { articles, trending, loading } = useCmsData();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <ErrorBoundary name="StockTicker">
        <Suspense fallback={null}>
          <StockTicker />
        </Suspense>
      </ErrorBoundary>
      <SearchBar />

      <main id="main-content" role="main" className="flex-1">
        <HeroNews articles={articles} loading={loading} />

        {/* Content + Sidebar layout */}
        <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-3">
              <ContentColumns articles={articles} loading={loading} />
            </div>
            <div className="lg:col-span-1">
              <ErrorBoundary name="WeatherWidget">
                <Suspense fallback={null}>
                  <Sidebar trending={trending} />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
        </div>

        {/* Infinite scroll news feed */}
        <ErrorBoundary name="InfiniteNewsFeed">
          <Suspense fallback={null}>
            <InfiniteNewsFeed />
          </Suspense>
        </ErrorBoundary>

        <Suspense fallback={null}>
          <Newsletter />
        </Suspense>
      </main>

      <Footer />
      <BackToTop />

    </div>
  );
}
