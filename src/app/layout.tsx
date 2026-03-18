import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import { WebVitals } from "@/components/WebVitals";
import { JsonLd } from "@/components/JsonLd";
import ErrorBoundary from "@/components/ErrorBoundary";

const SITE_URL = "https://yahoo-homepage.vercel.app";

export const metadata: Metadata = {
  title: "Yahoo! Portal — News, Finance, Sports & Entertainment",
  description:
    "Your daily portal for top stories, financial news, sports updates and entertainment.",
  keywords: [
    "Yahoo",
    "news",
    "finance",
    "sports",
    "entertainment",
    "technology",
    "stock market",
    "breaking news",
  ],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Yahoo! Portal — News, Finance, Sports & Entertainment",
    description:
      "Your daily portal for top stories, financial news, sports updates and entertainment.",
    url: SITE_URL,
    siteName: "Yahoo! Portal",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Yahoo! Portal — News, Finance, Sports & Entertainment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yahoo! Portal — News, Finance, Sports & Entertainment",
    description:
      "Your daily portal for top stories, financial news, sports updates and entertainment.",
    site: "@Yahoo",
    creator: "@Yahoo",
    images: [`${SITE_URL}/og-image.png`],
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  other: {
    "theme-color": "#6001D2",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Yahoo! Portal",
  url: SITE_URL,
  description:
    "Your daily portal for top stories, financial news, sports updates and entertainment.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "NewsMediaOrganization",
  name: "Yahoo! Portal",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo.png`,
    width: 600,
    height: 60,
  },
  sameAs: [
    "https://twitter.com/Yahoo",
    "https://www.facebook.com/Yahoo",
    "https://www.linkedin.com/company/yahoo",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://finnhub.io" />
        <link rel="dns-prefetch" href="https://finnhub.io" />
        <link rel="preconnect" href="https://picsum.photos" />
        <link rel="dns-prefetch" href="https://picsum.photos" />
        <link rel="preconnect" href="https://api.open-meteo.com" />
        <link rel="dns-prefetch" href="https://api.open-meteo.com" />
      </head>
      <body className="antialiased">
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        <ThemeProvider>
          <JsonLd data={websiteSchema} />
          <JsonLd data={organizationSchema} />
          <WebVitals />
          <ErrorBoundary name="RootLayout">
            {children}
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
