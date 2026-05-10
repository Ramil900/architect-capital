import { createServerClient } from "@/lib/supabase/server";
import { marketData } from "@/constants/demo-market";
import { getMarketRegimeFromVix, calculateRiskScore } from "@/utils/risk-calculations";
import type { MarketData, MarketIndicator, MarketRegime, MarketStatus, MarketCategory } from "@/types/market";

interface DbIndicatorRow {
  symbol:            string;
  name:              string;
  value:             string | number;
  display_value:     string;
  daily_change:      string | number;
  daily_change_pct:  string | number;
  weekly_change:     string | number;
  weekly_change_pct: string | number;
  status:            string;
  category:          string;
  interpretation:    string;
}

interface DbPriceRow {
  ticker:      string;
  price:       string | number;
  recorded_at: string;
}

function rowToIndicator(row: DbIndicatorRow): MarketIndicator {
  return {
    id:              row.symbol.toLowerCase(),
    name:            row.name,
    symbol:          row.symbol,
    value:           Number(row.value),
    displayValue:    row.display_value,
    dailyChange:     Number(row.daily_change),
    dailyChangePct:  Number(row.daily_change_pct),
    weeklyChange:    Number(row.weekly_change),
    weeklyChangePct: Number(row.weekly_change_pct),
    status:          row.status as MarketStatus,
    interpretation:  row.interpretation,
    category:        row.category as MarketCategory,
  };
}

export async function getMarketIndicators(): Promise<MarketIndicator[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = await createServerClient() as any;
    const { data, error } = await supabase
      .from("market_indicators")
      .select("symbol, name, value, display_value, daily_change, daily_change_pct, weekly_change, weekly_change_pct, status, category, interpretation")
      .order("recorded_at", { ascending: false })
      .limit(100);

    if (error || !data || (data as DbIndicatorRow[]).length === 0) return marketData.indicators;

    const seen = new Set<string>();
    const unique = (data as DbIndicatorRow[]).filter((row) => {
      if (seen.has(row.symbol)) return false;
      seen.add(row.symbol);
      return true;
    });

    return unique.map(rowToIndicator);
  } catch {
    return marketData.indicators;
  }
}

export async function getMarketPrices(): Promise<Record<string, number>> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = await createServerClient() as any;
    const { data, error } = await supabase
      .from("market_prices")
      .select("ticker, price, recorded_at")
      .order("recorded_at", { ascending: false })
      .limit(200);

    if (error || !data || (data as DbPriceRow[]).length === 0) return {};

    const seen = new Set<string>();
    const prices: Record<string, number> = {};
    for (const row of data as DbPriceRow[]) {
      if (!seen.has(row.ticker)) {
        seen.add(row.ticker);
        prices[row.ticker] = Number(row.price);
      }
    }
    return prices;
  } catch {
    return {};
  }
}

export async function getMarketRegime(): Promise<{ regime: MarketRegime; vix: number; riskScore: number }> {
  const indicators = await getMarketIndicators();
  const vixIndicator = indicators.find((i) => i.symbol === "VIX");
  const vix = vixIndicator?.value ?? marketData.vix;
  const regime = getMarketRegimeFromVix(vix);
  const riskScore = calculateRiskScore(indicators);
  return { regime, vix, riskScore };
}

export async function getMarketDataFromDB(): Promise<MarketData> {
  const [indicators, { regime, vix, riskScore }] = await Promise.all([
    getMarketIndicators(),
    getMarketRegime(),
  ]);
  return { regime, vix, riskScore, indicators };
}
