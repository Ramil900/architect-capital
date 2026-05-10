import { apiGet } from "@/lib/api-client";
import type { DCASummaryData } from "@/types/dca";

export function getDcaPlan(): Promise<DCASummaryData> {
  return apiGet<DCASummaryData>("/api/dca");
}
