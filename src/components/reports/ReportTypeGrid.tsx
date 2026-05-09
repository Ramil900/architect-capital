import type { ReportSummaryData, ReportType } from "@/types/reports";

const typeStyle: Record<ReportType, { color: string; icon: string }> = {
  Daily:     { color: "#3b82f6", icon: "D" },
  Weekly:    { color: "#22c55e", icon: "W" },
  Crisis:    { color: "#ef4444", icon: "C" },
  DCA:       { color: "#f97316", icon: "Ξ" },
  Rebalance: { color: "#8b5cf6", icon: "R" },
};

const typeDesc: Record<ReportType, string> = {
  Daily:     "End-of-day positions, P/L, AI signals",
  Weekly:    "7-day performance and allocation drift",
  Crisis:    "Stress test under major drawdown scenarios",
  DCA:       "Buy zones, deployment progress, next targets",
  Rebalance: "Full rebalancing plan with required trades",
};

interface Props {
  data: ReportSummaryData;
}

export default function ReportTypeGrid({ data }: Props) {
  const types: ReportType[] = ["Daily", "Weekly", "Crisis", "DCA", "Rebalance"];

  return (
    <div
      className="rounded-lg border p-5"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
        Report Types
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {types.map((type) => {
          const st      = typeStyle[type];
          const report  = data.reports.find((r) => r.type === type);
          return (
            <div
              key={type}
              className="flex flex-col gap-2 rounded-lg p-3 border"
              style={{ borderColor: `${st.color}30`, background: `${st.color}08` }}
            >
              <div
                className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold"
                style={{ background: `${st.color}20`, color: st.color }}
              >
                {st.icon}
              </div>
              <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{type}</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{typeDesc[type]}</p>
              {report && (
                <span
                  className="text-xs font-medium px-1.5 py-0.5 rounded self-start"
                  style={{ color: st.color, background: `${st.color}18` }}
                >
                  {report.status}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
