import { FileText } from "lucide-react";
import type { ReportSummaryData } from "@/types/reports";

interface Props {
  data: ReportSummaryData;
}

export default function ReportSummaryCard({ data }: Props) {
  return (
    <div
      className="rounded-lg border p-5 grid grid-cols-2 sm:grid-cols-4 gap-6"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div>
        <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
          Total Reports
        </p>
        <div className="flex items-center gap-2">
          <FileText size={16} style={{ color: "var(--accent)" }} />
          <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {data.totalReports}
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
          Last Generated
        </p>
        <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          {data.lastGenerated}
        </p>
      </div>

      {data.keyMetrics.slice(0, 2).map((m) => (
        <div key={m.label}>
          <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
            {m.label}
          </p>
          <p
            className="text-2xl font-bold"
            style={{ color: m.positive === true ? "var(--green)" : m.positive === false ? "var(--red)" : "var(--text-primary)" }}
          >
            {m.value}
          </p>
        </div>
      ))}
    </div>
  );
}
