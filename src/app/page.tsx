import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import HeroNews from "@/components/HeroNews";
import ContentColumns from "@/components/ContentColumns";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import BackToTop from "@/components/BackToTop";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <SearchBar />

      <main className="flex-1">
        <HeroNews />

        {/* Content + Sidebar layout */}
        <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-3">
              <ContentColumns />
            </div>
            <div className="lg:col-span-1">
              <Sidebar />
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
