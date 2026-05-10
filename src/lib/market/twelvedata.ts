const BASE_URL = "https://api.twelvedata.com";

function getApiKey(): string | undefined {
  return process.env.TWELVEDATA_API_KEY;
}

export async function fetchStockPrice(ticker: string): Promise<number | null> {
  const key = getApiKey();
  if (!key) return null;

  try {
    const res = await fetch(`${BASE_URL}/price?symbol=${ticker}&apikey=${key}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const price = parseFloat(json?.price);
    return isNaN(price) ? null : price;
  } catch {
    return null;
  }
}

export interface StockQuote {
  ticker:         string;
  price:          number;
  dailyChange:    number;
  dailyChangePct: number;
}

export async function fetchStockQuotes(tickers: string[]): Promise<StockQuote[]> {
  const key = getApiKey();
  if (!key || tickers.length === 0) return [];

  try {
    const res = await fetch(
      `${BASE_URL}/quote?symbol=${tickers.join(",")}&apikey=${key}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const json = await res.json();

    function parseEntry(ticker: string, data: Record<string, unknown>): StockQuote | null {
      const price = parseFloat(data.close as string);
      if (isNaN(price) || price <= 0) return null;
      const change = parseFloat(data.change as string);
      const pct    = parseFloat(data.percent_change as string);
      return {
        ticker,
        price,
        dailyChange:    isNaN(change) ? 0 : change,
        dailyChangePct: isNaN(pct)    ? 0 : pct,
      };
    }

    if (tickers.length === 1) {
      const entry = parseEntry(tickers[0], json as Record<string, unknown>);
      return entry ? [entry] : [];
    }

    return tickers.flatMap((ticker) => {
      const data = (json as Record<string, unknown>)[ticker];
      if (!data || typeof data !== "object") return [];
      const entry = parseEntry(ticker, data as Record<string, unknown>);
      return entry ? [entry] : [];
    });
  } catch {
    return [];
  }
}
