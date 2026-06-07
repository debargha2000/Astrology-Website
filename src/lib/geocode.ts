export interface GeoResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  admin1?: string;
}

export async function geocodeCity(query: string): Promise<GeoResult[]> {
  if (!query || query.trim().length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=5&language=en&format=json`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results) return [];
    return data.results.map((r: Record<string, unknown>) => ({
      name: r.name as string,
      country: (r.country as string) || '',
      latitude: r.latitude as number,
      longitude: r.longitude as number,
      timezone: (r.timezone as string) || 'UTC',
      admin1: r.admin1 as string | undefined,
    }));
  } catch {
    return [];
  }
}
