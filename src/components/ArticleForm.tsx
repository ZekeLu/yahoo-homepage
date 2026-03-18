"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cmsGetOrSeed, cmsSet } from "@/lib/cmsStorage";

interface ArticleData {
  id?: number;
  title: string;
  slug: string;
  section: string;
  category: string;
  subcategory: string;
  author: string;
  date: string;
  snippet: string;
  body: string[];
  tags: string[];
  isFeatured: boolean;
  imageUrl?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseDateToInput(dateStr: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }
  return new Date().toISOString().split("T")[0];
}

export default function ArticleForm({ articleId }: { articleId?: string }) {
  const router = useRouter();
  const isEdit = !!articleId;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slugEdited, setSlugEdited] = useState(false);

  const [form, setForm] = useState<ArticleData>({
    title: "",
    slug: "",
    section: "news",
    category: "",
    subcategory: "",
    author: "",
    date: new Date().toISOString().split("T")[0],
    snippet: "",
    body: [],
    tags: [],
    isFeatured: false,
  });

  const [bodyText, setBodyText] = useState("");
  const [tagsText, setTagsText] = useState("");

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      cmsGetOrSeed<ArticleData[]>("articles", "/api/articles")
        .then((articles) => {
            const found = articles.find((a) => a.slug === articleId);
            if (found) {
              setForm({
                ...found,
                title: found.title || "",
                date: parseDateToInput(found.date || ""),
                tags: found.tags || [],
                isFeatured: found.isFeatured || false,
                subcategory: found.subcategory || "",
                imageUrl: found.imageUrl || "",
              });
              setBodyText(found.body?.join("\n\n") || "");
              setTagsText(found.tags?.join(", ") || "");
              setSlugEdited(true);
            }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [articleId, isEdit]);

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "title" && !slugEdited) {
        updated.slug = slugify(value as string);
      }
      return updated;
    });
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.slug.trim()) errs.slug = "Slug is required";
    if (!form.section) errs.section = "Section is required";
    if (!form.category.trim()) errs.category = "Category is required";
    if (!form.author.trim()) errs.author = "Author is required";
    if (!form.date) errs.date = "Date is required";
    if (form.snippet.length > 200) errs.snippet = "Summary must be 200 characters or less";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    const payload = {
      ...form,
      body: bodyText.split("\n\n").filter((p) => p.trim()),
      tags: tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const articles = await cmsGetOrSeed<ArticleData[]>("articles", "/api/articles");
      if (isEdit) {
        const index = articles.findIndex((a) => a.slug === articleId);
        if (index !== -1) {
          articles[index] = { ...articles[index], ...payload };
        }
      } else {
        const maxId = articles.reduce((max, a) => Math.max(max, a.id || 0), 0);
        payload.id = maxId + 1;
        if (!payload.imageUrl) {
          payload.imageUrl = `https://picsum.photos/seed/${payload.slug}/800/450`;
        }
        articles.push(payload as ArticleData);
      }
      cmsSet("articles", articles);
      router.push("/admin/articles");
    } catch {
      // handle error silently
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6001D2]" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
      <div className="rounded-xl bg-white p-6 shadow-sm space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#6001D2] focus:outline-none focus:ring-2 focus:ring-[#6001D2]/20"
          />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            id="slug"
            type="text"
            value={form.slug}
            onChange={(e) => { setSlugEdited(true); updateField("slug", e.target.value); }}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#6001D2] focus:outline-none focus:ring-2 focus:ring-[#6001D2]/20"
          />
          {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="section" className="block text-sm font-medium text-gray-700">
              Section <span className="text-red-500">*</span>
            </label>
            <select
              id="section"
              value={form.section}
              onChange={(e) => updateField("section", e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#6001D2] focus:outline-none"
            >
              <option value="news">News</option>
              <option value="finance">Finance</option>
              <option value="sports">Sports</option>
              <option value="entertainment">Entertainment</option>
              <option value="tech">Tech</option>
            </select>
            {errors.section && <p className="mt-1 text-xs text-red-500">{errors.section}</p>}
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <input
              id="category"
              type="text"
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              placeholder='e.g. "BUSINESS", "SPORTS"'
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#6001D2] focus:outline-none focus:ring-2 focus:ring-[#6001D2]/20"
            />
            {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
              Subcategory
            </label>
            <input
              id="subcategory"
              type="text"
              value={form.subcategory || ""}
              onChange={(e) => updateField("subcategory", e.target.value)}
              placeholder="e.g. Stocks, AI, Movies"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#6001D2] focus:outline-none focus:ring-2 focus:ring-[#6001D2]/20"
            />
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700">
              Author <span className="text-red-500">*</span>
            </label>
            <input
              id="author"
              type="text"
              value={form.author}
              onChange={(e) => updateField("author", e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#6001D2] focus:outline-none focus:ring-2 focus:ring-[#6001D2]/20"
            />
            {errors.author && <p className="mt-1 text-xs text-red-500">{errors.author}</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => updateField("date", e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#6001D2] focus:outline-none focus:ring-2 focus:ring-[#6001D2]/20"
            />
            {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
          </div>
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="climate, politics, global"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#6001D2] focus:outline-none focus:ring-2 focus:ring-[#6001D2]/20"
            />
          </div>
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            id="imageUrl"
            type="text"
            value={form.imageUrl || ""}
            onChange={(e) => updateField("imageUrl", e.target.value)}
            placeholder="https://picsum.photos/800/400"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#6001D2] focus:outline-none focus:ring-2 focus:ring-[#6001D2]/20"
          />
          <p className="mt-1 text-xs text-gray-400">Leave empty to auto-generate from slug</p>
        </div>

        <div>
          <label htmlFor="snippet" className="block text-sm font-medium text-gray-700">
            Summary/Excerpt (max 200 chars)
          </label>
          <textarea
            id="snippet"
            rows={2}
            value={form.snippet}
            onChange={(e) => updateField("snippet", e.target.value)}
            maxLength={200}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#6001D2] focus:outline-none focus:ring-2 focus:ring-[#6001D2]/20"
          />
          <p className="mt-1 text-xs text-gray-400">{form.snippet.length}/200</p>
          {errors.snippet && <p className="mt-1 text-xs text-red-500">{errors.snippet}</p>}
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700">
            Body Content (separate paragraphs with blank lines)
          </label>
          <textarea
            id="body"
            rows={10}
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#6001D2] focus:outline-none focus:ring-2 focus:ring-[#6001D2]/20 font-mono text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="isFeatured"
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => updateField("isFeatured", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-[#6001D2] focus:ring-[#6001D2]"
          />
          <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
            Is Featured (hero article)
          </label>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/articles")}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#6001D2] px-6 py-2 text-sm font-semibold text-white hover:bg-[#4a01a3] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : isEdit ? "Update Article" : "Create Article"}
        </button>
      </div>
    </form>
  );
}
