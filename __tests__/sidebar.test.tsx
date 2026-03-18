import { render, screen, waitFor, act } from '@testing-library/react';
import Sidebar from '@/components/Sidebar';

const mockedFetch = global.fetch as jest.Mock;

describe('Sidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Weather heading', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        current: { temp_f: 75, description: 'Clear sky' },
        forecast: [
          { day: 'Mon', high_f: 78, low_f: 60 },
          { day: 'Tue', high_f: 80, low_f: 62 },
          { day: 'Wed', high_f: 76, low_f: 58 },
          { day: 'Thu', high_f: 74, low_f: 56 },
        ],
      }),
    });

    await act(async () => {
      render(<Sidebar />);
    });

    expect(screen.getByText('Weather')).toBeInTheDocument();
  });

  it('renders weather data from API', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        current: { temp_f: 75, description: 'Clear sky' },
        forecast: [
          { day: 'Mon', high_f: 78, low_f: 60 },
          { day: 'Tue', high_f: 80, low_f: 62 },
          { day: 'Wed', high_f: 76, low_f: 58 },
          { day: 'Thu', high_f: 74, low_f: 56 },
        ],
      }),
    });

    await act(async () => {
      render(<Sidebar />);
    });

    await waitFor(() => {
      expect(screen.getByText('75°F')).toBeInTheDocument();
      expect(screen.getByText('Clear sky')).toBeInTheDocument();
    });
  });

  it('shows default weather when API fails', async () => {
    mockedFetch.mockResolvedValueOnce({ ok: false });

    await act(async () => {
      render(<Sidebar />);
    });

    await waitFor(() => {
      expect(screen.getByText('72°F')).toBeInTheDocument();
      expect(screen.getByText('Partly Cloudy')).toBeInTheDocument();
    });
  });

  it('shows default weather when fetch rejects', async () => {
    mockedFetch.mockRejectedValueOnce(new Error('network'));

    await act(async () => {
      render(<Sidebar />);
    });

    await waitFor(() => {
      expect(screen.getByText('72°F')).toBeInTheDocument();
    });
  });

  it('renders default trending topics when no prop provided', async () => {
    mockedFetch.mockResolvedValueOnce({ ok: false });

    await act(async () => {
      render(<Sidebar />);
    });

    await waitFor(() => {
      expect(screen.getByText('Trending')).toBeInTheDocument();
      expect(screen.getByText('Climate Summit')).toBeInTheDocument();
      expect(screen.getByText('AI Regulation')).toBeInTheDocument();
    });
  });

  it('renders custom trending topics from prop', async () => {
    mockedFetch.mockResolvedValueOnce({ ok: false });
    const customTrending = ['Topic A', 'Topic B'];

    await act(async () => {
      render(<Sidebar trending={customTrending} />);
    });

    await waitFor(() => {
      expect(screen.getByText('Topic A')).toBeInTheDocument();
      expect(screen.getByText('Topic B')).toBeInTheDocument();
    });
  });

  it('renders trending topics as search links', async () => {
    mockedFetch.mockResolvedValueOnce({ ok: false });

    await act(async () => {
      render(<Sidebar />);
    });

    await waitFor(() => {
      const link = screen.getByText('Climate Summit').closest('a');
      expect(link).toHaveAttribute('href', '/search?q=Climate%20Summit');
    });
  });

  it('renders ad placeholder', async () => {
    mockedFetch.mockResolvedValueOnce({ ok: false });

    await act(async () => {
      render(<Sidebar />);
    });

    await waitFor(() => {
      expect(screen.getByText('Sponsored')).toBeInTheDocument();
      expect(screen.getByText('Advertisement')).toBeInTheDocument();
    });
  });

  it('shows "Weather data is illustrative" when no API data', async () => {
    mockedFetch.mockResolvedValueOnce({ ok: false });

    await act(async () => {
      render(<Sidebar />);
    });

    await waitFor(() => {
      expect(screen.getByText('Weather data is illustrative')).toBeInTheDocument();
    });
  });

  it('does not show illustrative message when API provides data', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        current: { temp_f: 75, description: 'Clear sky' },
        forecast: [
          { day: 'Mon', high_f: 78, low_f: 60 },
        ],
      }),
    });

    await act(async () => {
      render(<Sidebar />);
    });

    await waitFor(() => {
      expect(screen.queryByText('Weather data is illustrative')).not.toBeInTheDocument();
    });
  });

  it('renders weather emojis for various descriptions', async () => {
    const testCases = [
      { desc: 'Clear sky', emoji: '☀️' },
      { desc: 'Partly Cloudy', emoji: '⛅' },
      { desc: 'Foggy', emoji: '🌫️' },
      { desc: 'Thunderstorm', emoji: '⛈️' },
      { desc: 'Snow flurries', emoji: '❄️' },
      { desc: 'Rain showers', emoji: '🌧️' },
      { desc: 'Drizzle', emoji: '🌧️' },
      { desc: 'Light shower', emoji: '🌧️' },
      { desc: 'Windy and warm', emoji: '⛅' },
    ];

    for (const tc of testCases) {
      jest.clearAllMocks();
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          current: { temp_f: 70, description: tc.desc },
          forecast: [],
        }),
      });

      const { unmount } = await act(async () => {
        return render(<Sidebar />);
      });

      await waitFor(() => {
        expect(screen.getByLabelText(tc.desc).textContent).toBe(tc.emoji);
      });
      unmount();
    }
  });

  it('renders numbered badges for trending items', async () => {
    mockedFetch.mockResolvedValueOnce({ ok: false });

    await act(async () => {
      render(<Sidebar />);
    });

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  it('shows loading skeleton while fetching weather', () => {
    mockedFetch.mockReturnValue(new Promise(() => {})); // never resolves
    render(<Sidebar />);
    expect(screen.getByText('Weather')).toBeInTheDocument();
  });

  it('renders current date', async () => {
    mockedFetch.mockResolvedValueOnce({ ok: false });

    await act(async () => {
      render(<Sidebar />);
    });

    // formatCurrentDate returns something like "Tuesday, March 18"
    await waitFor(() => {
      const dateEl = screen.getByText(/\w+day, \w+ \d+/);
      expect(dateEl).toBeInTheDocument();
    });
  });
});
