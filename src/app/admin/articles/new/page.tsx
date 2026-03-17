"use client";

import ArticleForm from "@/components/ArticleForm";

export default function NewArticlePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">New Article</h1>
      <p className="mt-1 text-sm text-gray-500">Create a new article for the homepage</p>
      <div className="mt-6">
        <ArticleForm />
      </div>
    </div>
  );
}
