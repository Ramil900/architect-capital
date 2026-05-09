import type { MarketRegime } from "@/types/market";

export const VIX_THRESHOLDS = {
  riskOn:   18,
  neutral:  25,
  riskOff:  35,
} as const;

export function getMarketRegime(vix: number): MarketRegime {
  if (vix < VIX_THRESHOLDS.riskOn)  return "Risk-On";
  if (vix < VIX_THRESHOLDS.neutral) return "Neutral";
  if (vix < VIX_THRESHOLDS.riskOff) return "Risk-Off";
  return "Crisis Mode";
}

export const REGIME_CONFIG: Record<MarketRegime, { color: string; desc: string }> = {
  "Risk-On":    { color: "var(--green)",  desc: "Market conditions are favorable." },
  "Neutral":    { color: "var(--yellow)", desc: "Mixed signals. Cautious buying."   },
  "Risk-Off":   { color: "var(--red)",    desc: "Elevated risk. Reduce exposure."   },
  "Crisis Mode":{ color: "var(--red)",    desc: "Extreme risk. Defensive mode."     },
};
