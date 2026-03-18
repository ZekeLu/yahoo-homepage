'use client';

import { useState, useEffect } from 'react';
import { cmsGet } from '@/lib/cmsStorage';
import { allArticles as bundledArticles, type Article } from '@/lib/articles';

interface CmsData {
  articles: Article[];
  trending: string[];
  loading: boolean;
}

const defaultTrending = [
  "Climate Summit",
  "AI Regulation",
  "Stock Market",
  "Electric Vehicles",
  "Oscar Nominations",
  "Space Exploration",
  "Remote Work",
  "Cryptocurrency",
];

export function useCmsData(): CmsData {
  const [articles, setArticles] = useState<Article[]>(bundledArticles);
  const [trending, setTrending] = useState<string[]>(defaultTrending);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localArticles = cmsGet<Article[]>('articles');
    if (localArticles && localArticles.length > 0) {
      setArticles(localArticles);
    }

    const localTrending = cmsGet<string[]>('trending');
    if (localTrending && localTrending.length > 0) {
      setTrending(localTrending);
    }

    setLoading(false);
  }, []);

  return { articles, trending, loading };
}

export function useCmsArticles(): { articles: Article[]; loading: boolean } {
  const [articles, setArticles] = useState<Article[]>(bundledArticles);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localArticles = cmsGet<Article[]>('articles');
    if (localArticles && localArticles.length > 0) {
      setArticles(localArticles);
    }
    setLoading(false);
  }, []);

  return { articles, loading };
}
