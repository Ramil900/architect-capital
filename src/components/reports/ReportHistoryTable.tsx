import type { ReportSummaryData, ReportType, ReportStatus } from "@/types/reports";

const typeColor: Record<ReportType, string> = {
  Daily:     "#3b82f6",
  Weekly:    "#22c55e",
  Crisis:    "#ef4444",
  DCA:       "#f97316",
  Rebalance: "#8b5cf6",
};

const statusStyle: Record<ReportStatus, { color: string }> = {
  Ready:     { color: "var(--green)"  },
  Generated: { color: "var(--yellow)" },
  Scheduled: { color: "var(--accent)" },
};

interface Props {
  data: ReportSummaryData;
}

export default function ReportHistoryTable({ data }: Props) {
  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          Report History
        </p>
      </div>

      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            {["Type", "Title", "Generated", "Size", "Status"].map((col) => (
              <th
                key={col}
                className={`px-4 py-2.5 text-xs font-medium uppercase tracking-wider ${col === "Size" || col === "Status" ? "text-right" : "text-left"}`}
                style={{ color: "var(--text-muted)" }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.reports.map((report) => {
            const tc = typeColor[report.type];
            const st = statusStyle[report.status];
            return (
              <tr key={report.id} className="border-b" style={{ borderColor: "var(--border-subtle)" }}>
                <td className="px-4 py-3">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded"
                    style={{ color: tc, background: `${tc}18` }}
                  >
                    {report.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{report.title}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{report.description}</p>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                  {report.generatedAt}
                </td>
                <td className="px-4 py-3 text-xs text-right" style={{ color: "var(--text-muted)" }}>
                  {report.size}
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded"
                    style={{ color: st.color, background: `${st.color}18` }}
                  >
                    {report.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
