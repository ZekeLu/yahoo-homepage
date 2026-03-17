import { render, screen } from '@testing-library/react';

// Mock useSearchParams
jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('q=climate'),
  useParams: () => ({}),
}));

// Mock IntersectionObserver
beforeAll(() => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
});

import SearchPage from '@/app/search/page';

describe('Search results page', () => {
  it('renders search results heading for a query', () => {
    render(<SearchPage />);
    expect(screen.getByText(/search results for "climate"/i)).toBeInTheDocument();
  });

  it('shows result count', () => {
    render(<SearchPage />);
    expect(screen.getByText(/found/i)).toBeInTheDocument();
  });

  it('shows matching articles', () => {
    render(<SearchPage />);
    expect(screen.getByText(/Climate Summit/i)).toBeInTheDocument();
  });
});
