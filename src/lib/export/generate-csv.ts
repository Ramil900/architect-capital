import type { ReportSummaryData } from "@/types/reports";
import type { PortfolioSummaryData } from "@/types/portfolio";
import type { AIAnalysisData } from "@/types/ai";

export interface ExportInput {
  summary?:   ReportSummaryData;
  portfolio?: PortfolioSummaryData;
  regime?:    { regime: string; vix: number; riskScore: number };
  ai?:        AIAnalysisData;
}

function row(label: string, value: string | number): string {
  const v = String(value).includes(",") ? `"${value}"` : String(value);
  return `${label},${v}`;
}

export function generateReportCsv(input: ExportInput = {}): void {
  const { summary, portfolio, regime, ai } = input;
  const date      = new Date().toLocaleDateString("en-US");
  const latestRep = summary?.reports?.[0];

  const lines: string[] = [
    "Field,Value",
    row("Report Type",   latestRep?.type ?? "Daily"),
    row("Date",          date),
    row("Portfolio Value",
      portfolio?.totalValue != null
        ? `$${portfolio.totalValue.toLocaleString()}`
        : (summary?.keyMetrics?.find((m) => m.label.toLowerCase().includes("value"))?.value ?? "N/A")),
    row("Total P/L",
      portfolio != null
        ? `${portfolio.totalPLPercent >= 0 ? "+" : ""}${portfolio.totalPLPercent.toFixed(2)}%`
        : "N/A"),
    row("Market Regime", regime?.regime   ?? "N/A"),
    row("VIX",           regime?.vix      ?? "N/A"),
    row("Risk Score",    regime?.riskScore != null ? `${regime.riskScore}/100` : "N/A"),
    row("Portfolio Risk", ai?.portfolioRisk ?? "N/A"),
    row("DCA Status",    ai?.dcaStatus     ?? "N/A"),
    row("AI Summary",    ai?.finalSummary  ?? summary?.aiSummary ?? "N/A"),
    "",
    "Recommendations",
    "Ticker,Action,Confidence,Reasoning",
    ...(ai?.recommendations ?? []).map((r) =>
      `${r.ticker},${r.action},${r.confidence}%,"${r.reasoning.replace(/"/g, "'")}"`
    ),
  ];

  const blob     = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url      = URL.createObjectURL(blob);
  const link     = document.createElement("a");
  link.href      = url;
  link.download  = `architect-capital-report-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
