'use client';

import { useState, useEffect, useRef } from 'react';
import { useI18n } from '@/components/I18nProvider';

function generateSuggestions(query: string): string[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return [
    `${q} latest news`,
    `${q} today`,
    `${q} near me`,
    `${q} explained`,
    `${q} trending`,
  ];
}

export default function SearchBar({ initialQuery = '' }: { initialQuery?: string }) {
  const { t } = useI18n();
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const results = generateSuggestions(value);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    }, 300);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    window.location.href = `/search?q=${encodeURIComponent(suggestion)}`;
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <section className="bg-white dark:bg-gray-800 py-6 shadow-sm" aria-label="Search">
      <div className="mx-auto max-w-3xl px-4" ref={containerRef}>
        <form
          role="search"
          aria-label="Web search"
          onSubmit={handleSubmit}
          className="relative flex"
        >
          <label htmlFor="search-input" className="sr-only">
            {t('search.label')}
          </label>
          <input
            id="search-input"
            type="search"
            placeholder={t('search.placeholder')}
            value={query}
            onChange={handleChange}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            autoComplete="off"
            className="flex-1 rounded-l-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-5 py-3 text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-yahoo-purple focus:outline-none focus:ring-2 focus:ring-yahoo-purple-light"
          />
          <button
            type="submit"
            className="rounded-r-full bg-yahoo-purple px-6 py-3 text-white font-semibold hover:bg-yahoo-purple-dark transition-colors"
            aria-label="Search"
          >
            {t('search.button')}
          </button>

          {showSuggestions && suggestions.length > 0 && (
            <ul
              role="listbox"
              aria-label="Search suggestions"
              className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 py-1 shadow-lg"
            >
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  role="option"
                  aria-selected={false}
                  className="cursor-pointer px-5 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  onMouseDown={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>
    </section>
  );
}
