"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cmsGetOrSeed, cmsSet } from "@/lib/cmsStorage";

interface Article {
  id: number;
  slug: string;
  title: string;
  section: string;
  category: string;
  author: string;
  date: string;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const perPage = 10;

  useEffect(() => {
    cmsGetOrSeed<Article[]>("articles", "/api/articles")
      .then(setArticles)
      .catch(() => {});
  }, []);

  const handleDelete = () => {
    if (!deleteSlug) return;
    const updated = articles.filter((a) => a.slug !== deleteSlug);
    setArticles(updated);
    cmsSet("articles", updated);
    setDeleteSlug(null);
  };

  const filtered = articles.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchesSection = sectionFilter === "all" || a.section === sectionFilter;
    return matchesSearch && matchesSection;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
          <p className="mt-1 text-sm text-gray-500">{articles.length} total articles</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="rounded-lg bg-[#6001D2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4a01a3] transition-colors"
        >
          New Article
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-[#6001D2] focus:outline-none focus:ring-2 focus:ring-[#6001D2]/20"
        />
        <select
          value={sectionFilter}
          onChange={(e) => { setSectionFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-[#6001D2] focus:outline-none"
        >
          <option value="all">All Sections</option>
          <option value="news">News</option>
          <option value="finance">Finance</option>
          <option value="sports">Sports</option>
          <option value="entertainment">Entertainment</option>
          <option value="tech">Tech</option>
        </select>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-500">Title</th>
              <th className="px-4 py-3 font-medium text-gray-500">Section</th>
              <th className="px-4 py-3 font-medium text-gray-500">Category</th>
              <th className="px-4 py-3 font-medium text-gray-500">Author</th>
              <th className="px-4 py-3 font-medium text-gray-500">Date</th>
              <th className="px-4 py-3 font-medium text-gray-500 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {paginated.map((article) => (
              <tr key={article.slug} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">
                  {article.title}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-block rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700 capitalize">
                    {article.section}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{article.category}</td>
                <td className="px-4 py-3 text-gray-500">{article.author}</td>
                <td className="px-4 py-3 text-gray-500">{article.date}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/articles/${article.slug}/edit`}
                      className="rounded bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteSlug(article.slug)}
                      className="rounded bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No articles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteSlug !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Delete Article</h3>
            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete this article? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteSlug(null)}
                className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
