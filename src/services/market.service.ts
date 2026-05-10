import { marketData } from "@/constants/demo-market";
import type { MarketData, MarketIndicator, MarketRegime } from "@/types/market";

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
