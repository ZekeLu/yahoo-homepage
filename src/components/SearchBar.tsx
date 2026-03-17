'use client'
export default function SearchBar() {
  return (
    <section
      className="bg-white py-6 shadow-sm"
      aria-label="Search"
    >
      <div className="mx-auto max-w-3xl px-4">
        <form
          role="search"
          aria-label="Web search"
          onSubmit={(e) => e.preventDefault()}
          className="flex"
        >
          <label htmlFor="search-input" className="sr-only">
            Search the web
          </label>
          <input
            id="search-input"
            type="search"
            placeholder="Search the web..."
            className="flex-1 rounded-l-full border border-gray-300 px-5 py-3 text-base focus:border-yahoo-purple focus:outline-none focus:ring-2 focus:ring-yahoo-purple-light"
          />
          <button
            type="submit"
            className="rounded-r-full bg-yahoo-purple px-6 py-3 text-white font-semibold hover:bg-yahoo-purple-dark transition-colors"
            aria-label="Search"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  );
}
