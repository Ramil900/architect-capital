import type { ExportInput } from "./generate-csv";

export async function generateReportExcel(input: ExportInput = {}): Promise<void> {
  const { utils, writeFile } = await import("xlsx");
  const { summary, portfolio, regime, ai } = input;
  const date      = new Date().toLocaleDateString("en-US");
  const latestRep = summary?.reports?.[0];

  // ── Summary sheet ──────────────────────────────────────────────────────────
  const summaryRows = [
    ["Field", "Value"],
    ["Report Type",    latestRep?.type ?? "Daily"],
    ["Date",           date],
    ["Portfolio Value",
      portfolio?.totalValue != null
        ? `$${portfolio.totalValue.toLocaleString()}`
        : (summary?.keyMetrics?.find((m) => m.label.toLowerCase().includes("value"))?.value ?? "N/A")],
    ["Total P/L",
      portfolio != null
        ? `${portfolio.totalPLPercent >= 0 ? "+" : ""}${portfolio.totalPLPercent.toFixed(2)}%`
        : "N/A"],
    ["Market Regime",  regime?.regime   ?? "N/A"],
    ["VIX",            regime?.vix      ?? "N/A"],
    ["Risk Score",     regime?.riskScore != null ? `${regime.riskScore}/100` : "N/A"],
    ["Portfolio Risk", ai?.portfolioRisk ?? "N/A"],
    ["DCA Status",     ai?.dcaStatus    ?? "N/A"],
    ["AI Summary",     ai?.finalSummary ?? summary?.aiSummary ?? "N/A"],
  ];

  // ── Recommendations sheet ──────────────────────────────────────────────────
  const recRows = [
    ["Ticker", "Action", "Confidence", "Reasoning"],
    ...(ai?.recommendations ?? []).map((r) => [
      r.ticker, r.action, `${r.confidence}%`, r.reasoning,
    ]),
  ];

  const wb  = utils.book_new();
  const ws1 = utils.aoa_to_sheet(summaryRows);
  const ws2 = utils.aoa_to_sheet(recRows);

  ws1["!cols"] = [{ wch: 20 }, { wch: 60 }];
  ws2["!cols"] = [{ wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 80 }];

  utils.book_append_sheet(wb, ws1, "Summary");
  utils.book_append_sheet(wb, ws2, "Recommendations");

  writeFile(wb, `architect-capital-report-${new Date().toISOString().slice(0, 10)}.xlsx`);
}
