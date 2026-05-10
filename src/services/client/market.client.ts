import { apiGet } from "@/lib/api-client";
import type { MarketData, MarketIndicator, MarketRegime } from "@/types/market";

interface IndicatorsResponse {
  indicators:  MarketIndicator[];
  source:      string;
  lastUpdated: string;
}

interface PricesResponse {
  prices:      Record<string, number>;
  source:      string;
  lastUpdated: string;
}

export function getMarketIndicators(): Promise<MarketIndicator[]> {
  return apiGet<IndicatorsResponse>("/api/market/indicators").then((r) => r.indicators);
}

export function getMarketRegime(): Promise<{ regime: MarketRegime; vix: number; riskScore: number }> {
  return apiGet<{ regime: MarketRegime; vix: number; riskScore: number }>("/api/market/regime");
}

export function getMarketPrices(): Promise<Record<string, number>> {
  return apiGet<PricesResponse>("/api/market/prices").then((r) => r.prices ?? r);
}

export function getMarketData(): Promise<MarketData> {
  return Promise.all([
    apiGet<IndicatorsResponse>("/api/market/indicators"),
    apiGet<{ regime: MarketRegime; vix: number; riskScore: number }>("/api/market/regime"),
  ]).then(([{ indicators }, { regime, vix, riskScore }]) => ({
    regime,
    vix,
    riskScore,
    indicators,
  }));
}
