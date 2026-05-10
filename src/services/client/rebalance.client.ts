import { apiGet } from "@/lib/api-client";
import type { RebalanceSummaryData } from "@/types/rebalancing";

export function getRebalancePlan(): Promise<RebalanceSummaryData> {
  return apiGet<RebalanceSummaryData>("/api/rebalance");
}
