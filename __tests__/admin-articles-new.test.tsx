import { render, screen } from '@testing-library/react';
import NewArticlePage from '@/app/admin/articles/new/page';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('NewArticlePage', () => {
  it('renders page heading', () => {
    render(<NewArticlePage />);
    expect(screen.getByText('New Article')).toBeInTheDocument();
    expect(screen.getByText('Create a new article for the homepage')).toBeInTheDocument();
  });

  it('renders ArticleForm component', () => {
    render(<NewArticlePage />);
    expect(screen.getByText('Create Article')).toBeInTheDocument();
  });
});
