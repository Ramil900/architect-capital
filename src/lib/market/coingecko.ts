const BASE_URL = "https://api.coingecko.com/api/v3";

const COIN_ID_MAP: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
};

export async function fetchCryptoPrice(coinId: string): Promise<number | null> {
  try {
    const key = process.env.COINGECKO_API_KEY;
    const headers: Record<string, string> = key ? { "x-cg-demo-api-key": key } : {};

    const res = await fetch(
      `${BASE_URL}/simple/price?ids=${coinId}&vs_currencies=usd`,
      { headers, next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    const json = await res.json();
    const price = json?.[coinId]?.usd as number | undefined;
    return price ?? null;
  } catch {
    return null;
  }
}

export interface CryptoQuote {
  ticker:         string;
  price:          number;
  dailyChange:    number;
  dailyChangePct: number;
}

export async function fetchCryptoPrices(tickers: string[]): Promise<CryptoQuote[]> {
  if (tickers.length === 0) return [];

  const pairs = tickers
    .map((t) => ({ ticker: t, coinId: COIN_ID_MAP[t] }))
    .filter((p): p is { ticker: string; coinId: string } => !!p.coinId);

  if (pairs.length === 0) return [];

  try {
    const key = process.env.COINGECKO_API_KEY;
    const headers: Record<string, string> = key ? { "x-cg-demo-api-key": key } : {};
    const ids = pairs.map((p) => p.coinId).join(",");

    const res = await fetch(
      `${BASE_URL}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      { headers, next: { revalidate: 300 } },
    );
    if (!res.ok) return [];

    const json = await res.json();
    return pairs.flatMap(({ ticker, coinId }) => {
      const data = json[coinId];
      if (!data?.usd) return [];
      const price: number = data.usd;
      const pct:   number = data.usd_24h_change ?? 0;
      const changeAbs = price * pct / 100;
      return [{ ticker, price, dailyChange: changeAbs, dailyChangePct: pct }];
    });
  } catch {
    return [];
  }
}
