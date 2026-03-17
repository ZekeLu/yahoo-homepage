const heroArticle = {
  title: "Global Leaders Gather for Historic Climate Summit in Geneva",
  summary:
    "World leaders from over 190 countries convene in Geneva to negotiate new binding agreements on carbon emissions and renewable energy targets for the next decade.",
  imageAlt: "Climate summit in Geneva with world leaders",
  category: "World News",
};

const sideArticles = [
  {
    title: "Tech Giants Report Record Earnings Amid AI Boom",
    category: "Business",
  },
  {
    title: "Scientists Discover New Species in Deep Ocean Expedition",
    category: "Science",
  },
  {
    title: "Housing Market Shows Signs of Recovery in Major Cities",
    category: "Real Estate",
  },
  {
    title: "Olympic Committee Announces New Sports for 2028 Games",
    category: "Sports",
  },
  {
    title: "Breakthrough in Battery Technology Could Double EV Range",
    category: "Tech",
  },
];

export default function HeroNews() {
  return (
    <section id="news" aria-label="Top stories" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h2 className="mb-4 text-xl font-bold text-gray-900">Top Stories</h2>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Hero card */}
        <a href="#" className="lg:col-span-2 block group">
          <article className="relative overflow-hidden rounded-lg shadow-md h-72 sm:h-96">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a5e] via-[#2d1b69] to-[#6001D2]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-6 text-white">
              <span className="mb-2 inline-block w-fit rounded bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur-sm">
                {heroArticle.category}
              </span>
              <h3 className="text-xl font-bold leading-tight sm:text-2xl lg:text-3xl group-hover:underline">
                {heroArticle.title}
              </h3>
              <p className="mt-2 text-sm text-gray-200 line-clamp-2">{heroArticle.summary}</p>
            </div>
          </article>
        </a>

        {/* Side article list */}
        <div className="flex flex-col gap-3">
          {sideArticles.map((article) => (
            <article
              key={article.title}
              className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <div className="h-10 w-10 flex-shrink-0 rounded bg-gray-200 flex items-center justify-center text-lg" aria-hidden="true">
                📰
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-yahoo-purple">
                  {article.category}
                </span>
                <h3 className="text-sm font-semibold text-gray-900 leading-snug">
                  {article.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
