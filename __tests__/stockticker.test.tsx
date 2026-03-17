import { render, screen } from '@testing-library/react';
import StockTicker from '@/components/StockTicker';

describe('Stock ticker', () => {
  it('renders the ticker with stock symbols', () => {
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
    const { container } = render(<StockTicker />);
    const greenItems = container.querySelectorAll('.text-green-400');
    const redItems = container.querySelectorAll('.text-red-400');
    expect(greenItems.length).toBeGreaterThan(0);
    expect(redItems.length).toBeGreaterThan(0);
  });
});
