import { apiGet, apiMutate } from "@/lib/api-client";
import type { RebalanceSummaryData, RebalanceAction, RebalancePriority } from "@/types/rebalancing";

export interface RebalanceActionInput {
  ticker:      string;
  action:      RebalanceAction;
  diffPercent: number;
  diffValue:   number;
  priority:    RebalancePriority;
  executed?:   boolean;
}

export function getRebalancePlan(): Promise<RebalanceSummaryData> {
  return apiGet<RebalanceSummaryData>("/api/rebalance");
}

export function saveRebalanceAction(action: RebalanceActionInput): Promise<void> {
  return apiMutate("POST", "/api/rebalance", action);
}
