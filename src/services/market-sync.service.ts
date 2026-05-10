import { createServerClient } from "@/lib/supabase/server";
import { fetchStockPrice } from "@/lib/market/twelvedata";
import { fetchMarketIndicator } from "@/lib/market/finnhub";

export interface SyncResult {
  syncedPricesCount:     number;
  syncedIndicatorsCount: number;
  source:                string;
  errors:                string[];
  syncedAt:              string;
}

const PORTFOLIO_TICKERS: string[] = [
  "VOO", "QQQ", "SOXX", "SMH", "GLD", "SLV", "BTC", "ETH", "BRK.B", "TSLA",
];

const INDICATOR_SYMBOLS: string[] = [
  "VIX", "DXY", "US10Y", "SPX", "IXIC", "XAU", "XAG", "BTC", "ETH",
];

export async function syncMarketPrices(): Promise<{ count: number; errors: string[]; source: string }> {
  const errors: string[] = [];

  if (!process.env.TWELVEDATA_API_KEY) {
    return { count: 0, errors: [], source: "demo" };
  }

  const now  = new Date().toISOString();
  const rows: { ticker: string; price: number; source: string; recorded_at: string }[] = [];

  await Promise.all(
    PORTFOLIO_TICKERS.map(async (ticker) => {
      try {
        const price = await fetchStockPrice(ticker);
        if (price !== null && price > 0) {
          rows.push({ ticker, price, source: "external", recorded_at: now });
        }
      } catch (e) {
        errors.push(`${ticker}: ${e instanceof Error ? e.message : "fetch failed"}`);
      }
    }),
  );

  if (rows.length === 0) return { count: 0, errors, source: "demo" };

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = await createServerClient() as any;
    const { error } = await supabase
      .from("market_prices")
      .upsert(rows, { onConflict: "ticker" });
    if (error) errors.push(`DB upsert: ${error.message}`);
  } catch (e) {
    errors.push(`DB error: ${e instanceof Error ? e.message : "unknown"}`);
    return { count: 0, errors, source: "demo" };
  }

  return { count: rows.length, errors, source: "external" };
}

export async function syncMarketIndicators(): Promise<{ count: number; errors: string[]; source: string }> {
  const errors: string[] = [];

  if (!process.env.FINNHUB_API_KEY) {
    return { count: 0, errors: [], source: "demo" };
  }

  const results = await Promise.allSettled(
    INDICATOR_SYMBOLS.map((sym) => fetchMarketIndicator(sym)),
  );

  let count = 0;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = await createServerClient() as any;

    for (let i = 0; i < results.length; i++) {
      const res = results[i];
      if (res.status === "rejected") {
        errors.push(`${INDICATOR_SYMBOLS[i]}: ${res.reason}`);
        continue;
      }
      const data = res.value;
      if (!data) continue;

      const { error } = await supabase
        .from("market_indicators")
        .update({ value: data.value, recorded_at: new Date().toISOString() })
        .eq("symbol", data.symbol);

      if (error) {
        errors.push(`${data.symbol} update: ${error.message}`);
      } else {
        count++;
      }
    }
  } catch (e) {
    errors.push(`DB error: ${e instanceof Error ? e.message : "unknown"}`);
    return { count: 0, errors, source: "demo" };
  }

  return { count, errors, source: count > 0 ? "external" : "demo" };
}

export async function syncAllMarketData(): Promise<SyncResult> {
  const syncedAt = new Date().toISOString();

  const [prices, indicators] = await Promise.all([
    syncMarketPrices(),
    syncMarketIndicators(),
  ]);

  const source = prices.source === "external" || indicators.source === "external"
    ? "external"
    : "demo";

  return {
    syncedPricesCount:     prices.count,
    syncedIndicatorsCount: indicators.count,
    source,
    errors:                [...prices.errors, ...indicators.errors],
    syncedAt,
  };
}
