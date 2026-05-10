import { reportsData } from "@/constants/reportsData";
import type { ReportSummaryData, ReportItem } from "@/types/reports";

export function getDemoReports(): ReportItem[] {
  return reportsData.reports;
}

export function getReportSummary(): ReportSummaryData {
  return reportsData;
}
