import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About | Yahoo! Portal',
  description: 'Learn about Yahoo! Portal, a demo news aggregation site.',
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="mx-auto max-w-3xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">About Yahoo! Portal</h1>
        <div className="mt-6 space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            Yahoo! Portal is a demonstration news aggregation website built with Next.js, Tailwind CSS, and TypeScript.
            It showcases modern web development practices including server-side rendering, responsive design, dark mode,
            and a full content management system.
          </p>
          <p>
            This project is not affiliated with Yahoo Inc. or any of its subsidiaries. All article content is
            fictional and created for demonstration purposes only. Stock ticker data is fetched from public APIs,
            and weather data is provided by the Open-Meteo API.
          </p>
          <p>
            The site features sections for News, Finance, Sports, Entertainment, and Technology — mirroring
            the layout of a real news portal while serving as a technical showcase for modern frontend development.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
