import type { RebalanceItem, RebalanceSummaryData, RebalanceAction, RebalancePriority } from "@/types/rebalancing";
import { ASSETS } from "@/constants/assets";
import { TARGET_ALLOCATION } from "@/constants/target-allocation";

const TOTAL_VALUE = 164713;

const CURRENT_VALUES: Record<string, number> = {
  "VOO":   25600,
  "QQQ":   20475,
  "SOXX":  16560,
  "SMH":   16320,
  "GLD":   17550,
  "SLV":   16240,
  "BTC":   12543,
  "ETH":    9000,
  "BRK.B": 22550,
  "TSLA":   7875,
};

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

const items: RebalanceItem[] = ASSETS.map((a) => {
  const currentValue  = CURRENT_VALUES[a.ticker];
  const targetPercent = TARGET_ALLOCATION[a.ticker];
  const currentPercent = (currentValue / TOTAL_VALUE) * 100;
  const targetValue    = TOTAL_VALUE * (targetPercent / 100);
  const diffPercent    = targetPercent - currentPercent;
  const diffValue      = targetValue - currentValue;
  return {
    ticker:  a.ticker,
    name:    a.name,
    category:a.category,
    color:   a.color,
    currentValue,
    currentPercent,
    targetPercent,
    targetValue,
    diffPercent,
    diffValue,
    action:   getAction(diffPercent),
    priority: getPriority(diffPercent),
  };
});

const actionItems       = items.filter((i) => i.action === "Buy" || i.action === "Reduce" || i.action === "Sell");
const totalBuyNeeded    = items.filter((i) => i.action === "Buy").reduce((s, i) => s + i.diffValue, 0);
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
