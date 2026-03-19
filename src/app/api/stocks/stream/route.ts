import { NextResponse } from 'next/server';

const SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'BTC-USD'];

interface StockResult {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

const BASE_PRICES: Record<string, number> = {
  AAPL: 198.45,
  GOOGL: 175.82,
  MSFT: 442.31,
  AMZN: 201.15,
  TSLA: 245.90,
  META: 523.47,
  NVDA: 892.60,
  'BTC-USD': 101250.0,
};

function generateStockUpdate(): StockResult[] {
  return SYMBOLS.map((symbol) => {
    const base = BASE_PRICES[symbol];
    const volatility = symbol === 'BTC-USD' ? 0.03 : 0.015;
    const randomChange = (Math.random() - 0.5) * 2 * volatility * base;
    const price = Math.round((base + randomChange) * 100) / 100;
    const change = Math.round((price - base) * 100) / 100;
    const changePercent = Math.round((change / base) * 10000) / 100;
    return { symbol, price, change, changePercent };
  });
}

export const dynamic = 'force-dynamic';

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial data immediately
      const initial = generateStockUpdate();
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(initial)}\n\n`)
      );

      const interval = setInterval(() => {
        try {
          const stocks = generateStockUpdate();
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(stocks)}\n\n`)
          );
        } catch {
          clearInterval(interval);
          controller.close();
        }
      }, 10000);

      // Clean up on cancel
      const cleanup = () => {
        clearInterval(interval);
      };

      // Store cleanup for when the stream is cancelled
      (controller as unknown as Record<string, () => void>)._cleanup = cleanup;
    },
    cancel() {
      // Stream was cancelled by the client
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
