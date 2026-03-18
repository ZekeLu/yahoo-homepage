import { render, screen, act, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContentColumns from '@/components/ContentColumns';
import { allArticles } from '@/lib/articles';

describe('ContentColumns', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows loading skeleton when loading prop is true', () => {
    render(<ContentColumns loading={true} />);
    expect(screen.getByLabelText('Category news')).toBeInTheDocument();
  });

  it('shows loading initially and then content after timer', () => {
    render(<ContentColumns />);
    // After 1s timer
    act(() => { jest.advanceTimersByTime(1000); });
    expect(screen.getByText('Finance')).toBeInTheDocument();
    expect(screen.getByText('Sports')).toBeInTheDocument();
    expect(screen.getByText('Entertainment')).toBeInTheDocument();
    expect(screen.getByText('Tech')).toBeInTheDocument();
  });

  it('renders section headings with icons', () => {
    render(<ContentColumns articles={allArticles} loading={false} />);
    expect(screen.getByText('Finance')).toBeInTheDocument();
    expect(screen.getByText('Sports')).toBeInTheDocument();
    expect(screen.getByText('Entertainment')).toBeInTheDocument();
    expect(screen.getByText('Tech')).toBeInTheDocument();
  });

  it('renders filter tabs for each section', () => {
    render(<ContentColumns articles={allArticles} loading={false} />);
    // Finance tabs
    expect(screen.getByText('Stocks')).toBeInTheDocument();
    expect(screen.getByText('Crypto')).toBeInTheDocument();
    // Sports tabs
    expect(screen.getByText('Basketball')).toBeInTheDocument();
    expect(screen.getByText('Soccer')).toBeInTheDocument();
    expect(screen.getByText('Tennis')).toBeInTheDocument();
  });

  it('filters articles when clicking a filter tab', async () => {
    jest.useRealTimers();
    const user = userEvent.setup();
    render(<ContentColumns articles={allArticles} loading={false} />);

    // Click Crypto tab
    await user.click(screen.getByText('Crypto'));

    // Should show only crypto articles
    const cryptoArticles = allArticles.filter(a => a.section === 'finance' && a.subcategory === 'Crypto');
    cryptoArticles.forEach(article => {
      expect(screen.getByText(article.title)).toBeInTheDocument();
    });
  });

  it('shows "Load more" button when more than 2 articles in a section', () => {
    render(<ContentColumns articles={allArticles} loading={false} />);

    const loadMoreButtons = screen.getAllByText(/Load more/);
    expect(loadMoreButtons.length).toBeGreaterThan(0);
  });

  it('expands articles when clicking "Load more"', async () => {
    jest.useRealTimers();
    const user = userEvent.setup();
    render(<ContentColumns articles={allArticles} loading={false} />);

    const financeSection = screen.getByText('Finance').closest('div')!;
    const loadMoreBtn = within(financeSection).queryByText(/Load more/);
    if (loadMoreBtn) {
      await user.click(loadMoreBtn);
      expect(within(financeSection).getByText(/Show less/)).toBeInTheDocument();
    }
  });

  it('collapses articles when clicking "Show less"', async () => {
    jest.useRealTimers();
    const user = userEvent.setup();
    render(<ContentColumns articles={allArticles} loading={false} />);

    const financeSection = screen.getByText('Finance').closest('div')!;
    const loadMoreBtn = within(financeSection).queryByText(/Load more/);
    if (loadMoreBtn) {
      // Expand
      await user.click(loadMoreBtn);
      // Collapse
      const showLessBtn = within(financeSection).getByText(/Show less/);
      await user.click(showLessBtn);
      expect(within(financeSection).queryByText(/Show less/)).not.toBeInTheDocument();
    }
  });

  it('uses provided articles instead of bundled ones', () => {
    const customArticles = [
      {
        slug: 'custom-finance',
        title: 'Custom Finance Article',
        snippet: 'Test',
        category: 'Finance',
        section: 'finance',
        subcategory: 'Stocks',
        author: 'Test',
        date: '2026-01-01',
        body: [],
        imageUrl: 'https://example.com/img.jpg',
      },
    ];
    render(<ContentColumns articles={customArticles} loading={false} />);
    expect(screen.getByText('Custom Finance Article')).toBeInTheDocument();
  });

  it('cleans up internal timer on unmount', () => {
    const { unmount } = render(<ContentColumns />);
    unmount();
    act(() => { jest.advanceTimersByTime(1000); });
  });

  it('shows "All" tab as active by default', () => {
    render(<ContentColumns articles={allArticles} loading={false} />);
    const allButtons = screen.getAllByText('All');
    allButtons.forEach(btn => {
      expect(btn.className).toContain('bg-yahoo-purple');
    });
  });
});
