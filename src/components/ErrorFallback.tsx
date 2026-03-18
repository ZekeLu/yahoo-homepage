'use client';

interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
  componentName?: string;
}

export default function ErrorFallback({ error, onReset, componentName }: ErrorFallbackProps) {
  return (
    <div
      role="alert"
      className="mx-auto max-w-lg rounded-xl border border-red-200 bg-white p-8 text-center shadow-lg dark:border-red-800 dark:bg-gray-900"
    >
      {/* Yahoo-style purple accent bar */}
      <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-yahoo-purple" />

      <div className="mb-4 text-4xl">⚠️</div>

      <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
        Something went wrong
      </h2>

      {componentName && (
        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
          Error in: {componentName}
        </p>
      )}

      <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
        {error?.message || 'An unexpected error occurred. Please try again.'}
      </p>

      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-lg bg-yahoo-purple px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#4a00a3] focus:outline-none focus:ring-2 focus:ring-yahoo-purple focus:ring-offset-2"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Try again
      </button>

      <p className="mt-6 text-xs text-gray-400">
        Yahoo! Portal &mdash; We apologize for the inconvenience
      </p>
    </div>
  );
}
