import { BrainCircuit } from "lucide-react";
import type { ReportSummaryData } from "@/types/reports";

interface Props {
  data: ReportSummaryData;
}

export default function AIReportSummary({ data }: Props) {
  return (
    <div
      className="rounded-lg border p-5 flex flex-col gap-4"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center gap-2">
        <BrainCircuit size={14} style={{ color: "var(--accent)" }} />
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          AI Executive Summary
        </p>
      </div>

      <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {data.aiSummary}
      </p>

      <div
        className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        {data.keyMetrics.map((m) => (
          <div key={m.label}>
            <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>{m.label}</p>
            <p
              className="text-base font-bold"
              style={{
                color: m.positive === true
                  ? "var(--green)"
                  : m.positive === false
                  ? "var(--red)"
                  : "var(--text-primary)",
              }}
            >
              {m.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
