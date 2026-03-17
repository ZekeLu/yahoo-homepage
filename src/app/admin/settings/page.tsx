"use client";

import { useState, useEffect } from "react";

interface Article {
  id: number;
  slug: string;
  title: string;
}

export default function AdminSettingsPage() {
  const [siteTitle, setSiteTitle] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [heroArticleSlug, setHeroArticleSlug] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/settings").then((r) => r.json()),
      fetch("/api/articles").then((r) => r.json()),
    ]).then(([settings, arts]) => {
      setSiteTitle(settings.siteTitle || "");
      setSiteDescription(settings.siteDescription || "");
      setHeroArticleSlug(settings.heroArticleSlug || "");
      setArticles(arts);
    }).catch(() => {});
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteTitle, siteDescription, heroArticleSlug }),
      });
      if (res.ok) {
        setMessage("Settings saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch {
      setMessage("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    if (newPassword.length < 4) {
      setPasswordError("Password must be at least 4 characters");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        setPasswordMessage("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordMessage(""), 3000);
      } else {
        const data = await res.json();
        setPasswordError(data.error || "Failed to change password");
      }
    } catch {
      setPasswordError("Something went wrong");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <p className="mt-1 text-sm text-gray-500">Configure site settings</p>

      {/* Site Settings */}
      <form onSubmit={handleSaveSettings} className="mt-6 rounded-xl bg-white p-6 shadow-sm space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Site Settings</h2>

        {message && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</div>
        )}

        <div>
          <label htmlFor="siteTitle" className="block text-sm font-medium text-gray-700">
            Site Title
          </label>
          <input
            id="siteTitle"
            type="text"
            value={siteTitle}
            onChange={(e) => setSiteTitle(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#6001D2] focus:outline-none focus:ring-2 focus:ring-[#6001D2]/20"
          />
        </div>

        <div>
          <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
            Site Description
          </label>
          <textarea
            id="siteDescription"
            rows={3}
            value={siteDescription}
            onChange={(e) => setSiteDescription(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#6001D2] focus:outline-none focus:ring-2 focus:ring-[#6001D2]/20"
          />
        </div>

        <div>
          <label htmlFor="heroArticle" className="block text-sm font-medium text-gray-700">
            Hero Article
          </label>
          <select
            id="heroArticle"
            value={heroArticleSlug}
            onChange={(e) => setHeroArticleSlug(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#6001D2] focus:outline-none"
          >
            <option value="">Select an article</option>
            {articles.map((a) => (
              <option key={a.id} value={a.slug}>
                {a.title}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#6001D2] px-6 py-2 text-sm font-semibold text-white hover:bg-[#4a01a3] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>

      {/* Change Password */}
      <form onSubmit={handleChangePassword} className="mt-6 rounded-xl bg-white p-6 shadow-sm space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Change Admin Password</h2>

        {passwordMessage && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{passwordMessage}</div>
        )}
        {passwordError && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{passwordError}</div>
        )}

        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#6001D2] focus:outline-none focus:ring-2 focus:ring-[#6001D2]/20"
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#6001D2] focus:outline-none focus:ring-2 focus:ring-[#6001D2]/20"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#6001D2] focus:outline-none focus:ring-2 focus:ring-[#6001D2]/20"
          />
        </div>

        <button
          type="submit"
          disabled={savingPassword}
          className="rounded-lg bg-[#6001D2] px-6 py-2 text-sm font-semibold text-white hover:bg-[#4a01a3] transition-colors disabled:opacity-50"
        >
          {savingPassword ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
