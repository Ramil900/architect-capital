import { apiGet, apiMutate } from "@/lib/api-client";
import type { ReportSummaryData, ReportType, ReportStatus } from "@/types/reports";

export interface CreateReportInput {
  type:        ReportType;
  title:       string;
  description: string;
  status?:     ReportStatus;
}

export function getReports(): Promise<ReportSummaryData> {
  return apiGet<ReportSummaryData>("/api/reports");
}

export function createReport(report: CreateReportInput): Promise<void> {
  return apiMutate("POST", "/api/reports", report);
}

export function deleteReport(reportId: string): Promise<void> {
  return apiMutate("DELETE", "/api/reports", { reportId });
}
