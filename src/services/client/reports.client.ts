import { apiGet, apiMutate } from "@/lib/api-client";
import type { ReportSummaryData, ReportType, ReportStatus, ExportFormat } from "@/types/reports";

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

export async function exportReport(reportId: string, format: ExportFormat): Promise<void> {
  const res = await fetch("/api/reports/export", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ reportId, format }),
  });

  if (!res.ok) {
    const json = await res.json().catch(() => null) as { error?: string } | null;
    throw new Error(json?.error ?? `Export failed: ${res.status}`);
  }

  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);
  const ext  = format === "Excel" ? "xlsx" : format.toLowerCase();
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `report.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
