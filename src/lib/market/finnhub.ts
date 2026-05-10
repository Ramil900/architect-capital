const BASE_URL = "https://finnhub.io/api/v1";

function getApiKey(): string | undefined {
  return process.env.FINNHUB_API_KEY;
}

export interface FinnhubIndicatorResult {
  symbol: string;
  value:  number;
}

export async function fetchMarketIndicator(symbol: string): Promise<FinnhubIndicatorResult | null> {
  const key = getApiKey();
  if (!key) return null;

  try {
    const res = await fetch(`${BASE_URL}/quote?symbol=${symbol}&token=${key}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const value = json?.c as number | undefined;
    if (value === undefined || value === 0) return null;
    return { symbol, value };
  } catch {
    return null;
  }
}
