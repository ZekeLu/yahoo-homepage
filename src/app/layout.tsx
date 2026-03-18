import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Yahoo! Portal — News, Finance, Sports & Entertainment",
  description:
    "Your daily portal for top stories, financial news, sports updates and entertainment.",
  openGraph: {
    title: "Yahoo! Portal — News, Finance, Sports & Entertainment",
    description: "Your daily portal for top stories, financial news, sports updates and entertainment.",
    url: "https://yahoo-homepage.vercel.app",
    siteName: "Yahoo! Portal",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yahoo! Portal — News, Finance, Sports & Entertainment",
    description: "Your daily portal for top stories, financial news, sports updates and entertainment.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
