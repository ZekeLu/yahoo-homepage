"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Article {
  id: number;
  title: string;
  section: string;
  date: string;
}

interface Stats {
  total: number;
  bySection: Record<string, number>;
  trending: number;
  subscribers: number;
  recentArticles: Article[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const [articlesRes, trendingRes, subscribersRes] = await Promise.all([
          fetch("/api/articles"),
          fetch("/api/trending"),
          fetch("/api/subscribers"),
        ]);
        const articles: Article[] = await articlesRes.json();
        const trending: string[] = await trendingRes.json();
        const subscribers: { email: string }[] = await subscribersRes.json();

        const bySection: Record<string, number> = {};
        for (const a of articles) {
          bySection[a.section] = (bySection[a.section] || 0) + 1;
        }

        setStats({
          total: articles.length,
          bySection,
          trending: trending.length,
          subscribers: subscribers.length,
          recentArticles: articles.slice(-5).reverse(),
        });
      } catch {
        // silently fail
      }
    }
    loadStats();
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6001D2]" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Articles", value: stats.total, color: "bg-[#6001D2]" },
    { label: "News", value: stats.bySection["news"] || 0, color: "bg-blue-600" },
    { label: "Finance", value: stats.bySection["finance"] || 0, color: "bg-green-600" },
    { label: "Sports", value: stats.bySection["sports"] || 0, color: "bg-orange-600" },
    { label: "Entertainment", value: stats.bySection["entertainment"] || 0, color: "bg-pink-600" },
    { label: "Tech", value: stats.bySection["tech"] || 0, color: "bg-cyan-600" },
    { label: "Trending Topics", value: stats.trending, color: "bg-yellow-600" },
    { label: "Subscribers", value: stats.subscribers, color: "bg-red-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">Overview of your Yahoo homepage content</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">{card.label}</p>
            <div className="mt-2 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg ${card.color} flex items-center justify-center`}>
                <span className="text-lg font-bold text-white">{card.value}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Articles</h2>
          <Link href="/admin/articles" className="text-sm font-medium text-[#6001D2] hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-500">Title</th>
                <th className="px-4 py-3 font-medium text-gray-500">Section</th>
                <th className="px-4 py-3 font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats.recentArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{article.title}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700 capitalize">
                      {article.section}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{article.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
