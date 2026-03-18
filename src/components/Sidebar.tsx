'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

interface WeatherData {
  current: { temp_f: number; description: string };
  forecast: { day: string; high_f: number; low_f: number }[];
}

function weatherEmoji(description: string): string {
  const d = description.toLowerCase();
  if (d.includes('clear')) return '☀️';
  if (d.includes('partly')) return '⛅';
  if (d.includes('fog')) return '🌫️';
  if (d.includes('thunder')) return '⛈️';
  if (d.includes('snow')) return '❄️';
  if (d.includes('rain') || d.includes('drizzle') || d.includes('shower')) return '🌧️';
  return '⛅';
}

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
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    setCurrentDate(formatCurrentDate());

    fetch('/api/weather')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: WeatherData) => setWeather(data))
      .catch(() => { /* fall back to static */ })
      .finally(() => setWeatherLoading(false));
  }, []);

  const currentTemp = weather?.current.temp_f ?? 72;
  const currentDesc = weather?.current.description ?? 'Partly Cloudy';
  const forecast = weather?.forecast ?? [
    { day: 'Mon', high_f: 68, low_f: 58 },
    { day: 'Tue', high_f: 71, low_f: 60 },
    { day: 'Wed', high_f: 65, low_f: 55 },
    { day: 'Thu', high_f: 70, low_f: 59 },
  ];

  return (
    <aside aria-label="Sidebar" className="space-y-6">
      {/* Weather Widget */}
      <div className="rounded-lg bg-white dark:bg-gray-800 p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">Weather</h2>
        {weatherLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-2">
                <div className="h-8 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 rounded bg-gray-200 dark:bg-gray-700" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <span className="text-4xl" role="img" aria-label={currentDesc}>
                {weatherEmoji(currentDesc)}
              </span>
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{currentTemp}°F</p>
                {currentDate && (
                  <p className="text-sm text-gray-700 dark:text-gray-300">{currentDate}</p>
                )}
                <p className="text-xs text-gray-400">{currentDesc}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs text-gray-500 dark:text-gray-400">
              {forecast.slice(0, 4).map((f) => (
                <div key={f.day}>
                  <p className="font-medium">{f.day}</p>
                  <p>{f.high_f}°</p>
                </div>
              ))}
            </div>
            {!weather && (
              <p className="mt-3 text-xs text-gray-400 italic">Weather data is illustrative</p>
            )}
          </>
        )}
      </div>

      {/* Trending Keywords */}
      <div className="rounded-lg bg-white dark:bg-gray-800 p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">Trending</h2>
        <ul className="space-y-2" role="list">
          {(trending ?? defaultTrendingKeywords).map((keyword, index) => (
            <li key={keyword}>
              <Link
                href={`/search?q=${encodeURIComponent(keyword)}`}
                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-yahoo-purple transition-colors"
              >
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-yahoo-purple text-xs font-bold text-white">
                  {index + 1}
                </span>
                {keyword}
              </Link>
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
