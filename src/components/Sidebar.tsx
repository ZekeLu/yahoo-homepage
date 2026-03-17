const trendingKeywords = [
  "Climate Summit",
  "AI Regulation",
  "Stock Market",
  "Electric Vehicles",
  "Oscar Nominations",
  "Space Exploration",
  "Remote Work",
  "Cryptocurrency",
];

export default function Sidebar() {
  return (
    <aside aria-label="Sidebar" className="space-y-6">
      {/* Weather Widget */}
      <div className="rounded-lg bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-bold text-gray-900">Weather</h2>
        <div className="flex items-center gap-4">
          <span className="text-4xl" role="img" aria-label="Partly cloudy">
            ⛅
          </span>
          <div>
            <p className="text-3xl font-bold text-gray-900">72°F</p>
            <p className="text-sm text-gray-500">San Francisco, CA</p>
            <p className="text-xs text-gray-400">Partly Cloudy</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs text-gray-500">
          <div>
            <p className="font-medium">Mon</p>
            <p>68°</p>
          </div>
          <div>
            <p className="font-medium">Tue</p>
            <p>71°</p>
          </div>
          <div>
            <p className="font-medium">Wed</p>
            <p>65°</p>
          </div>
          <div>
            <p className="font-medium">Thu</p>
            <p>70°</p>
          </div>
        </div>
      </div>

      {/* Trending Keywords */}
      <div className="rounded-lg bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-bold text-gray-900">Trending</h2>
        <ul className="space-y-2" role="list">
          {trendingKeywords.map((keyword, index) => (
            <li key={keyword}>
              <a
                href="#"
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-yahoo-purple transition-colors"
              >
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-yahoo-purple text-xs font-bold text-white">
                  {index + 1}
                </span>
                {keyword}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Ad Placeholder */}
      <div
        className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
        role="complementary"
        aria-label="Advertisement"
      >
        <div className="text-center text-gray-400">
          <p className="text-sm font-medium">Advertisement</p>
          <p className="text-xs">300 × 250</p>
        </div>
      </div>
    </aside>
  );
}
