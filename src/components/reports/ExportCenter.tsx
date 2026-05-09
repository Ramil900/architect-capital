"use client";

import { Download, FileText, Table, FileSpreadsheet } from "lucide-react";
import type { ExportFormat } from "@/types/reports";

const formats: { format: ExportFormat; icon: React.ReactNode; color: string; desc: string }[] = [
  { format: "PDF",   icon: <FileText size={16} />,        color: "#ef4444", desc: "Full report with charts" },
  { format: "CSV",   icon: <Table size={16} />,           color: "#22c55e", desc: "Raw data, spreadsheet-ready" },
  { format: "Excel", icon: <FileSpreadsheet size={16} />, color: "#3b82f6", desc: "Multi-sheet workbook" },
];

export default function ExportCenter() {
  function handleExport(format: ExportFormat) {
    // UI-only: no actual export
    console.log(`Export as ${format}`);
  }

  return (
    <div
      className="rounded-lg border p-5 flex flex-col gap-4"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center gap-2">
        <Download size={14} style={{ color: "var(--accent)" }} />
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          Export Center
        </p>
      </div>

      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        Export full portfolio report including all pages, charts, and AI analysis.
      </p>

      <div className="grid grid-cols-3 gap-3">
        {formats.map(({ format, icon, color, desc }) => (
          <button
            key={format}
            onClick={() => handleExport(format)}
            className="flex flex-col items-center gap-2 rounded-lg p-4 border transition-colors text-center"
            style={{
              borderColor: `${color}30`,
              background:  `${color}08`,
            }}
          >
            <div
              className="w-9 h-9 rounded flex items-center justify-center"
              style={{ background: `${color}20`, color }}
            >
              {icon}
            </div>
            <div>
              <p className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>{format}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div
        className="rounded p-3 flex items-center gap-2"
        style={{ background: "var(--bg-hover)", borderLeft: "2px solid var(--accent)" }}
      >
        <Download size={12} style={{ color: "var(--accent)" }} />
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Reports include data up to last generation timestamp. Refresh to generate updated data.
        </p>
      </div>
    </div>
  );
}
