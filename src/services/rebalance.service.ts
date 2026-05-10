import { rebalancingData } from "@/constants/rebalancingData";
import type { RebalanceSummaryData, RebalanceItem } from "@/types/rebalancing";

export function getRebalancePlan(): RebalanceItem[] {
  return rebalancingData.items;
}

export function getRebalanceSummary(): RebalanceSummaryData {
  return rebalancingData;
}
