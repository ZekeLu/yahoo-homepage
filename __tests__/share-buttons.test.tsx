import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShareButtons from '@/components/ShareButtons';

describe('ShareButtons', () => {
  const props = { title: 'Test Article', slug: 'test-article' };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders Twitter/X share link with correct URL', () => {
    render(<ShareButtons {...props} />);
    const twitterLink = screen.getByRole('link', { name: /share on x/i });
    expect(twitterLink).toBeInTheDocument();
    expect(twitterLink).toHaveAttribute(
      'href',
      expect.stringContaining('twitter.com/intent/tweet')
    );
    expect(twitterLink).toHaveAttribute('href', expect.stringContaining('Test%20Article'));
    expect(twitterLink).toHaveAttribute('target', '_blank');
    expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders Facebook share link with correct URL', () => {
    render(<ShareButtons {...props} />);
    const fbLink = screen.getByRole('link', { name: /share on facebook/i });
    expect(fbLink).toBeInTheDocument();
    expect(fbLink).toHaveAttribute(
      'href',
      expect.stringContaining('facebook.com/sharer/sharer.php')
    );
    expect(fbLink).toHaveAttribute('target', '_blank');
  });

  it('renders copy link button', () => {
    render(<ShareButtons {...props} />);
    expect(screen.getByRole('button', { name: /copy link/i })).toBeInTheDocument();
  });

  it('copies article URL on copy button click and shows tooltip', async () => {
    jest.useRealTimers(); // use real timers for async clipboard
    const writeTextMock = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true,
    });

    render(<ShareButtons {...props} />);
    const copyBtn = screen.getByRole('button', { name: /copy link/i });

    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith(
        'https://yahoo-homepage.vercel.app/article/test-article'
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });

  it('hides copied tooltip after 2 seconds', async () => {
    const writeTextMock = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true,
    });

    jest.useRealTimers();
    render(<ShareButtons {...props} />);
    const copyBtn = screen.getByRole('button', { name: /copy link/i });

    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });

    // Wait for tooltip to disappear (2s timeout)
    await waitFor(() => {
      expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('handles clipboard failure gracefully', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: jest.fn().mockRejectedValue(new Error('fail')) },
      writable: true,
      configurable: true,
    });

    render(<ShareButtons {...props} />);
    const copyBtn = screen.getByRole('button', { name: /copy link/i });

    fireEvent.click(copyBtn);

    // Should still show Copied even if clipboard fails
    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });

  it('stops propagation on share link clicks', () => {
    render(<ShareButtons {...props} />);
    const twitterLink = screen.getByRole('link', { name: /share on x/i });

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    const stopPropSpy = jest.spyOn(event, 'stopPropagation');
    twitterLink.dispatchEvent(event);
    expect(stopPropSpy).toHaveBeenCalled();
  });

  it('stops propagation on copy button click', () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: jest.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    });

    render(<ShareButtons {...props} />);
    const copyBtn = screen.getByRole('button', { name: /copy link/i });

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    const stopPropSpy = jest.spyOn(event, 'stopPropagation');
    copyBtn.dispatchEvent(event);
    expect(stopPropSpy).toHaveBeenCalled();
  });
});
