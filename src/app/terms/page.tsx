import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service | Yahoo! Portal',
  description: 'Terms of service for Yahoo! Portal demo site.',
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="mx-auto max-w-3xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Last updated: March 2026</p>
        <div className="mt-6 space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing this website, you acknowledge that this is a demonstration project and not a real
            news service. All content is fictional and for educational purposes only.
          </p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">2. Use of Content</h2>
          <p>
            The articles, data, and other content on this site are generated for demonstration purposes.
            They should not be relied upon for news, financial advice, or any real-world decisions.
          </p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">3. Disclaimer</h2>
          <p>
            This site is provided &ldquo;as is&rdquo; without warranties of any kind. Stock ticker data
            and weather information are fetched from public APIs and may not be accurate or up-to-date.
          </p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">4. Intellectual Property</h2>
          <p>
            This project is open source. The Yahoo! name and branding are used for demonstration purposes
            only and are trademarks of Yahoo Inc.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
