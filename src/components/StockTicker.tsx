'use client';

import { useState, useEffect } from 'react';

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

function TickerItem({ stock }: { stock: Stock }) {
  const isUp = stock.change >= 0;
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap px-4">
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

  useEffect(() => {
    fetch('/api/stocks')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: Stock[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setStocks(data);
        }
      })
      .catch(() => { /* keep fallback */ })
      .finally(() => setLoading(false));
  }, []);

  const tickerContent = (
    <>
      {stocks.map((stock) => (
        <TickerItem key={stock.symbol} stock={stock} />
      ))}
    </>
  );

  return (
    <div
      className={`overflow-hidden bg-gray-900 py-2 text-sm transition-opacity ${loading ? 'opacity-60' : 'opacity-100'}`}
      aria-label="Stock ticker"
      role="marquee"
    >
      <div className="ticker-scroll flex">
        <div className="flex shrink-0">{tickerContent}</div>
        <div className="flex shrink-0" aria-hidden="true">{tickerContent}</div>
      </div>
    </div>
  );
}
