import { marketData } from "@/constants/demo-market";
import type { MarketData, MarketIndicator, MarketRegime } from "@/types/market";
import { fetchStockPrice, fetchStockQuotes } from "@/lib/market/twelvedata";
import { fetchCryptoPrices } from "@/lib/market/coingecko";
import { fetchMarketIndicator } from "@/lib/market/finnhub";

export type DataSource = "external" | "supabase" | "demo";

export interface PriceEntry {
  price:          number;
  dailyChange:    number;
  dailyChangePct: number;
  updatedAt:      string;
  source:         DataSource;
}

export interface ExternalPricesResult {
  prices:      Record<string, number>;
  priceData:   Record<string, PriceEntry>;
  source:      DataSource;
  lastUpdated: string;
}

export interface ExternalIndicatorsResult {
  indicators:  MarketIndicator[];
  source:      DataSource;
  lastUpdated: string;
}

const STOCK_TICKERS  = ["VOO", "QQQ", "SOXX", "SMH", "GLD", "SLV", "BRK.B", "TSLA"];
const CRYPTO_TICKERS = ["BTC", "ETH"];
const INDICATOR_SYMBOLS = ["^VIX", "^GSPC", "^TNX", "DX-Y.NYB"];

export function getMarketIndicators(): MarketIndicator[] {
  return marketData.indicators;
}

export function getMarketRegime(): MarketRegime {
  return marketData.regime;
}

export function getRiskScore(): number {
  return marketData.riskScore;
}

export function getMarketData(): MarketData {
  return marketData;
}

export async function getExternalMarketPrices(): Promise<ExternalPricesResult> {
  const lastUpdated = new Date().toISOString();
  const empty = { prices: {} as Record<string, number>, priceData: {} as Record<string, PriceEntry>, source: "demo" as DataSource, lastUpdated };

  const hasStockKey  = !!process.env.TWELVEDATA_API_KEY;
  const hasCryptoKey = !!process.env.COINGECKO_API_KEY;

  if (!hasStockKey && !hasCryptoKey) return empty;

  try {
    const [stockQuotes, cryptoQuotes] = await Promise.all([
      hasStockKey ? fetchStockQuotes(STOCK_TICKERS) : Promise.resolve([]),
      fetchCryptoPrices(CRYPTO_TICKERS),
    ]);

    const allQuotes = [...stockQuotes, ...cryptoQuotes];
    if (allQuotes.length === 0) return empty;

    const prices:    Record<string, number>     = {};
    const priceData: Record<string, PriceEntry> = {};

    for (const q of allQuotes) {
      prices[q.ticker] = q.price;
      priceData[q.ticker] = {
        price:          q.price,
        dailyChange:    q.dailyChange,
        dailyChangePct: q.dailyChangePct,
        updatedAt:      lastUpdated,
        source:         "external",
      };
    }

    return { prices, priceData, source: "external", lastUpdated };
  } catch {
    return empty;
  }
}

export async function refreshMarketData() {
  const lastUpdated = new Date().toISOString();
  const external = await getExternalMarketPrices();

  if (external.source === "external" && Object.keys(external.prices).length > 0) {
    const errors: string[] = [];
    try {
      const { createServerClient } = await import("@/lib/supabase/server");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const supabase = await (createServerClient as any)() as any;
      const rows = Object.entries(external.prices).map(([ticker, price]) => ({
        ticker, price, source: "external", recorded_at: lastUpdated,
      }));
      const { error } = await supabase
        .from("market_prices")
        .upsert(rows, { onConflict: "ticker" });
      if (error) errors.push(`DB upsert: ${error.message}`);
    } catch (e) {
      errors.push(`DB error: ${e instanceof Error ? e.message : "unknown"}`);
    }
    return {
      syncedPricesCount:     Object.keys(external.prices).length,
      syncedIndicatorsCount: 0,
      source:                "external",
      errors,
      syncedAt:              lastUpdated,
    };
  }

  const { syncAllMarketData } = await import("@/services/market-sync.service");
  return syncAllMarketData();
}

export async function getExternalMarketIndicators(): Promise<ExternalIndicatorsResult> {
  const lastUpdated = new Date().toISOString();

  if (!process.env.FINNHUB_API_KEY) {
    return { indicators: marketData.indicators, source: "demo", lastUpdated };
  }

  try {
    const results = await Promise.all(
      INDICATOR_SYMBOLS.map((sym) => fetchMarketIndicator(sym)),
    );
    const fetched = results.filter(Boolean);
    if (fetched.length === 0) {
      return { indicators: marketData.indicators, source: "demo", lastUpdated };
    }
    return { indicators: marketData.indicators, source: "external", lastUpdated };
  } catch {
    return { indicators: marketData.indicators, source: "demo", lastUpdated };
  }
}

// Keep backward-compat export used by market-sync.service
export { fetchStockPrice };
