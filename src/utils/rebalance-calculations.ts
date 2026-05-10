import type { RebalanceAction, RebalancePriority, RebalanceItem } from "@/types/rebalancing";

export function calculateTargetValue(totalValue: number, targetPercent: number): number {
  return totalValue * (targetPercent / 100);
}

export function calculateDifferenceValue(targetValue: number, currentValue: number): number {
  return targetValue - currentValue;
}

export function calculateDifferencePercent(targetPercent: number, currentPercent: number): number {
  return targetPercent - currentPercent;
}

export function getRebalanceAction(diffPercent: number): RebalanceAction {
  if (diffPercent > 2)  return "Buy";
  if (diffPercent < -4) return "Sell";
  if (diffPercent < -2) return "Reduce";
  return "Hold";
}

export function getRebalancePriority(diffPercent: number): RebalancePriority {
  if (Math.abs(diffPercent) > 3) return "High";
  if (Math.abs(diffPercent) > 2) return "Medium";
  return "Low";
}

export function generateRebalancePlan(
  items: RebalanceItem[]
): { buyNeeded: number; reduceNeeded: number; actionsNeeded: number } {
  const actionItems   = items.filter((i) => i.action !== "Hold");
  const buyNeeded     = items.filter((i) => i.action === "Buy").reduce((s, i) => s + i.diffValue, 0);
  const reduceNeeded  = Math.abs(
    items.filter((i) => i.action === "Reduce" || i.action === "Sell").reduce((s, i) => s + i.diffValue, 0)
  );
  return {
    buyNeeded:     Math.round(buyNeeded),
    reduceNeeded:  Math.round(reduceNeeded),
    actionsNeeded: actionItems.length,
  };
}
