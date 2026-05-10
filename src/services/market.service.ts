import { marketData } from "@/constants/demo-market";
import type { MarketData, MarketIndicator, MarketRegime } from "@/types/market";
import { fetchStockPrice } from "@/lib/market/twelvedata";
import { fetchMarketIndicator } from "@/lib/market/finnhub";

export type DataSource = "external" | "supabase" | "demo";

export interface ExternalPricesResult {
  prices:      Record<string, number>;
  source:      DataSource;
  lastUpdated: string;
}

export interface ExternalIndicatorsResult {
  indicators:  MarketIndicator[];
  source:      DataSource;
  lastUpdated: string;
}

const PRICE_TICKERS = ["VOO", "QQQ", "SOXX", "SMH", "GLD", "SLV", "BTC", "ETH", "BRK.B", "TSLA"];
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

  if (!process.env.TWELVEDATA_API_KEY) {
    return { prices: {}, source: "demo", lastUpdated };
  }

  try {
    const entries = await Promise.all(
      PRICE_TICKERS.map(async (ticker) => {
        const price = await fetchStockPrice(ticker);
        return price !== null ? ([ticker, price] as [string, number]) : null;
      }),
    );
    const prices = Object.fromEntries(entries.filter(Boolean) as [string, number][]);
    return { prices, source: "external", lastUpdated };
  } catch {
    return { prices: {}, source: "demo", lastUpdated };
  }
}

export async function refreshMarketData() {
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

