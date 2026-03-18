/**
 * @jest-environment node
 */

jest.mock('@vercel/kv', () => ({
  kv: { get: jest.fn(), set: jest.fn() },
}));

const originalFetch = global.fetch;

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  global.fetch = originalFetch;
});

import { GET } from '@/app/api/weather/route';

describe('GET /api/weather', () => {
  it('returns weather data from Open-Meteo API', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        current: { temperature_2m: 25, weathercode: 0 },
        daily: {
          time: ['2026-03-18', '2026-03-19', '2026-03-20', '2026-03-21'],
          temperature_2m_max: [28, 30, 27, 25],
          temperature_2m_min: [18, 20, 17, 15],
          weathercode: [0, 1, 45, 61],
        },
      }),
    }) as jest.Mock;

    const res = await GET();
    const data = await res.json();

    expect(data.current.temp_f).toBe(77); // 25°C = 77°F
    expect(data.current.description).toBe('Clear sky');
    expect(data.forecast).toHaveLength(4);
    expect(data.forecast[0]).toHaveProperty('day');
    expect(data.forecast[0]).toHaveProperty('high_f');
    expect(data.forecast[0]).toHaveProperty('low_f');
  });

  it('returns various weather descriptions based on code', async () => {
    const testCases = [
      { code: 0, expected: 'Clear sky' },
      { code: 2, expected: 'Partly Cloudy' },
      { code: 45, expected: 'Foggy' },
      { code: 51, expected: 'Drizzle' },
      { code: 56, expected: 'Freezing Drizzle' },
      { code: 61, expected: 'Rain' },
      { code: 66, expected: 'Freezing Rain' },
      { code: 71, expected: 'Snow' },
      { code: 80, expected: 'Showers' },
      { code: 95, expected: 'Thunderstorm' },
      { code: 100, expected: 'Unknown' },
    ];

    for (const tc of testCases) {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          current: { temperature_2m: 20, weathercode: tc.code },
          daily: { time: [], temperature_2m_max: [], temperature_2m_min: [], weathercode: [] },
        }),
      }) as jest.Mock;

      const res = await GET();
      const data = await res.json();
      expect(data.current.description).toBe(tc.expected);
    }
  });

  it('returns 500 when API returns non-ok response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 503,
    }) as jest.Mock;

    const res = await GET();
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('Failed to fetch weather data');
  });

  it('returns 500 when fetch throws', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network error')) as jest.Mock;

    const res = await GET();
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('Failed to fetch weather data');
  });

  it('converts Celsius to Fahrenheit correctly', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        current: { temperature_2m: 0, weathercode: 0 },
        daily: {
          time: ['2026-03-18'],
          temperature_2m_max: [100],
          temperature_2m_min: [-40],
          weathercode: [0],
        },
      }),
    }) as jest.Mock;

    const res = await GET();
    const data = await res.json();

    expect(data.current.temp_f).toBe(32); // 0°C = 32°F
    expect(data.forecast[0].high_f).toBe(212); // 100°C = 212°F
    expect(data.forecast[0].low_f).toBe(-40); // -40°C = -40°F
  });
});
