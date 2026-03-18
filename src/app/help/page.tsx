import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Help & FAQ | Yahoo! Portal',
  description: 'Frequently asked questions about Yahoo! Portal demo site.',
};

export default function HelpPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="mx-auto max-w-3xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Help &amp; FAQ</h1>
        <div className="mt-6 space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">What is Yahoo! Portal?</h2>
            <p className="mt-2">
              Yahoo! Portal is a demonstration news aggregation website built with Next.js and Tailwind CSS.
              It showcases modern web development techniques including responsive design, dark mode, and
              a content management system.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Is the news content real?</h2>
            <p className="mt-2">
              No. All articles and news content on this site are fictional and created for demonstration
              purposes only. Do not rely on any content here for real-world information or decisions.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">How do I use the CMS admin panel?</h2>
            <p className="mt-2">
              Navigate to <code className="rounded bg-gray-200 px-1 py-0.5 text-sm dark:bg-gray-700">/admin</code> and
              enter the demo password to access the content management system. From there you can manage articles,
              trending topics, and site settings.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Are the stock prices real?</h2>
            <p className="mt-2">
              The stock ticker attempts to fetch live data from Yahoo Finance. If the API is unavailable,
              static fallback data is displayed. Either way, this data should not be used for investment decisions.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
