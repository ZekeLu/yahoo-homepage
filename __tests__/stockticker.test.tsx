import { render, screen, waitFor, act } from '@testing-library/react';
import StockTicker from '@/components/StockTicker';

const mockedFetch = global.fetch as jest.Mock;

describe('Stock ticker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the ticker with stock symbols', () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });
    render(<StockTicker />);
    expect(screen.getAllByText('AAPL').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('GOOGL').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('MSFT').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('TSLA').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('META').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('NVDA').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('BTC-USD').length).toBeGreaterThanOrEqual(1);
  });

  it('shows price changes with correct colors', () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });
    const { container } = render(<StockTicker />);
    const greenItems = container.querySelectorAll('.text-green-400');
    const redItems = container.querySelectorAll('.text-red-400');
    expect(greenItems.length).toBeGreaterThan(0);
    expect(redItems.length).toBeGreaterThan(0);
  });

  it('updates stocks when API returns valid data', async () => {
    const apiStocks = [
      { symbol: 'AAPL', price: 250.00, change: 10.00, changePercent: 4.00 },
      { symbol: 'GOOGL', price: 200.00, change: -5.00, changePercent: -2.50 },
    ];
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(apiStocks),
    });

    await act(async () => {
      render(<StockTicker />);
    });

    await waitFor(() => {
      expect(screen.getAllByText('$250.00').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('keeps fallback when API returns non-ok', async () => {
    mockedFetch.mockResolvedValueOnce({ ok: false });

    await act(async () => {
      render(<StockTicker />);
    });

    await waitFor(() => {
      expect(screen.getAllByText('AAPL').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('keeps fallback when API returns empty array', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await act(async () => {
      render(<StockTicker />);
    });

    await waitFor(() => {
      expect(screen.getAllByText('AAPL').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('keeps fallback when fetch rejects', async () => {
    mockedFetch.mockRejectedValueOnce(new Error('fail'));

    await act(async () => {
      render(<StockTicker />);
    });

    await waitFor(() => {
      expect(screen.getAllByText('AAPL').length).toBeGreaterThanOrEqual(1);
    });
  });
});
