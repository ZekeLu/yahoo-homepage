# Yahoo! Portal — Demo Homepage

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss)
![Sentry](https://img.shields.io/badge/Sentry-Monitoring-362D59?logo=sentry)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)
![CI](https://github.com/ZekeLu/yahoo-homepage/actions/workflows/ci.yml/badge.svg)

A Yahoo-style responsive portal homepage built with **Next.js** and **Tailwind CSS**. This project demonstrates a modern, fully responsive news portal layout with hardcoded fake data — no real APIs required.

## Features

- **Top Navigation Bar** — Yahoo! logo, main channel links (News, Finance, Sports, Entertainment, Tech), and a hamburger menu on mobile
- **Search Bar** — Centered, prominent search input with a styled submit button
- **Main News Area** — Large hero news card alongside 5 smaller article items
- **Multi-Column Content** — Three columns for Finance, Sports, and Entertainment, each with several news items
- **Right Sidebar** — Weather widget, trending keywords, and an ad placeholder (all fake data)
- **Footer** — Links for About, Help, Terms, and Privacy
- **Fully Responsive** — Adapts to desktop, tablet, and mobile viewports
- **Accessible** — Semantic HTML, ARIA labels, alt text, and keyboard-friendly navigation
- **PWA Support** — Installable as a Progressive Web App with offline fallback
- **Error Boundaries** — Graceful error handling with Sentry integration
- **Health Monitoring** — `/api/health` and `/api/metrics` endpoints for uptime monitoring

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser / PWA                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Service Worker (sw.js) — offline cache & asset caching  │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                     Next.js App Router                          │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │  layout.tsx  │  │   page.tsx   │  │   admin/layout.tsx     │ │
│  │ (ErrorBound) │  │  (Homepage)  │  │   (CMS Panel)         │ │
│  └──────┬──────┘  └──────┬───────┘  └────────┬───────────────┘ │
│         │                │                    │                  │
│  ┌──────▼──────────────────────────────────────────────────┐   │
│  │                    Components                            │   │
│  │  Navbar · SearchBar · HeroNews · ContentColumns         │   │
│  │  StockTicker · Sidebar (Weather) · Newsletter · Footer  │   │
│  │  ErrorBoundary · ErrorFallback · AdminSidebar           │   │
│  └──────────────────────────┬──────────────────────────────┘   │
│                              │                                  │
│  ┌──────────────────────────▼──────────────────────────────┐   │
│  │                    API Routes                            │   │
│  │  /api/articles · /api/stocks · /api/weather             │   │
│  │  /api/subscribers · /api/trending · /api/settings       │   │
│  │  /api/health · /api/metrics · /api/auth                 │   │
│  └──────────────────────────┬──────────────────────────────┘   │
│                              │                                  │
│  ┌──────────────────────────▼──────────────────────────────┐   │
│  │                  Data & Services                         │   │
│  │  JSON Files (articles, subscribers, trending, settings) │   │
│  │  Vercel KV (rate limiting, caching)                     │   │
│  │  Finnhub API (live stocks) · Open-Meteo (weather)       │   │
│  │  Sentry (error tracking) · Zod (validation)             │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 14](https://nextjs.org/) | App Router, SSR/SSG, API routes |
| [React 18](https://react.dev/) | UI components, hooks, error boundaries |
| [TypeScript 5](https://www.typescriptlang.org/) | Type safety across the codebase |
| [Tailwind CSS 3](https://tailwindcss.com/) | Utility-first styling, dark mode |
| [Sentry](https://sentry.io/) | Error tracking & performance monitoring |
| [Vercel KV](https://vercel.com/storage/kv) | Redis-compatible key-value store |
| [Zod](https://zod.dev/) | Runtime schema validation |
| [Jest](https://jestjs.io/) | Unit & integration testing |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- npm (comes with Node.js)

### Install Dependencies

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Run Tests

```bash
npm test
```

### Lint

```bash
npm run lint
```

### Analyze Bundle

```bash
npm run analyze
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ADMIN_PASS` | Yes | Password for CMS admin panel authentication |
| `KV_REST_API_URL` | No | Vercel KV instance URL for rate limiting & caching |
| `KV_REST_API_TOKEN` | No | Vercel KV REST API token |
| `FINNHUB_API_KEY` | No | Finnhub API key for live stock data (falls back to static data) |
| `NEXT_PUBLIC_SENTRY_DSN` | No | Sentry DSN for client-side error tracking |
| `SENTRY_ORG` | No | Sentry organization slug |
| `SENTRY_PROJECT` | No | Sentry project slug |

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

## Deployment

### Vercel (Recommended)

1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Configure environment variables in the Vercel dashboard.
4. Vercel auto-detects Next.js — click **Deploy**.
5. Your site will be live at a `.vercel.app` URL.

**Live deployment:** [https://yahoo-homepage.vercel.app](https://yahoo-homepage.vercel.app)

### Other Platforms

This is a standard Next.js application. It can be deployed to any platform that supports Node.js:

- **Netlify** — Use the `@netlify/plugin-nextjs` plugin.
- **AWS Amplify** — Import the repo and Amplify auto-detects Next.js.
- **Docker** — Build with `next build`, then serve with `next start` on port 3000.

## Uptime Monitoring

The application exposes health check endpoints for uptime monitoring services:

- **Health check:** [https://yahoo-homepage.vercel.app/api/health](https://yahoo-homepage.vercel.app/api/health)
- **Metrics:** [https://yahoo-homepage.vercel.app/api/metrics](https://yahoo-homepage.vercel.app/api/metrics)

Configure your uptime monitoring tool (e.g., UptimeRobot, Pingdom, Better Uptime) to poll `/api/health` and alert on non-200 responses.

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Tailwind directives and base styles
│   ├── layout.tsx           # Root layout with metadata & ErrorBoundary
│   ├── page.tsx             # Homepage composing all sections
│   ├── admin/               # CMS admin panel (dashboard, articles, settings)
│   └── api/                 # REST API endpoints
│       ├── health/route.ts  # Health check endpoint
│       ├── metrics/route.ts # App metrics endpoint
│       ├── articles/        # CRUD for articles
│       ├── stocks/          # Stock ticker data (Finnhub)
│       ├── weather/         # Weather data (Open-Meteo)
│       └── ...
├── components/
│   ├── ErrorBoundary.tsx    # React error boundary with Sentry
│   ├── ErrorFallback.tsx    # Friendly error page with retry
│   ├── Navbar.tsx           # Top navigation with mobile hamburger menu
│   ├── SearchBar.tsx        # Centered search form
│   ├── HeroNews.tsx         # Hero news card + side article list
│   ├── ContentColumns.tsx   # Three-column category news
│   ├── StockTicker.tsx      # Real-time stock ticker marquee
│   ├── Sidebar.tsx          # Weather, trending, ad placeholder
│   ├── Newsletter.tsx       # Email newsletter signup
│   └── Footer.tsx           # Footer links and copyright
├── hooks/                   # Custom React hooks
├── lib/                     # Utility libraries (KV, rate limiting, etc.)
└── data/                    # JSON data files
```

## Color Scheme

The primary brand color is Yahoo purple: `#6001D2`.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup instructions, coding standards, and PR process.

## License

This project is for demonstration purposes only and is not affiliated with Yahoo Inc.
