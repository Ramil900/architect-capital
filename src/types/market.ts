export type MarketStatus   = "Normal" | "Caution" | "Danger";
export type MarketRegime   = "Risk-On" | "Neutral" | "Risk-Off" | "Crisis Mode";
export type MarketCategory = "Volatility" | "Currency" | "Rates" | "Equity" | "Metals" | "Crypto";

export interface MarketIndicator {
  id: string;
  name: string;
  symbol: string;
  value: number;
  displayValue: string;
  dailyChange: number;
  dailyChangePct: number;
  weeklyChange: number;
  weeklyChangePct: number;
  status: MarketStatus;
  interpretation: string;
  category: MarketCategory;
}

export interface MarketData {
  regime: MarketRegime;
  riskScore: number;
  vix: number;
  indicators: MarketIndicator[];
}
