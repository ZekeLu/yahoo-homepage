'use client';

import { useBookmarks } from '@/hooks/useBookmarks';

interface BookmarkButtonProps {
  article: {
    slug: string;
    title: string;
    snippet: string;
    category: string;
    section: string;
    author: string;
    date: string;
    imageUrl: string;
  };
  size?: 'sm' | 'md';
}

export default function BookmarkButton({ article, size = 'sm' }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark, loaded } = useBookmarks();

  if (!loaded) return null;

  const bookmarked = isBookmarked(article.slug);
  const sizeClass = size === 'md' ? 'text-xl p-2' : 'text-base p-1';

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(article);
      }}
      className={`${sizeClass} rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0`}
      aria-label={bookmarked ? `Remove ${article.title} from bookmarks` : `Bookmark ${article.title}`}
      title={bookmarked ? 'Remove bookmark' : 'Bookmark this article'}
    >
      <span aria-hidden="true">{bookmarked ? '\uD83D\uDD16' : '\uD83D\uDCCE'}</span>
    </button>
  );
}
