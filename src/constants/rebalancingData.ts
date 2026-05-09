import type { RebalanceItem, RebalanceSummaryData, RebalanceAction, RebalancePriority } from "@/types/rebalancing";

const TOTAL_VALUE = 164713;

const raw = [
  { ticker: "VOO",   name: "Vanguard S&P 500 ETF",      category: "ETF"    as const, color: "#3b82f6", currentValue: 25600, targetPercent: 20 },
  { ticker: "QQQ",   name: "Invesco QQQ Trust",          category: "ETF"    as const, color: "#6366f1", currentValue: 20475, targetPercent: 15 },
  { ticker: "SOXX",  name: "iShares Semiconductor ETF",  category: "ETF"    as const, color: "#8b5cf6", currentValue: 16560, targetPercent: 10 },
  { ticker: "SMH",   name: "VanEck Semiconductor ETF",   category: "ETF"    as const, color: "#a855f7", currentValue: 16320, targetPercent: 10 },
  { ticker: "GLD",   name: "SPDR Gold Trust",            category: "Metals" as const, color: "#f59e0b", currentValue: 17550, targetPercent: 10 },
  { ticker: "SLV",   name: "iShares Silver Trust",       category: "Metals" as const, color: "#94a3b8", currentValue: 16240, targetPercent: 10 },
  { ticker: "BTC",   name: "Bitcoin",                    category: "Crypto" as const, color: "#f97316", currentValue: 12543, targetPercent:  7 },
  { ticker: "ETH",   name: "Ethereum",                   category: "Crypto" as const, color: "#06b6d4", currentValue:  9000, targetPercent:  3 },
  { ticker: "BRK.B", name: "Berkshire Hathaway B",       category: "Stocks" as const, color: "#22c55e", currentValue: 22550, targetPercent: 10 },
  { ticker: "TSLA",  name: "Tesla Inc.",                  category: "Stocks" as const, color: "#ef4444", currentValue:  7875, targetPercent:  5 },
];

function getAction(diff: number): RebalanceAction {
  if (diff > 2)  return "Buy";
  if (diff < -4) return "Sell";
  if (diff < -2) return "Reduce";
  return "Hold";
}

function getPriority(diff: number): RebalancePriority {
  if (Math.abs(diff) > 3) return "High";
  if (Math.abs(diff) > 2) return "Medium";
  return "Low";
}

const items: RebalanceItem[] = raw.map((r) => {
  const currentPercent = (r.currentValue / TOTAL_VALUE) * 100;
  const targetValue    = TOTAL_VALUE * (r.targetPercent / 100);
  const diffPercent    = r.targetPercent - currentPercent;
  const diffValue      = targetValue - r.currentValue;
  return {
    ...r,
    currentPercent,
    targetValue,
    diffPercent,
    diffValue,
    action:   getAction(diffPercent),
    priority: getPriority(diffPercent),
  };
});

const actionItems     = items.filter((i) => i.action === "Buy" || i.action === "Reduce" || i.action === "Sell");
const totalBuyNeeded  = items.filter((i) => i.action === "Buy").reduce((s, i) => s + i.diffValue, 0);
const totalReduceNeeded = Math.abs(
  items.filter((i) => i.action === "Reduce" || i.action === "Sell").reduce((s, i) => s + i.diffValue, 0)
);

export const rebalancingData: RebalanceSummaryData = {
  totalValue:        TOTAL_VALUE,
  balanceScore:      71,
  actionsNeeded:     actionItems.length,
  totalBuyNeeded:    Math.round(totalBuyNeeded),
  totalReduceNeeded: Math.round(totalReduceNeeded),
  items,
};
