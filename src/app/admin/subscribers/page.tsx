"use client";

import { useState, useEffect } from "react";
import { cmsGetOrSeed, cmsSet } from "@/lib/cmsStorage";

interface Subscriber {
  email: string;
  date: string;
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    cmsGetOrSeed<Subscriber[]>("subscribers", "/api/subscribers")
      .then(setSubscribers)
      .catch(() => {});
  }, []);

  const handleDelete = (email: string) => {
    const updated = subscribers.filter((s) => s.email !== email);
    setSubscribers(updated);
    cmsSet("subscribers", updated);
  };

  const handleExport = () => {
    const header = "Email,Date Subscribed\n";
    const rows = subscribers
      .map((s) => `${s.email},${s.date}`)
      .join("\n");
    const csv = header + rows;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
          <p className="mt-1 text-sm text-gray-500">{subscribers.length} total subscribers</p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          disabled={subscribers.length === 0}
          className="rounded-lg bg-[#6001D2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4a01a3] transition-colors disabled:opacity-50"
        >
          Export CSV
        </button>
      </div>

      <div className="mt-6">
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-[#6001D2] focus:outline-none focus:ring-2 focus:ring-[#6001D2]/20"
        />
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-500">Email</th>
              <th className="px-4 py-3 font-medium text-gray-500">Date Subscribed</th>
              <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((sub) => (
              <tr key={sub.email} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900">{sub.email}</td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(sub.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => handleDelete(sub.email)}
                    className="rounded bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
                  {subscribers.length === 0 ? "No subscribers yet" : "No matching subscribers"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
