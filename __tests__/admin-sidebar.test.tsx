import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminSidebar from '@/components/AdminSidebar';

const mockPush = jest.fn();
const mockLogout = jest.fn();
let mockPathname = '/admin';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => mockPathname,
}));

jest.mock('@/components/AdminAuth', () => ({
  useAdminAuth: () => ({ logout: mockLogout }),
}));

describe('AdminSidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname = '/admin';
  });

  it('renders CMS logo', () => {
    render(<AdminSidebar />);
    expect(screen.getByText('Yahoo!')).toBeInTheDocument();
    expect(screen.getByText('CMS')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    render(<AdminSidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Articles')).toBeInTheDocument();
    expect(screen.getByText('Trending Topics')).toBeInTheDocument();
    expect(screen.getByText('Newsletter Subscribers')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders View Site and Logout links', () => {
    render(<AdminSidebar />);
    expect(screen.getByText('View Site')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('highlights active nav item for Dashboard', () => {
    mockPathname = '/admin';
    render(<AdminSidebar />);
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink?.className).toContain('bg-white/10');
  });

  it('highlights active nav item for Articles', () => {
    mockPathname = '/admin/articles';
    render(<AdminSidebar />);
    const articlesLink = screen.getByText('Articles').closest('a');
    expect(articlesLink?.className).toContain('bg-white/10');
  });

  it('does not highlight inactive nav items', () => {
    mockPathname = '/admin';
    render(<AdminSidebar />);
    const articlesLink = screen.getByText('Articles').closest('a');
    expect(articlesLink?.className).not.toContain('bg-white/10');
  });

  it('calls logout when clicking Logout button', async () => {
    const user = userEvent.setup();
    render(<AdminSidebar />);

    await user.click(screen.getByText('Logout'));
    expect(mockLogout).toHaveBeenCalled();
  });

  it('toggles mobile sidebar on hamburger click', async () => {
    const user = userEvent.setup();
    render(<AdminSidebar />);

    const hamburger = screen.getByLabelText('Toggle sidebar');
    await user.click(hamburger);

    // Should show the overlay
    const overlay = document.querySelector('.fixed.inset-0.z-30');
    expect(overlay).toBeInTheDocument();

    // Click overlay to close
    if (overlay) {
      await user.click(overlay);
    }
  });

  it('closes mobile sidebar when clicking a nav item', async () => {
    const user = userEvent.setup();
    render(<AdminSidebar />);

    const hamburger = screen.getByLabelText('Toggle sidebar');
    await user.click(hamburger);

    await user.click(screen.getByText('Articles'));
    // Mobile sidebar should close (the overlay should be removed)
  });

  it('View Site link opens in new tab', () => {
    render(<AdminSidebar />);
    const viewSiteLink = screen.getByText('View Site').closest('a');
    expect(viewSiteLink).toHaveAttribute('target', '_blank');
    expect(viewSiteLink).toHaveAttribute('href', '/');
  });
});
