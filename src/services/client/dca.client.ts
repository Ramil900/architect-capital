import { apiGet, apiMutate } from "@/lib/api-client";
import type { DCASummaryData, DCALevel } from "@/types/dca";

export interface DcaActionInput {
  ticker:     string;
  dcaLevel:   DCALevel;
  amount:     number;
  price:      number;
  marketDrop: number;
  status?:    "Executed" | "Skipped" | "Pending";
}

export function getDcaPlan(): Promise<DCASummaryData> {
  return apiGet<DCASummaryData>("/api/dca");
}

export function saveDcaAction(action: DcaActionInput): Promise<void> {
  return apiMutate("POST", "/api/dca", action);
}
