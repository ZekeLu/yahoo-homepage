import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';

describe('Footer', () => {
  it('renders footer navigation links', () => {
    render(<Footer />);
    expect(screen.getByRole('navigation', { name: /footer navigation/i })).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();
    expect(screen.getByText('Terms')).toBeInTheDocument();
    expect(screen.getByText('Privacy')).toBeInTheDocument();
  });

  it('renders copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2026 Yahoo/)).toBeInTheDocument();
  });

  it('has correct link hrefs', () => {
    render(<Footer />);
    expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about');
    expect(screen.getByText('Help').closest('a')).toHaveAttribute('href', '/help');
    expect(screen.getByText('Terms').closest('a')).toHaveAttribute('href', '/terms');
    expect(screen.getByText('Privacy').closest('a')).toHaveAttribute('href', '/privacy');
  });

  it('renders links in a list', () => {
    render(<Footer />);
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(4);
  });
});
