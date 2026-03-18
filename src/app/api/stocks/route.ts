import { NextResponse } from 'next/server';

const SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'BTC-USD'];

interface StockResult {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

async function fetchStock(symbol: string): Promise<StockResult | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const meta = data.chart?.result?.[0]?.meta;
    if (!meta) return null;

    const currentPrice = meta.regularMarketPrice ?? 0;
    const previousClose = meta.chartPreviousClose ?? meta.previousClose ?? currentPrice;
    const change = currentPrice - previousClose;
    const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;

    return {
      symbol,
      price: Math.round(currentPrice * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
    };
  } catch {
    return null;
  }
}

// Static fallback data
const FALLBACK: StockResult[] = [
  { symbol: 'AAPL', price: 198.45, change: 3.21, changePercent: 1.64 },
  { symbol: 'GOOGL', price: 175.82, change: -1.45, changePercent: -0.82 },
  { symbol: 'MSFT', price: 442.31, change: 5.67, changePercent: 1.30 },
  { symbol: 'AMZN', price: 201.15, change: 2.89, changePercent: 1.46 },
  { symbol: 'TSLA', price: 245.90, change: -4.32, changePercent: -1.73 },
  { symbol: 'META', price: 523.47, change: 8.15, changePercent: 1.58 },
  { symbol: 'NVDA', price: 892.60, change: 12.34, changePercent: 1.40 },
  { symbol: 'BTC-USD', price: 101250.00, change: 1875.50, changePercent: 1.89 },
];

export async function GET() {
  try {
    const results = await Promise.all(SYMBOLS.map(fetchStock));
    const stocks = results.map((result, i) => result ?? FALLBACK[i]);
    return NextResponse.json(stocks);
  } catch {
    return NextResponse.json(FALLBACK);
  }
}
