"use client";

import { useParams } from "next/navigation";
import ArticleForm from "@/components/ArticleForm";

export default function EditArticlePage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Edit Article</h1>
      <p className="mt-1 text-sm text-gray-500">Update article details</p>
      <div className="mt-6">
        <ArticleForm articleId={id} />
      </div>
    </div>
  );
}
