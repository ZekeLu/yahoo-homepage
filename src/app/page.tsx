'use client';

import Navbar from "@/components/Navbar";
import StockTicker from "@/components/StockTicker";
import SearchBar from "@/components/SearchBar";
import HeroNews from "@/components/HeroNews";
import ContentColumns from "@/components/ContentColumns";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import BackToTop from "@/components/BackToTop";
import { useCmsData } from "@/hooks/useCmsData";

export default function Home() {
  const { articles, trending, loading } = useCmsData();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <StockTicker />
      <SearchBar />

      <main className="flex-1">
        <HeroNews articles={articles} loading={loading} />

        {/* Content + Sidebar layout */}
        <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-3">
              <ContentColumns articles={articles} loading={loading} />
            </div>
            <div className="lg:col-span-1">
              <Sidebar trending={trending} />
            </div>
          </div>
        </div>

        <Newsletter />
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
