'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Stock {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

const fallbackStocks: Stock[] = [
  { symbol: "AAPL", price: 198.45, change: 3.21, changePercent: 1.64 },
  { symbol: "GOOGL", price: 175.82, change: -1.45, changePercent: -0.82 },
  { symbol: "MSFT", price: 442.31, change: 5.67, changePercent: 1.30 },
  { symbol: "AMZN", price: 201.15, change: 2.89, changePercent: 1.46 },
  { symbol: "TSLA", price: 245.90, change: -4.32, changePercent: -1.73 },
  { symbol: "META", price: 523.47, change: 8.15, changePercent: 1.58 },
  { symbol: "NVDA", price: 892.60, change: 12.34, changePercent: 1.40 },
  { symbol: "BTC-USD", price: 101250.00, change: 1875.50, changePercent: 1.89 },
];

function TickerItem({ stock, flash }: { stock: Stock; flash: 'up' | 'down' | null }) {
  const isUp = stock.change >= 0;
  const flashClass =
    flash === 'up'
      ? 'animate-flash-green'
      : flash === 'down'
        ? 'animate-flash-red'
        : '';

  return (
    <span className={`inline-flex items-center gap-2 whitespace-nowrap px-4 transition-colors duration-300 ${flashClass}`}>
      <span className="font-semibold text-white">{stock.symbol}</span>
      <span className="text-gray-300">
        {stock.symbol === "BTC-USD"
          ? `$${stock.price.toLocaleString("en-US", { minimumFractionDigits: 0 })}`
          : `$${stock.price.toFixed(2)}`}
      </span>
      <span className={isUp ? "text-green-400" : "text-red-400"}>
        {isUp ? "+" : ""}
        {stock.change.toFixed(2)} ({isUp ? "+" : ""}
        {stock.changePercent.toFixed(2)}%)
      </span>
    </span>
  );
}

export default function StockTicker() {
  const [stocks, setStocks] = useState<Stock[]>(fallbackStocks);
  const [loading, setLoading] = useState(true);
  const [flashes, setFlashes] = useState<Record<string, 'up' | 'down' | null>>({});
  const prevPricesRef = useRef<Record<string, number>>({});

  const updateStocks = useCallback((newStocks: Stock[]) => {
    const prev = prevPricesRef.current;
    const newFlashes: Record<string, 'up' | 'down' | null> = {};

    newStocks.forEach((stock) => {
      if (prev[stock.symbol] !== undefined && prev[stock.symbol] !== stock.price) {
        newFlashes[stock.symbol] = stock.price > prev[stock.symbol] ? 'up' : 'down';
      } else {
        newFlashes[stock.symbol] = null;
      }
      prev[stock.symbol] = stock.price;
    });

    setFlashes(newFlashes);
    setStocks(newStocks);
    setLoading(false);

    // Clear flashes after animation
    setTimeout(() => {
      setFlashes({});
    }, 1000);
  }, []);

  useEffect(() => {
    // First, do a regular fetch to get initial data
    fetch('/api/stocks')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: Stock[]) => {
        if (Array.isArray(data) && data.length > 0) {
          data.forEach((s) => { prevPricesRef.current[s.symbol] = s.price; });
          setStocks(data);
        }
      })
      .catch(() => { /* keep fallback */ })
      .finally(() => setLoading(false));

    // Then connect to SSE for live updates
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/stocks/stream');

      eventSource.onmessage = (event) => {
        try {
          const data: Stock[] = JSON.parse(event.data);
          if (Array.isArray(data) && data.length > 0) {
            updateStocks(data);
          }
        } catch {
          // ignore parse errors
        }
      };

      eventSource.onerror = () => {
        // SSE will auto-reconnect; we just keep the last known data
      };
    } catch {
      // EventSource not supported or failed to create
    }

    return () => {
      eventSource?.close();
    };
  }, [updateStocks]);

  const tickerContent = (
    <>
      {stocks.map((stock) => (
        <TickerItem key={stock.symbol} stock={stock} flash={flashes[stock.symbol] ?? null} />
      ))}
    </>
  );

  return (
    <div
      className={`overflow-hidden bg-gray-900 py-2 text-sm transition-opacity ${loading ? 'opacity-60' : 'opacity-100'}`}
      aria-label="Stock ticker"
      role="marquee"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="ticker-scroll flex">
        <div className="flex shrink-0">{tickerContent}</div>
        <div className="flex shrink-0" aria-hidden="true">{tickerContent}</div>
      </div>
    </div>
  );
}
