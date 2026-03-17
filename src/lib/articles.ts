export interface Article {
  slug: string;
  title: string;
  snippet: string;
  category: string;
  section: string;
  subcategory?: string;
  author: string;
  date: string;
  body: string[];
  imageUrl: string;
}

export const allArticles: Article[] = [
  {
    slug: "global-leaders-climate-summit-geneva",
    title: "Global Leaders Gather for Historic Climate Summit in Geneva",
    snippet:
      "World leaders from over 190 countries convene in Geneva to negotiate new binding agreements on carbon emissions and renewable energy targets for the next decade.",
    category: "World News",
    section: "news",
    author: "Sarah Mitchell",
    date: "March 17, 2026",
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=450&fit=crop",
    body: [
      "In what is being hailed as the most significant environmental gathering in decades, world leaders from over 190 countries have converged on Geneva for a historic climate summit. The week-long event aims to establish new binding agreements on carbon emissions and renewable energy targets that will shape environmental policy for the next decade.",
      "The summit comes at a critical juncture, as recent scientific reports indicate that global temperatures are on track to exceed the 1.5\u00b0C threshold set by the Paris Agreement. Delegates are expected to negotiate ambitious targets for reducing greenhouse gas emissions by 2035, with a particular focus on transitioning away from fossil fuels.",
      "Key topics on the agenda include carbon pricing mechanisms, climate finance for developing nations, and the establishment of a global renewable energy standard. Several major economies have already signaled their willingness to commit to net-zero emissions by 2040, a decade earlier than previous pledges.",
      "Environmental advocacy groups have organized parallel events throughout the city, calling for even more aggressive action. Meanwhile, industry representatives are pushing for a balanced approach that considers economic impacts alongside environmental goals.",
    ],
  },
  {
    slug: "tech-giants-record-earnings-ai-boom",
    title: "Tech Giants Report Record Earnings Amid AI Boom",
    snippet:
      "Major technology companies post unprecedented quarterly results driven by artificial intelligence investments.",
    category: "Business",
    section: "news",
    author: "James Chen",
    date: "March 16, 2026",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop",
    body: [
      "The world's largest technology companies have reported record-breaking earnings for the latest quarter, with artificial intelligence emerging as the primary growth driver across the sector. Combined revenues from the top five tech firms exceeded $500 billion, marking an unprecedented milestone.",
      "Cloud computing divisions saw the strongest growth, with enterprise AI services contributing significantly to revenue streams. Companies reported that demand for AI infrastructure, including specialized chips and data center capacity, continues to outpace supply.",
      "Investors responded enthusiastically, pushing tech stock indices to all-time highs. Analysts note that the current AI boom differs from previous technology cycles in its broad-based adoption across industries, from healthcare to manufacturing.",
      "However, some market observers have raised concerns about the sustainability of current growth rates, drawing parallels to previous technology bubbles. Companies have pushed back on such comparisons, pointing to concrete revenue generation rather than speculative valuations.",
    ],
  },
  {
    slug: "scientists-new-species-deep-ocean",
    title: "Scientists Discover New Species in Deep Ocean Expedition",
    snippet:
      "A groundbreaking expedition reveals dozens of previously unknown species in the deep ocean.",
    category: "Science",
    section: "news",
    author: "Dr. Elena Rodriguez",
    date: "March 15, 2026",
    imageUrl: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=450&fit=crop",
    body: [
      "Marine biologists have announced the discovery of 47 previously unknown species during a deep-sea expedition in the Pacific Ocean. The findings, published in the journal Nature, represent one of the largest single discoveries of new marine life in recent history.",
      "The expedition utilized advanced submersible technology to explore depths exceeding 6,000 meters, areas that have remained largely inaccessible to scientific study. Among the discoveries are several bioluminescent organisms and a new genus of deep-sea coral.",
      "Researchers believe these findings could have significant implications for biotechnology and medicine, as many deep-sea organisms produce unique chemical compounds with potential pharmaceutical applications.",
      "The team plans to return for a follow-up expedition later this year, equipped with enhanced sampling technology to study the genetic makeup of the newly discovered species in greater detail.",
    ],
  },
  {
    slug: "housing-market-recovery-major-cities",
    title: "Housing Market Shows Signs of Recovery in Major Cities",
    snippet:
      "Home sales and prices are rebounding in several metropolitan areas after a prolonged downturn.",
    category: "Real Estate",
    section: "news",
    author: "Michael Torres",
    date: "March 14, 2026",
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=450&fit=crop",
    body: [
      "The housing market is showing clear signs of recovery across major metropolitan areas, with home sales rising for the third consecutive month and median prices stabilizing after a prolonged period of decline.",
      "Lower mortgage rates, which have fallen to their lowest levels in two years, are being credited as the primary catalyst for renewed buyer activity. First-time homebuyers, in particular, are returning to the market in significant numbers.",
      "Real estate analysts note that inventory levels remain relatively tight in many markets, which is supporting price stability. New construction starts have also increased, though they remain below the levels needed to address the long-term housing shortage.",
      "Despite the positive trends, affordability remains a significant concern in many high-cost markets. Policymakers continue to explore solutions including zoning reforms, incentive programs, and public-private partnerships to increase the supply of affordable housing.",
    ],
  },
  {
    slug: "olympic-committee-new-sports-2028",
    title: "Olympic Committee Announces New Sports for 2028 Games",
    snippet:
      "The IOC adds exciting new disciplines to the 2028 Olympic program.",
    category: "Sports",
    section: "news",
    author: "David Park",
    date: "March 13, 2026",
    imageUrl: "https://images.unsplash.com/photo-1461896836934-bd45ba8c9e57?w=800&h=450&fit=crop",
    body: [
      "The International Olympic Committee has officially announced the addition of five new sports to the 2028 Los Angeles Olympic Games program, reflecting the evolving landscape of global athletics and youth engagement.",
      "Among the new additions are flag football, squash, and cricket, all of which have massive global followings but have been absent from the Olympic program. The decisions were made following extensive consultations with international sports federations.",
      "The inclusion of these sports is expected to significantly boost viewership and participation, particularly in regions where these sports enjoy tremendous popularity. Broadcasting rights negotiations are already underway.",
      "Athletes and fans worldwide have welcomed the announcements, with national federations beginning to establish qualification pathways and training programs for the 2028 Games.",
    ],
  },
  {
    slug: "battery-technology-double-ev-range",
    title: "Breakthrough in Battery Technology Could Double EV Range",
    snippet:
      "A new solid-state battery design promises to revolutionize electric vehicle performance.",
    category: "Tech",
    section: "news",
    author: "Lisa Wang",
    date: "March 12, 2026",
    imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=450&fit=crop",
    body: [
      "Researchers at a leading energy technology company have unveiled a breakthrough solid-state battery design that could effectively double the range of electric vehicles while significantly reducing charging times.",
      "The new battery chemistry utilizes a novel solid electrolyte material that allows for higher energy density while maintaining safety standards. Early prototypes have demonstrated energy densities exceeding 500 Wh/kg, compared to approximately 250 Wh/kg for current lithium-ion batteries.",
      "The development has sent ripples through the automotive industry, with several major automakers already in discussions for licensing agreements. If commercialized successfully, the technology could accelerate the transition to electric vehicles by addressing range anxiety.",
      "The company expects to begin pilot production within 18 months, with commercial availability projected for 2028. Industry analysts estimate the technology could reduce the cost of EV battery packs by up to 30 percent.",
    ],
  },
  {
    slug: "sp-500-all-time-high-jobs-report",
    title: "S&P 500 Hits All-Time High on Strong Jobs Report",
    snippet: "Markets rallied after employment numbers exceeded expectations.",
    category: "Finance",
    section: "finance",
    subcategory: "Stocks",
    author: "Robert Kim",
    date: "March 17, 2026",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop",
    body: [
      "The S&P 500 index surged to a new all-time high following the release of a surprisingly strong jobs report that exceeded economist expectations across all major metrics.",
      "The economy added 312,000 jobs in the latest month, well above the consensus forecast of 225,000. The unemployment rate fell to 3.4%, its lowest level in over five decades.",
      "Market analysts noted that the strong employment data, combined with moderating inflation figures, has reinforced expectations that the Federal Reserve may begin easing monetary policy in the coming months.",
      "All eleven S&P 500 sectors finished in positive territory, with technology and consumer discretionary leading the gains. Trading volume was significantly above average.",
    ],
  },
  {
    slug: "federal-reserve-rate-cut-q3",
    title: "Federal Reserve Signals Potential Rate Cut in Q3",
    snippet:
      "Chair hints at easing monetary policy amid cooling inflation.",
    category: "Finance",
    section: "finance",
    subcategory: "Stocks",
    author: "Amanda Foster",
    date: "March 16, 2026",
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=450&fit=crop",
    body: [
      "Federal Reserve Chair has signaled that the central bank may begin cutting interest rates as early as the third quarter, citing sustained progress in bringing inflation back toward the 2% target.",
      "In testimony before Congress, the Chair noted that the labor market remains healthy while price pressures have moderated significantly from their peak levels.",
      "Bond markets reacted immediately, with Treasury yields declining across the curve. The probability of a rate cut by September, as implied by futures markets, jumped to 85%.",
      "Economists cautioned that the timeline remains data-dependent and could shift if inflation readings unexpectedly accelerate or if global economic conditions deteriorate.",
    ],
  },
  {
    slug: "bitcoin-surges-past-100k",
    title: "Bitcoin Surges Past $100K Milestone",
    snippet:
      "Cryptocurrency reaches historic levels driven by institutional adoption.",
    category: "Finance",
    section: "finance",
    subcategory: "Crypto",
    author: "Nathan Brooks",
    date: "March 15, 2026",
    imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=450&fit=crop",
    body: [
      "Bitcoin has broken through the $100,000 barrier for the first time in its history, marking a watershed moment for the cryptocurrency market and digital assets broadly.",
      "The milestone was driven primarily by continued institutional adoption, with several major pension funds and sovereign wealth funds adding Bitcoin to their portfolios in recent months.",
      "The approval of spot Bitcoin ETFs earlier in the year has made the cryptocurrency accessible to a broader range of investors, contributing to sustained buying pressure.",
      "Critics continue to warn about the volatility inherent in cryptocurrency markets, while proponents argue that Bitcoin's fixed supply and growing institutional acceptance support its long-term value proposition.",
    ],
  },
  {
    slug: "top-5-stocks-to-watch",
    title: "Top 5 Stocks to Watch This Week",
    snippet:
      "Analysts highlight opportunities in tech and healthcare sectors.",
    category: "Finance",
    section: "finance",
    subcategory: "Stocks",
    author: "Patricia Wells",
    date: "March 14, 2026",
    imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=450&fit=crop",
    body: [
      "Wall Street analysts have identified five stocks that could see significant movement this week, based on upcoming earnings reports, regulatory decisions, and sector trends.",
      "Technology stocks continue to dominate the watch lists, with two major semiconductor companies expected to report quarterly results. Healthcare stocks are also in focus ahead of key FDA decisions.",
      "Analysts recommend that investors pay close attention to forward guidance rather than backward-looking results, as the market is increasingly focused on growth trajectories for the second half of the year.",
      "Risk factors to monitor include ongoing trade tensions, currency fluctuations, and any unexpected shifts in Federal Reserve policy expectations.",
    ],
  },
  {
    slug: "lakers-secure-playoff-spot",
    title: "Lakers Secure Playoff Spot With Dramatic Win",
    snippet: "LeBron leads late comeback with 38-point performance.",
    category: "Sports",
    section: "sports",
    subcategory: "Basketball",
    author: "Marcus Johnson",
    date: "March 17, 2026",
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=450&fit=crop",
    body: [
      "The Los Angeles Lakers clinched a playoff berth with a thrilling come-from-behind victory, powered by a masterful 38-point performance from LeBron James that reminded fans why he remains one of basketball's greatest competitors.",
      "Trailing by 15 points entering the fourth quarter, James orchestrated a stunning rally that included four consecutive three-pointers and a coast-to-coast drive for the go-ahead basket with 12 seconds remaining.",
      "The victory marks another remarkable chapter in James's career, securing the Lakers' first playoff appearance in two seasons. Teammates praised his leadership throughout the season's challenging stretches.",
      "Head coach emphasized that the team's depth and defensive improvements have been key factors in their turnaround. The Lakers will face a tough first-round matchup against the conference's second seed.",
    ],
  },
  {
    slug: "world-cup-qualifiers-upsets",
    title: "World Cup Qualifiers: Upsets and Surprises",
    snippet:
      "Several underdogs advance in thrilling qualification matches.",
    category: "Sports",
    section: "sports",
    subcategory: "Soccer",
    author: "Carlos Mendez",
    date: "March 16, 2026",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=450&fit=crop",
    body: [
      "The latest round of World Cup qualification matches delivered a series of stunning upsets that have reshaped the landscape of international football and left several traditional powerhouses fighting for their tournament lives.",
      "Among the biggest surprises was a historic victory by an underdog nation over a perennial favorite, ending a decades-long unbeaten qualifying record. The result sent shockwaves through the sport.",
      "In other groups, several nations secured their qualification with matches to spare, while others face must-win scenarios in the final round of fixtures.",
      "FIFA officials noted that the increased competitiveness of qualifying reflects the globalization of football talent and improved coaching standards across confederations.",
    ],
  },
  {
    slug: "tennis-star-retirement-grand-slam",
    title: "Tennis Star Announces Retirement After Grand Slam Win",
    snippet: "A legendary career ends on the highest possible note.",
    category: "Sports",
    section: "sports",
    subcategory: "Tennis",
    author: "Sophie Martin",
    date: "March 15, 2026",
    imageUrl: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=450&fit=crop",
    body: [
      "In one of the most poignant moments in tennis history, a legendary champion announced their retirement immediately after winning their 25th Grand Slam title, ending an unparalleled career at the absolute pinnacle of the sport.",
      "The emotional post-match ceremony drew tributes from fellow players, former champions, and fans who had watched the champion's career unfold over two remarkable decades.",
      "Sports historians immediately began debating where this career ranks among the greatest in tennis history, with consensus forming that it may well be the most accomplished in the Open Era.",
      "The retiring champion spoke about future plans, which include establishing a tennis academy for underprivileged youth and serving as an ambassador for the sport globally.",
    ],
  },
  {
    slug: "oscar-nominations-surprises-snubs",
    title: "Oscar Nominations Announced: Surprises and Snubs",
    snippet: "Indie films dominate this year's nominations list.",
    category: "Entertainment",
    section: "entertainment",
    subcategory: "Movies",
    author: "Rachel Green",
    date: "March 17, 2026",
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=450&fit=crop",
    body: [
      "The Academy of Motion Picture Arts and Sciences has unveiled the nominations for the 98th Academy Awards, with independent films earning a surprising number of nods in major categories.",
      "The nominations reflect a shifting landscape in Hollywood, where streaming platforms and independent studios are increasingly competing with traditional major studios for awards recognition.",
      "Several high-profile omissions have already sparked debate among film critics and industry observers, particularly in the Best Director and Best Picture categories.",
      "The ceremony is scheduled for late March, with host duties being handled by a popular comedian making their Oscar hosting debut.",
    ],
  },
  {
    slug: "streaming-wars-new-platform",
    title: "Streaming Wars: New Platform Launches With Exclusive Content",
    snippet:
      "Major studio enters the direct-to-consumer streaming market.",
    category: "Entertainment",
    section: "entertainment",
    subcategory: "Streaming",
    author: "Kevin Park",
    date: "March 16, 2026",
    imageUrl: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&h=450&fit=crop",
    body: [
      "A major entertainment conglomerate has officially launched its long-anticipated streaming platform, entering an increasingly crowded market with an ambitious slate of exclusive original content.",
      "The platform debuts with a library of over 15,000 titles, including several high-budget original series and films that have generated significant buzz in the entertainment press.",
      "Industry analysts note that the new entrant faces significant challenges in a market where consumer fatigue with multiple subscriptions is becoming a real concern.",
      "The company is betting on its deep content library and exclusive franchises to differentiate itself, while also offering a competitive price point to attract subscribers.",
    ],
  },
  {
    slug: "music-festival-lineup-summer-2026",
    title: "Music Festival Lineup Revealed for Summer 2026",
    snippet: "Headliners include top artists from multiple genres.",
    category: "Entertainment",
    section: "entertainment",
    subcategory: "Music",
    author: "Jade Williams",
    date: "March 15, 2026",
    imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=450&fit=crop",
    body: [
      "Organizers have announced the full lineup for one of the summer's most anticipated music festivals, featuring an eclectic mix of headliners spanning pop, rock, hip-hop, and electronic music.",
      "The festival, which takes place over three days in August, will feature over 150 acts across eight stages, making it one of the largest music events in the country.",
      "Ticket sales are expected to begin next week, with early-bird pricing available for a limited time. VIP packages, which include backstage access and premium viewing areas, are anticipated to sell out quickly.",
      "The festival has also announced expanded sustainability initiatives, including carbon-neutral operations and a ban on single-use plastics throughout the venue.",
    ],
  },
  {
    slug: "bestselling-author-fantasy-series",
    title: "Bestselling Author Reveals Next Book in Fantasy Series",
    snippet:
      "Fans eagerly await the sixth installment of the epic saga.",
    category: "Entertainment",
    section: "entertainment",
    subcategory: "Books",
    author: "Thomas Reed",
    date: "March 14, 2026",
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=450&fit=crop",
    body: [
      "The author behind one of the bestselling fantasy series of the decade has officially announced the release date for the highly anticipated sixth installment, ending years of speculation among devoted fans.",
      "The new book, which promises to be the longest in the series at over 800 pages, will resolve several major plot threads while introducing new characters and storylines.",
      "Publisher expectations are enormous, with an initial print run of 5 million copies planned across multiple languages. Pre-orders have already broken records for the genre.",
      "The author revealed in an exclusive interview that two more books are planned to complete the series, with the final installment expected by 2029.",
    ],
  },
  {
    slug: "ai-assistants-everyday-productivity",
    title: "AI Assistants Transform Everyday Productivity",
    snippet:
      "New generation of AI tools reshapes how people work and create.",
    category: "Tech",
    section: "tech",
    subcategory: "AI",
    author: "Diana Chen",
    date: "March 17, 2026",
    imageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=450&fit=crop",
    body: [
      "A new generation of AI-powered productivity assistants is fundamentally changing how people approach their daily work, from drafting emails and creating presentations to analyzing complex datasets and generating creative content.",
      "Recent surveys indicate that over 60% of knowledge workers now use AI tools regularly in their professional lives, a dramatic increase from just 15% two years ago.",
      "The technology has evolved beyond simple chatbots to become sophisticated collaborators capable of understanding context, maintaining conversation history, and adapting to individual user preferences.",
      "Privacy and data security remain top concerns, with companies implementing strict policies around the use of AI tools with sensitive corporate information.",
    ],
  },
  {
    slug: "chip-maker-next-gen-processors",
    title: "Major Chip Maker Unveils Next-Gen Processors",
    snippet:
      "New architecture promises 40% performance gains over predecessor.",
    category: "Tech",
    section: "tech",
    subcategory: "Hardware",
    author: "Brian Lee",
    date: "March 16, 2026",
    imageUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&h=450&fit=crop",
    body: [
      "A leading semiconductor manufacturer has unveiled its next-generation processor architecture, promising a 40% improvement in performance and 25% reduction in power consumption compared to its predecessor.",
      "The new chips, built on a cutting-edge 2nm process node, incorporate advanced AI acceleration capabilities alongside traditional CPU and GPU performance enhancements.",
      "Industry benchmarks suggest the new processors will set new standards for both consumer devices and data center applications, with particular improvements in AI workload handling.",
      "Mass production is expected to begin in the second half of the year, with the first consumer devices featuring the new chips arriving by the holiday season.",
    ],
  },
  {
    slug: "cybersecurity-threats-remote-work",
    title: "Cybersecurity Threats Rise as Remote Work Expands",
    snippet:
      "Experts urge companies to strengthen digital defenses.",
    category: "Tech",
    section: "tech",
    subcategory: "Security",
    author: "Alex Turner",
    date: "March 15, 2026",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop",
    body: [
      "Cybersecurity experts are sounding the alarm about a significant increase in sophisticated cyberattacks targeting organizations with distributed workforces, as remote and hybrid work arrangements continue to expand globally.",
      "The latest industry report reveals that ransomware attacks have increased by 67% over the past year, with small and medium businesses being disproportionately affected due to limited security resources.",
      "New attack vectors leveraging AI-generated phishing content have made it increasingly difficult for employees to distinguish legitimate communications from malicious ones.",
      "Security professionals recommend that organizations implement zero-trust architecture, regular security audits, and comprehensive employee training programs to mitigate the evolving threat landscape.",
    ],
  },
  {
    slug: "smart-home-tech-affordable-2026",
    title: "Smart Home Tech Gets More Affordable in 2026",
    snippet:
      "Budget-friendly devices bring automation to more households.",
    category: "Tech",
    section: "tech",
    subcategory: "Hardware",
    author: "Maria Santos",
    date: "March 14, 2026",
    imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=450&fit=crop",
    body: [
      "The smart home technology market is experiencing a significant shift toward affordability, with several major manufacturers introducing budget-friendly product lines that make home automation accessible to a broader consumer base.",
      "Average prices for smart home devices have dropped by approximately 35% over the past two years, driven by increased competition, improved manufacturing processes, and economies of scale.",
      "The most popular categories include smart lighting, security cameras, and voice-controlled assistants, with newer entrants like smart energy management systems gaining traction.",
      "Industry analysts predict that over 50% of households in developed markets will have at least one smart home device by the end of 2026, up from an estimated 38% at the start of the year.",
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return allArticles.find((a) => a.slug === slug);
}

export function getArticlesBySection(section: string): Article[] {
  return allArticles.filter((a) => a.section === section);
}
