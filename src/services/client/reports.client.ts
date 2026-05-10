import { apiGet } from "@/lib/api-client";
import type { ReportSummaryData } from "@/types/reports";

export function getReports(): Promise<ReportSummaryData> {
  return apiGet<ReportSummaryData>("/api/reports");
}
