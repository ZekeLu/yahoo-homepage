import { render, screen } from '@testing-library/react';
import AdminLayout from '@/app/admin/layout';

let mockPathname = '/admin';
const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => mockPathname,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));

describe('AdminLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children wrapped in AdminAuthProvider', () => {
    mockPathname = '/admin';
    render(
      <AdminLayout>
        <span>Dashboard Content</span>
      </AdminLayout>
    );
    expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
  });

  it('renders AdminSidebar for non-login pages', () => {
    mockPathname = '/admin';
    render(
      <AdminLayout>
        <span>Content</span>
      </AdminLayout>
    );
    expect(screen.getByText('Yahoo!')).toBeInTheDocument();
    expect(screen.getByText('CMS')).toBeInTheDocument();
  });

  it('does not render AdminSidebar for login page', () => {
    mockPathname = '/admin/login';
    render(
      <AdminLayout>
        <span>Login Form</span>
      </AdminLayout>
    );
    expect(screen.getByText('Login Form')).toBeInTheDocument();
    // Should not have the sidebar CMS text
    expect(screen.queryByText('CMS')).not.toBeInTheDocument();
  });

  it('renders sidebar with nav items for admin pages', () => {
    mockPathname = '/admin/articles';
    render(
      <AdminLayout>
        <span>Articles Page Content</span>
      </AdminLayout>
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Articles Page Content')).toBeInTheDocument();
    expect(screen.getByText('Trending Topics')).toBeInTheDocument();
  });
});
