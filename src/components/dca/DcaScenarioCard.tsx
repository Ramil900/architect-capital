import type { DCASummaryData } from "@/types/dca";

const levelColor: Record<string, string> = {
  "Small Buy":      "var(--green)",
  "Normal Buy":     "#22d3ee",
  "Strong Buy":     "var(--accent)",
  "Aggressive Buy": "var(--yellow)",
  "Crisis Buy":     "var(--red)",
};

interface Props {
  data: DCASummaryData;
}

export default function DcaScenarioCard({ data }: Props) {
  return (
    <div
      className="rounded-lg border p-5"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
        DCA Scenarios
      </p>

      <div className="flex flex-col gap-3">
        {data.scenarios.map((s) => {
          const color = levelColor[s.level];
          const opacity = s.triggered ? 1 : 0.4;

          return (
            <div
              key={s.level}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5"
              style={{
                background: s.current
                  ? `${color}12`
                  : s.triggered
                  ? `${color}08`
                  : "transparent",
                border: s.current
                  ? `1px solid ${color}40`
                  : "1px solid transparent",
                opacity,
              }}
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: s.triggered ? color : "var(--border)" }}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color }}>
                    {s.drop}%
                  </span>
                  <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                    {s.level}
                  </span>
                  {s.current && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded font-medium"
                      style={{ color, background: `${color}20` }}
                    >
                      CURRENT
                    </span>
                  )}
                </div>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  Deploy {s.cashDeployPercent}% of reserved cash
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  ${s.cashDeployAmount.toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="mt-4 pt-4 flex items-center gap-4 flex-wrap"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--green)" }} />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Triggered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--border)" }} />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Waiting</span>
        </div>
      </div>
    </div>
  );
}
