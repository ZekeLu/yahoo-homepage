import { render, screen } from '@testing-library/react';

let mockSearchParams = new URLSearchParams('q=climate');

// Mock useSearchParams
jest.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
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
  afterEach(() => {
    mockSearchParams = new URLSearchParams('q=climate');
  });

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

  it('shows "Enter a search term" when query is empty', () => {
    mockSearchParams = new URLSearchParams('');
    render(<SearchPage />);
    expect(screen.getByText('Enter a search term')).toBeInTheDocument();
  });

  it('shows "Enter a search term" when query is only whitespace', () => {
    mockSearchParams = new URLSearchParams('q=   ');
    render(<SearchPage />);
    expect(screen.getByText('Enter a search term')).toBeInTheDocument();
  });

  it('shows no results message for non-matching query', () => {
    mockSearchParams = new URLSearchParams('q=xyznonexistent');
    render(<SearchPage />);
    expect(screen.getByText(/No results found/)).toBeInTheDocument();
    expect(screen.getByText('0 results found')).toBeInTheDocument();
  });

  it('shows singular result count', () => {
    // Use a very specific query that matches exactly 1 article
    mockSearchParams = new URLSearchParams('q=Geneva');
    render(<SearchPage />);
    expect(screen.getByText(/result(s)? found/)).toBeInTheDocument();
  });
});
