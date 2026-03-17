"use client";

import { useState, useEffect } from "react";
import { cmsGetOrSeed, cmsSet } from "@/lib/cmsStorage";

export default function AdminTrendingPage() {
  const [topics, setTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    cmsGetOrSeed<string[]>("trending", "/api/trending")
      .then(setTopics)
      .catch(() => {});
  }, []);

  const addTopic = () => {
    if (!newTopic.trim()) return;
    setTopics((prev) => [...prev, newTopic.trim()]);
    setNewTopic("");
  };

  const deleteTopic = (index: number) => {
    setTopics((prev) => prev.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setTopics((prev) => {
      const copy = [...prev];
      [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index === topics.length - 1) return;
    setTopics((prev) => {
      const copy = [...prev];
      [copy[index], copy[index + 1]] = [copy[index + 1], copy[index]];
      return copy;
    });
  };

  const startEdit = (index: number) => {
    setEditIndex(index);
    setEditValue(topics[index]);
  };

  const saveEdit = () => {
    if (editIndex === null || !editValue.trim()) return;
    setTopics((prev) => prev.map((t, i) => (i === editIndex ? editValue.trim() : t)));
    setEditIndex(null);
    setEditValue("");
  };

  const handleSave = () => {
    setSaving(true);
    setSaved(false);
    cmsSet("trending", topics);
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trending Topics</h1>
          <p className="mt-1 text-sm text-gray-500">Manage the trending topics sidebar</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-[#6001D2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4a01a3] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {saved && (
        <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          Changes saved successfully!
        </div>
      )}

      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Add new topic..."
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTopic()}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-[#6001D2] focus:outline-none focus:ring-2 focus:ring-[#6001D2]/20"
          />
          <button
            type="button"
            onClick={addTopic}
            className="rounded-lg bg-[#6001D2] px-4 py-2 text-sm font-medium text-white hover:bg-[#4a01a3]"
          >
            Add
          </button>
        </div>

        <ul className="space-y-2">
          {topics.map((topic, index) => (
            <li
              key={`${topic}-${index}`}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
            >
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-[#6001D2] text-xs font-bold text-white">
                {index + 1}
              </span>

              {editIndex === index ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                  onBlur={saveEdit}
                  autoFocus
                  className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm focus:border-[#6001D2] focus:outline-none"
                />
              ) : (
                <span
                  className="flex-1 text-sm text-gray-900 cursor-pointer"
                  onClick={() => startEdit(index)}
                >
                  {topic}
                </span>
              )}

              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="rounded p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  aria-label="Move up"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(index)}
                  disabled={index === topics.length - 1}
                  className="rounded p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  aria-label="Move down"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(index)}
                  className="rounded p-1 text-blue-400 hover:text-blue-600"
                  aria-label="Edit topic"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => deleteTopic(index)}
                  className="rounded p-1 text-red-400 hover:text-red-600"
                  aria-label="Delete topic"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>

        {topics.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">No trending topics yet</p>
        )}
      </div>
    </div>
  );
}
