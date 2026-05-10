import { apiGet } from "@/lib/api-client";
import type { MarketData, MarketIndicator, MarketRegime } from "@/types/market";

export function getMarketIndicators(): Promise<MarketIndicator[]> {
  return apiGet<MarketIndicator[]>("/api/market/indicators");
}

export function getMarketRegime(): Promise<{ regime: MarketRegime; vix: number; riskScore: number }> {
  return apiGet<{ regime: MarketRegime; vix: number; riskScore: number }>("/api/market/regime");
}

export function getMarketData(): Promise<MarketData> {
  return Promise.all([
    apiGet<MarketIndicator[]>("/api/market/indicators"),
    apiGet<{ regime: MarketRegime; vix: number; riskScore: number }>("/api/market/regime"),
  ]).then(([indicators, { regime, vix, riskScore }]) => ({
    regime,
    vix,
    riskScore,
    indicators,
  }));
}
