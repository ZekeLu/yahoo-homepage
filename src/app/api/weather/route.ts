import { NextResponse } from 'next/server';

function weatherCodeToDescription(code: number): string {
  if (code === 0) return 'Clear sky';
  if (code >= 1 && code <= 3) return 'Partly Cloudy';
  if (code >= 45 && code <= 48) return 'Foggy';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 56 && code <= 57) return 'Freezing Drizzle';
  if (code >= 61 && code <= 65) return 'Rain';
  if (code >= 66 && code <= 67) return 'Freezing Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Showers';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return 'Unknown';
}

function celsiusToFahrenheit(c: number): number {
  return Math.round(c * 9 / 5 + 32);
}

export async function GET() {
  try {
    const url =
      'https://api.open-meteo.com/v1/forecast?latitude=25.01&longitude=121.46&current=temperature_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Asia%2FTaipei&forecast_days=4';

    const res = await fetch(url, { next: { revalidate: 600 } });

    if (!res.ok) {
      throw new Error(`Open-Meteo API returned ${res.status}`);
    }

    const data = await res.json();

    const current = {
      temp_f: celsiusToFahrenheit(data.current.temperature_2m),
      description: weatherCodeToDescription(data.current.weathercode),
    };

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const forecast = data.daily.time.map((dateStr: string, i: number) => {
      const date = new Date(dateStr + 'T00:00:00');
      return {
        day: dayNames[date.getDay()],
        high_f: celsiusToFahrenheit(data.daily.temperature_2m_max[i]),
        low_f: celsiusToFahrenheit(data.daily.temperature_2m_min[i]),
      };
    });

    return NextResponse.json({ current, forecast });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
