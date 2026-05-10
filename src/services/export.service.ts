import { generateCsv, generateBasicPdf, generateExcel } from "@/utils/export-utils";
import { reportsData } from "@/constants/reportsData";
import type { ExportFormat } from "@/types/reports";

export interface ExportResult {
  buffer:      Buffer;
  contentType: string;
  filename:    string;
}

export async function exportReport(reportId: string, format: ExportFormat): Promise<ExportResult> {
  const report =
    reportsData.reports.find((r) => r.id === reportId) ?? reportsData.reports[0];

  const rows: Record<string, string>[] = [
    { Field: "Title",       Value: report.title },
    { Field: "Type",        Value: report.type },
    { Field: "Status",      Value: report.status },
    { Field: "Generated",   Value: report.generatedAt },
    { Field: "Description", Value: report.description },
    ...reportsData.keyMetrics.map((m) => ({ Field: m.label, Value: m.value })),
  ];

  const slug = report.type.toLowerCase();

  switch (format) {
    case "PDF": {
      const pdfRows = rows.map((r) => [r.Field, r.Value] as [string, string]);
      const buffer  = generateBasicPdf(report.title, pdfRows);
      return {
        buffer,
        contentType: "application/pdf",
        filename:    `report-${slug}.pdf`,
      };
    }
    case "CSV": {
      const csv    = generateCsv(rows);
      const buffer = Buffer.from(csv, "utf-8");
      return {
        buffer,
        contentType: "text/csv; charset=utf-8",
        filename:    `report-${slug}.csv`,
      };
    }
    case "Excel": {
      const buffer = generateExcel(report.type, rows);
      return {
        buffer,
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename:    `report-${slug}.xlsx`,
      };
    }
  }
}
