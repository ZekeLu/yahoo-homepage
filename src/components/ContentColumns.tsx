"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ShareButtons from "@/components/ShareButtons";
import SkeletonCard from "@/components/SkeletonCard";
import { allArticles as bundledArticles, type Article } from "@/lib/articles";

interface FilterConfig {
  section: string;
  tabs: string[];
}

const filterConfigs: FilterConfig[] = [
  { section: "Finance", tabs: ["All", "Stocks", "Crypto"] },
  { section: "Sports", tabs: ["All", "Basketball", "Soccer", "Tennis"] },
  { section: "Entertainment", tabs: ["All", "Movies", "Streaming", "Music", "Books"] },
  { section: "Tech", tabs: ["All", "AI", "Hardware", "Security"] },
];

const sectionIcons: Record<string, string> = {
  Finance: "💹",
  Sports: "⚽",
  Entertainment: "🎬",
  Tech: "💻",
};

const sections = ["Finance", "Sports", "Entertainment", "Tech"];

interface ContentColumnsProps {
  articles?: Article[];
  loading?: boolean;
}

export default function ContentColumns({ articles, loading: externalLoading }: ContentColumnsProps) {
  const [internalLoading, setInternalLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    Finance: "All",
    Sports: "All",
    Entertainment: "All",
    Tech: "All",
  });
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Finance: false,
    Sports: false,
    Entertainment: false,
    Tech: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => setInternalLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const isLoading = externalLoading ?? internalLoading;
  const sourceArticles = articles ?? bundledArticles;

  const getFilteredArticles = (section: string) => {
    const sectionKey = section.toLowerCase();
    const sectionArticles = sourceArticles.filter((a) => a.section === sectionKey);
    const filter = activeFilters[section];
    if (filter === "All") return sectionArticles;
    return sectionArticles.filter((a) => a.subcategory === filter);
  };

  const getVisibleArticles = (section: string) => {
    const filtered = getFilteredArticles(section);
    if (expandedSections[section]) return filtered;
    return filtered.slice(0, 2);
  };

  const toggleExpand = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (isLoading) {
    return (
      <section aria-label="Category news" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {sections.map((section) => (
            <div key={section}>
              <div className="mb-3 h-6 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-3">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Category news" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {sections.map((section) => {
          const config = filterConfigs.find((c) => c.section === section);
          const filtered = getFilteredArticles(section);
          const visible = getVisibleArticles(section);
          const isExpanded = expandedSections[section];

          return (
            <div key={section} id={section.toLowerCase()}>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                <span aria-hidden="true">{sectionIcons[section]}</span>
                {section}
              </h2>

              {/* Filter tabs */}
              {config && (
                <div className="mb-3 flex flex-wrap gap-1">
                  {config.tabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() =>
                        setActiveFilters((prev) => ({ ...prev, [section]: tab }))
                      }
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        activeFilters[section] === tab
                          ? "bg-yahoo-purple text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              )}

              <ul className="space-y-3" role="list">
                {visible.map((article) => (
                  <li key={article.slug}>
                    <Link href={`/article/${article.slug}`} className="group block">
                      <article className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                        <div className="relative aspect-video overflow-hidden">
                          <Image
                            src={article.imageUrl}
                            alt={article.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-semibold leading-snug text-gray-900 dark:text-white group-hover:underline">
                              {article.title}
                            </h3>
                            <div className="flex-shrink-0">
                              <ShareButtons title={article.title} slug={article.slug} />
                            </div>
                          </div>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {article.snippet}
                          </p>
                        </div>
                      </article>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Load more / Show less */}
              {filtered.length > 2 && (
                <button
                  type="button"
                  onClick={() => toggleExpand(section)}
                  className="mt-3 w-full rounded-lg border border-gray-300 dark:border-gray-600 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {isExpanded ? "Show less" : `Load more (${filtered.length - 2})`}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
