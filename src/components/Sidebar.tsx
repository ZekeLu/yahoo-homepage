'use client';

import { useState, useEffect } from 'react';

const defaultTrendingKeywords = [
  "Climate Summit",
  "AI Regulation",
  "Stock Market",
  "Electric Vehicles",
  "Oscar Nominations",
  "Space Exploration",
  "Remote Work",
  "Cryptocurrency",
];

function formatCurrentDate(): string {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

interface SidebarProps {
  trending?: string[];
}

export default function Sidebar({ trending }: SidebarProps) {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(formatCurrentDate());
  }, []);

  return (
    <aside aria-label="Sidebar" className="space-y-6">
      {/* Weather Widget */}
      <div className="rounded-lg bg-white dark:bg-gray-800 p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">Weather</h2>
        <div className="flex items-center gap-4">
          <span className="text-4xl" role="img" aria-label="Partly cloudy">
            ⛅
          </span>
          <div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">72°F</p>
            {currentDate && (
              <p className="text-sm text-gray-700 dark:text-gray-300">{currentDate}</p>
            )}
            <p className="text-xs text-gray-400">Partly Cloudy</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs text-gray-500 dark:text-gray-400">
          <div>
            <p className="font-medium">Mon</p>
            <p>68°</p>
          </div>
          <div>
            <p className="font-medium">Tue</p>
            <p>71°</p>
          </div>
          <div>
            <p className="font-medium">Wed</p>
            <p>65°</p>
          </div>
          <div>
            <p className="font-medium">Thu</p>
            <p>70°</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-400 italic">Weather data is illustrative</p>
      </div>

      {/* Trending Keywords */}
      <div className="rounded-lg bg-white dark:bg-gray-800 p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">Trending</h2>
        <ul className="space-y-2" role="list">
          {(trending ?? defaultTrendingKeywords).map((keyword, index) => (
            <li key={keyword}>
              <a
                href="#"
                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-yahoo-purple transition-colors"
              >
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-yahoo-purple text-xs font-bold text-white">
                  {index + 1}
                </span>
                {keyword}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Ad Placeholder */}
      <div
        className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
        role="complementary"
        aria-label="Advertisement"
      >
        <div className="text-center text-gray-400">
          <p className="text-sm font-medium">Advertisement</p>
          <p className="text-xs">300 × 250</p>
        </div>
      </div>
    </aside>
  );
}
