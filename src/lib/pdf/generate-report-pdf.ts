import { jsPDF } from "jspdf";
import type { ReportSummaryData } from "@/types/reports";
import type { PortfolioSummaryData } from "@/types/portfolio";
import type { AIAnalysisData } from "@/types/ai";

export interface ReportPdfInput {
  summary?:   ReportSummaryData;
  portfolio?: PortfolioSummaryData;
  regime?:    { regime: string; vix: number; riskScore: number };
  ai?:        AIAnalysisData;
}

function wrap(doc: jsPDF, text: string, x: number, maxWidth: number): string[] {
  return doc.splitTextToSize(text, maxWidth) as string[];
}

export function generateReportPdf(input: ReportPdfInput = {}): void {
  const { summary, portfolio, regime, ai } = input;
  const doc  = new jsPDF({ unit: "pt", format: "a4" });
  const W    = doc.internal.pageSize.getWidth();
  const pad  = 48;
  const col  = W - pad * 2;
  let   y    = pad;

  const accent  = [99,  102, 241] as [number, number, number];
  const muted   = [120, 120, 130] as [number, number, number];
  const primary = [220, 220, 228] as [number, number, number];
  const dark    = [18,  18,  24]  as [number, number, number];

  // Background
  doc.setFillColor(...dark);
  doc.rect(0, 0, W, doc.internal.pageSize.getHeight(), "F");

  // Header bar
  doc.setFillColor(...accent);
  doc.rect(0, 0, W, 6, "F");
  y = 28;

  // Logo mark
  doc.setFillColor(...accent);
  doc.roundedRect(pad, y, 22, 22, 3, 3, "F");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("AC", pad + 11, y + 14.5, { align: "center" });

  // Title
  doc.setFontSize(16);
  doc.setTextColor(...primary);
  doc.text("Архитектор Капитала", pad + 30, y + 15);

  // Date
  const dateStr = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text(dateStr, W - pad, y + 15, { align: "right" });

  y += 44;

  // Divider
  doc.setDrawColor(...accent);
  doc.setLineWidth(0.5);
  doc.line(pad, y, W - pad, y);
  y += 18;

  // Report title
  const latestReport = summary?.reports?.[0];
  const reportTitle  = latestReport?.title ?? "Portfolio Report";
  const reportType   = latestReport?.type  ?? "Daily";

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primary);
  doc.text(reportTitle, pad, y);
  y += 16;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...muted);
  doc.text(`Type: ${reportType}  ·  Generated: ${dateStr}`, pad, y);
  y += 22;

  // ── Portfolio summary ──────────────────────────────────────────────────────
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...accent);
  doc.text("PORTFOLIO SUMMARY", pad, y);
  y += 14;

  const totalValue = portfolio?.totalValue
    ?? summary?.keyMetrics?.find((m) => m.label.toLowerCase().includes("value"))?.value
    ?? "N/A";
  const plPct = portfolio != null
    ? `${portfolio.totalPLPercent >= 0 ? "+" : ""}${portfolio.totalPLPercent.toFixed(2)}%`
    : (summary?.keyMetrics?.find((m) => m.label.toLowerCase().includes("p/l"))?.value ?? "N/A");

  const summaryRows = [
    ["Portfolio Value",  typeof totalValue === "number" ? `$${totalValue.toLocaleString()}` : String(totalValue)],
    ["Total P/L",        plPct],
    ["Market Regime",    regime?.regime   ?? "N/A"],
    ["VIX",              regime?.vix      != null ? String(regime.vix) : "N/A"],
    ["Risk Score",       regime?.riskScore != null ? `${regime.riskScore}/100` : "N/A"],
    ["Portfolio Risk",   ai?.portfolioRisk ?? "N/A"],
  ];

  for (const [label, val] of summaryRows) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text(label, pad, y);
    doc.setTextColor(...primary);
    doc.text(String(val), pad + 120, y);
    y += 14;
  }

  y += 10;

  // ── AI Summary ─────────────────────────────────────────────────────────────
  const aiSummary = ai?.finalSummary ?? summary?.aiSummary ?? "No AI analysis available.";

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...accent);
  doc.text("AI ANALYSIS SUMMARY", pad, y);
  y += 14;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...primary);
  const summaryLines = wrap(doc, aiSummary, pad, col);
  doc.text(summaryLines, pad, y);
  y += summaryLines.length * 11 + 10;

  // ── Risk Factors ───────────────────────────────────────────────────────────
  const riskFactors = ai?.mainRiskFactors ?? [];
  if (riskFactors.length > 0) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...accent);
    doc.text("KEY RISK FACTORS", pad, y);
    y += 14;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...primary);
    for (const factor of riskFactors.slice(0, 5)) {
      const lines = wrap(doc, `• ${factor}`, pad + 6, col - 6);
      doc.text(lines, pad + 6, y);
      y += lines.length * 11;
    }
    y += 6;
  }

  // ── Recommendations ────────────────────────────────────────────────────────
  const recs = ai?.recommendations ?? [];
  if (recs.length > 0) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...accent);
    doc.text("AI RECOMMENDATIONS", pad, y);
    y += 14;

    for (const rec of recs.slice(0, 6)) {
      if (y > 740) break;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...primary);
      doc.text(`${rec.ticker}  [${rec.action}]`, pad, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...muted);
      const lines = wrap(doc, rec.reasoning, pad + 6, col - 6);
      y += 11;
      doc.text(lines, pad + 6, y);
      y += lines.length * 11 + 4;
    }
  }

  // ── Footer ─────────────────────────────────────────────────────────────────
  const pageH = doc.internal.pageSize.getHeight();
  doc.setDrawColor(...muted);
  doc.setLineWidth(0.3);
  doc.line(pad, pageH - 30, W - pad, pageH - 30);
  doc.setFontSize(7);
  doc.setTextColor(...muted);
  doc.text(
    "For informational purposes only. Not financial advice. Past performance does not guarantee future results.",
    W / 2,
    pageH - 16,
    { align: "center" },
  );

  const filename = `architect-capital-report-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
