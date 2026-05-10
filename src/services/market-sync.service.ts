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

const PRICE_TICKERS: string[] = [
  "VOO", "BRK.B", "AAPL", "MSFT", "GOOGL", "AMZN", "JPM", "GLD",
];

const INDICATOR_SYMBOLS: string[] = [
  "^VIX", "^GSPC", "^TNX", "DX-Y.NYB",
];

export async function syncMarketPrices(): Promise<{ count: number; errors: string[] }> {
  const errors: string[] = [];

  if (!process.env.TWELVEDATA_API_KEY) {
    return { count: 0, errors: ["TWELVEDATA_API_KEY not configured"] };
  }

  const rows: { ticker: string; price: number; recorded_at: string }[] = [];
  const now = new Date().toISOString();

  await Promise.all(
    PRICE_TICKERS.map(async (ticker) => {
      try {
        const price = await fetchStockPrice(ticker);
        if (price !== null) rows.push({ ticker, price, recorded_at: now });
      } catch (e) {
        errors.push(`${ticker}: ${e instanceof Error ? e.message : "fetch failed"}`);
      }
    }),
  );

  if (rows.length === 0) return { count: 0, errors };

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = await createServerClient() as any;
    const { error } = await supabase.from("market_prices").upsert(rows, { onConflict: "ticker" });
    if (error) errors.push(`DB upsert: ${error.message}`);
  } catch (e) {
    errors.push(`DB error: ${e instanceof Error ? e.message : "unknown"}`);
  }

  return { count: rows.length, errors };
}

export async function syncMarketIndicators(): Promise<{ count: number; errors: string[] }> {
  const errors: string[] = [];

  if (!process.env.FINNHUB_API_KEY) {
    return { count: 0, errors: ["FINNHUB_API_KEY not configured"] };
  }

  const rows: { symbol: string; value: number; recorded_at: string }[] = [];
  const now = new Date().toISOString();

  await Promise.all(
    INDICATOR_SYMBOLS.map(async (sym) => {
      try {
        const result = await fetchMarketIndicator(sym);
        if (result) rows.push({ symbol: result.symbol, value: result.value, recorded_at: now });
      } catch (e) {
        errors.push(`${sym}: ${e instanceof Error ? e.message : "fetch failed"}`);
      }
    }),
  );

  if (rows.length === 0) return { count: 0, errors };

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = await createServerClient() as any;
    const { error } = await supabase.from("market_indicators").upsert(rows, { onConflict: "symbol" });
    if (error) errors.push(`DB upsert: ${error.message}`);
  } catch (e) {
    errors.push(`DB error: ${e instanceof Error ? e.message : "unknown"}`);
  }

  return { count: rows.length, errors };
}

export async function syncAllMarketData(): Promise<SyncResult> {
  const syncedAt = new Date().toISOString();
  const [prices, indicators] = await Promise.all([syncMarketPrices(), syncMarketIndicators()]);

  const hasExternal = !prices.errors.some((e) => e.includes("not configured")) ||
                      !indicators.errors.some((e) => e.includes("not configured"));

  return {
    syncedPricesCount:     prices.count,
    syncedIndicatorsCount: indicators.count,
    source:                hasExternal ? "external" : "demo",
    errors:                [...prices.errors, ...indicators.errors],
    syncedAt,
  };
}
