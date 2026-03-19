'use client';

import { useState, useEffect, useCallback } from 'react';

interface ReadHistoryEntry {
  slug: string;
  title: string;
  category: string;
  imageUrl: string;
  readAt: number;
}

const HISTORY_KEY = 'yahoo_reading_history';
const MAX_HISTORY = 10;

function loadHistory(): ReadHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: ReadHistoryEntry[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // localStorage full or unavailable
  }
}

export type { ReadHistoryEntry };

export function useReadingHistory() {
  const [history, setHistory] = useState<ReadHistoryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setHistory(loadHistory());
    setLoaded(true);
  }, []);

  const addToHistory = useCallback(
    (article: { slug: string; title: string; category: string; imageUrl: string }) => {
      setHistory((prev) => {
        const filtered = prev.filter((h) => h.slug !== article.slug);
        const next = [{ ...article, readAt: Date.now() }, ...filtered].slice(0, MAX_HISTORY);
        saveHistory(next);
        return next;
      });
    },
    []
  );

  return { history, loaded, addToHistory };
}
