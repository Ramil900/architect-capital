import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

export function generateCsv(data: Record<string, unknown>[]): string {
  if (data.length === 0) return "";
  const headers = Object.keys(data[0]);
  const escape  = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows    = data.map((row) => headers.map((h) => escape(row[h])).join(","));
  return [headers.join(","), ...rows].join("\n");
}

export function generateBasicPdf(title: string, rows: [string, string][]): Buffer {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(title, 14, 20);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  let y = 34;
  for (const [label, value] of rows) {
    doc.setFont("helvetica", "bold");
    doc.text(label + ":", 14, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, 50, y);
    y += 8;
    if (y > 275) { doc.addPage(); y = 20; }
  }

  return Buffer.from(doc.output("arraybuffer"));
}

export function generateExcel(sheetName: string, data: Record<string, unknown>[]): Buffer {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));
  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
}
