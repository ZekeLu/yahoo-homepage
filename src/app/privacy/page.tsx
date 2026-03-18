import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | Yahoo! Portal',
  description: 'Privacy policy for Yahoo! Portal demo site.',
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="mx-auto max-w-3xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Last updated: March 2026</p>
        <div className="mt-6 space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            This is a demonstration website. No personal data is collected, stored, or shared with third parties.
            All content on this site is fictional and for demonstration purposes only.
          </p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Information We Collect</h2>
          <p>
            This demo site does not collect any personal information. Newsletter subscriptions and CMS data
            are stored locally in your browser via localStorage and are not transmitted to any server.
          </p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Cookies</h2>
          <p>
            The site uses a single session cookie for admin authentication. No tracking cookies or
            analytics are employed. Your dark mode preference is stored in localStorage.
          </p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Third-Party Services</h2>
          <p>
            The site fetches weather data from Open-Meteo and stock data from Yahoo Finance public APIs.
            Images are served from picsum.photos. These services have their own privacy policies.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
