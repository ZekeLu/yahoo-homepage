'use client';

import { useState, useEffect } from 'react';
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
    Promise.all([
      fetch('/api/articles').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/trending').then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([apiArticles, apiTrending]) => {
        if (Array.isArray(apiArticles) && apiArticles.length > 0) {
          setArticles(apiArticles);
        }
        if (Array.isArray(apiTrending) && apiTrending.length > 0) {
          setTrending(apiTrending);
        }
      })
      .catch(() => { /* keep defaults */ })
      .finally(() => setLoading(false));
  }, []);

  return { articles, trending, loading };
}

export function useCmsArticles(): { articles: Article[]; loading: boolean } {
  const [articles, setArticles] = useState<Article[]>(bundledArticles);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/articles')
      .then((r) => (r.ok ? r.json() : null))
      .then((apiArticles) => {
        if (Array.isArray(apiArticles) && apiArticles.length > 0) {
          setArticles(apiArticles);
        }
      })
      .catch(() => { /* keep defaults */ })
      .finally(() => setLoading(false));
  }, []);

  return { articles, loading };
}
