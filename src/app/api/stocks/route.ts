import { NextResponse } from 'next/server';
import { kvGet, kvSetWithTTL } from '@/lib/kv';

const SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'BTC-USD'];
const CACHE_KEY = 'stocks_cache';
const CACHE_TTL = 300; // 5 minutes

interface StockResult {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

interface FinnhubQuote {
  c: number;  // current price
  d: number;  // change
  dp: number; // percent change
  h: number;  // high
  l: number;  // low
  o: number;  // open
  pc: number; // previous close
}

async function fetchFinnhubQuote(
  symbol: string,
  apiKey: string
): Promise<StockResult | null> {
  const finnhubSymbol = symbol === 'BTC-USD' ? 'BINANCE:BTCUSDT' : symbol;

  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${finnhubSymbol}&token=${apiKey}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`Finnhub returned ${res.status} for ${symbol}`);
      return null;
    }
    const data: FinnhubQuote = await res.json();

    if (!data.c || data.c === 0) return null;

    return {
      symbol,
      price: Math.round(data.c * 100) / 100,
      change: Math.round(data.d * 100) / 100,
      changePercent: Math.round(data.dp * 100) / 100,
    };
  } catch (err) {
    console.error(`Finnhub fetch error for ${symbol}:`, err);
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
    // Check KV cache first
    const cached = await kvGet<StockResult[]>(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached);
    }

    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) {
      return NextResponse.json(FALLBACK);
    }

    const results = await Promise.all(
      SYMBOLS.map((s) => fetchFinnhubQuote(s, apiKey))
    );
    const stocks = results.map((result, i) => result ?? FALLBACK[i]);

    // Cache results in KV for 5 minutes
    await kvSetWithTTL(CACHE_KEY, stocks, CACHE_TTL);

    return NextResponse.json(stocks);
  } catch {
    return NextResponse.json(FALLBACK);
  }
}
