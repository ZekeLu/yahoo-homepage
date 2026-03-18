"use client";

import { useState } from "react";


export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("Thanks for subscribing!");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");

    const trimmedEmail = email.trim().toLowerCase();

    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });
      if (res.ok) {
        setSuccessMessage("Thank you for subscribing!");
      } else {
        setSuccessMessage("You're already subscribed!");
      }
      setSubmitted(true);
    } catch {
      setError("Failed to subscribe. Please try again.");
    }
  };

  return (
    <section
      aria-label="Newsletter signup"
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="rounded-xl bg-gradient-to-r from-yahoo-purple to-[#1a1a5e] p-8 text-center text-white shadow-lg sm:p-12">
        {submitted ? (
          <div>
            <span className="text-4xl" role="img" aria-label="Party">
              🎉
            </span>
            <h2 className="mt-3 text-2xl font-bold">
              {successMessage}
            </h2>
            <p className="mt-2 text-purple-200">
              You&apos;ll start receiving the latest news in your inbox soon.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold sm:text-3xl">Stay informed</h2>
            <p className="mt-2 text-purple-200">
              Get the latest news delivered straight to your inbox.
            </p>
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-full px-5 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="rounded-full bg-white px-6 py-3 font-semibold text-yahoo-purple hover:bg-gray-100 transition-colors"
              >
                Subscribe
              </button>
            </form>
            {error && (
              <p className="mt-3 text-sm text-red-300" role="alert">{error}</p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
