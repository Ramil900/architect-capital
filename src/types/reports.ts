export type ReportType   = "Daily" | "Weekly" | "Crisis" | "DCA" | "Rebalance";
export type ReportStatus = "Ready" | "Generated" | "Scheduled";
export type ExportFormat = "PDF" | "CSV" | "Excel";

export interface ReportItem {
  id:          string;
  type:        ReportType;
  title:       string;
  description: string;
  status:      ReportStatus;
  generatedAt: string;
  size:        string;
}

export interface ReportSummaryData {
  totalReports:     number;
  lastGenerated:    string;
  aiSummary:        string;
  keyMetrics:       { label: string; value: string; positive?: boolean }[];
  reports:          ReportItem[];
}
