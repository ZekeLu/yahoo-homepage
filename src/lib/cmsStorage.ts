const PREFIX = 'yahoo_cms_';

export function cmsGet<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function cmsSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // storage full or unavailable
  }
}

export function cmsRemove(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PREFIX + key);
}

export async function cmsGetOrSeed<T>(key: string, apiUrl: string): Promise<T> {
  const cached = cmsGet<T>(key);
  if (cached !== null) return cached;

  const res = await fetch(apiUrl);
  const data: T = await res.json();
  cmsSet(key, data);
  return data;
}
