interface ColumnData {
  title: string;
  icon: string;
  articles: { title: string; snippet: string }[];
}

const columns: ColumnData[] = [
  {
    title: "Finance",
    icon: "💹",
    articles: [
      {
        title: "S&P 500 Hits All-Time High on Strong Jobs Report",
        snippet: "Markets rallied after employment numbers exceeded expectations.",
      },
      {
        title: "Federal Reserve Signals Potential Rate Cut in Q3",
        snippet: "Chair hints at easing monetary policy amid cooling inflation.",
      },
      {
        title: "Bitcoin Surges Past $100K Milestone",
        snippet: "Cryptocurrency reaches historic levels driven by institutional adoption.",
      },
      {
        title: "Top 5 Stocks to Watch This Week",
        snippet: "Analysts highlight opportunities in tech and healthcare sectors.",
      },
    ],
  },
  {
    title: "Sports",
    icon: "⚽",
    articles: [
      {
        title: "Lakers Secure Playoff Spot With Dramatic Win",
        snippet: "LeBron leads late comeback with 38-point performance.",
      },
      {
        title: "World Cup Qualifiers: Upsets and Surprises",
        snippet: "Several underdogs advance in thrilling qualification matches.",
      },
      {
        title: "Tennis Star Announces Retirement After Grand Slam Win",
        snippet: "A legendary career ends on the highest possible note.",
      },
    ],
  },
  {
    title: "Entertainment",
    icon: "🎬",
    articles: [
      {
        title: "Oscar Nominations Announced: Surprises and Snubs",
        snippet: "Indie films dominate this year's nominations list.",
      },
      {
        title: "Streaming Wars: New Platform Launches With Exclusive Content",
        snippet: "Major studio enters the direct-to-consumer streaming market.",
      },
      {
        title: "Music Festival Lineup Revealed for Summer 2026",
        snippet: "Headliners include top artists from multiple genres.",
      },
      {
        title: "Bestselling Author Reveals Next Book in Fantasy Series",
        snippet: "Fans eagerly await the sixth installment of the epic saga.",
      },
    ],
  },
];

export default function ContentColumns() {
  return (
    <section
      aria-label="Category news"
      className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {columns.map((column) => (
          <div key={column.title} id={column.title.toLowerCase()}>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900">
              <span aria-hidden="true">{column.icon}</span>
              {column.title}
            </h2>
            <ul className="space-y-3" role="list">
              {column.articles.map((article) => (
                <li key={article.title}>
                  <article className="rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {article.title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      {article.snippet}
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
