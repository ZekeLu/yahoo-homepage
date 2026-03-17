export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
      <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-2 h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-1 h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}
