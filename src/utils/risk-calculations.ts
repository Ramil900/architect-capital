import type { MarketRegime, MarketStatus, MarketIndicator } from "@/types/market";
import type { RiskLevel } from "@/types/ai";
import { VIX_THRESHOLDS } from "@/constants/risk-levels";

export function getMarketRegimeFromVix(vix: number): MarketRegime {
  if (vix < VIX_THRESHOLDS.riskOn)  return "Risk-On";
  if (vix < VIX_THRESHOLDS.neutral) return "Neutral";
  if (vix < VIX_THRESHOLDS.riskOff) return "Risk-Off";
  return "Crisis Mode";
}

export function calculateRiskScore(indicators: MarketIndicator[]): number {
  const caution = indicators.filter((i) => i.status === "Caution").length;
  const danger  = indicators.filter((i) => i.status === "Danger").length;
  return Math.round(((caution * 3 + danger * 7) / (indicators.length * 7)) * 100);
}

export function getRiskLevel(score: number): RiskLevel {
  if (score < 25) return "Low";
  if (score < 50) return "Moderate";
  if (score < 75) return "High";
  return "Critical";
}

export function getIndicatorStatus(value: number, cautionThreshold: number, dangerThreshold: number): MarketStatus {
  if (value >= dangerThreshold)  return "Danger";
  if (value >= cautionThreshold) return "Caution";
  return "Normal";
}
