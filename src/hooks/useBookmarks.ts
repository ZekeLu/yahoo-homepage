'use client';

import { useState, useEffect, useCallback } from 'react';

interface BookmarkedArticle {
  slug: string;
  title: string;
  snippet: string;
  category: string;
  section: string;
  author: string;
  date: string;
  imageUrl: string;
  bookmarkedAt: number;
}

const BOOKMARKS_KEY = 'yahoo_bookmarks';

function loadBookmarks(): BookmarkedArticle[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveBookmarks(bookmarks: BookmarkedArticle[]): void {
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch {
    // localStorage full or unavailable
  }
}

export type { BookmarkedArticle };

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkedArticle[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setBookmarks(loadBookmarks());
    setLoaded(true);
  }, []);

  const isBookmarked = useCallback(
    (slug: string) => bookmarks.some((b) => b.slug === slug),
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (article: { slug: string; title: string; snippet: string; category: string; section: string; author: string; date: string; imageUrl: string }) => {
      setBookmarks((prev) => {
        const exists = prev.some((b) => b.slug === article.slug);
        let next: BookmarkedArticle[];
        if (exists) {
          next = prev.filter((b) => b.slug !== article.slug);
        } else {
          next = [{ ...article, bookmarkedAt: Date.now() }, ...prev];
        }
        saveBookmarks(next);
        return next;
      });
    },
    []
  );

  const removeBookmark = useCallback((slug: string) => {
    setBookmarks((prev) => {
      const next = prev.filter((b) => b.slug !== slug);
      saveBookmarks(next);
      return next;
    });
  }, []);

  return { bookmarks, loaded, isBookmarked, toggleBookmark, removeBookmark };
}
