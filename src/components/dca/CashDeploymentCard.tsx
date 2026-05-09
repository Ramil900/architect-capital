import type { DCASummaryData } from "@/types/dca";

const levelColor: Record<string, string> = {
  "Small Buy":      "var(--green)",
  "Normal Buy":     "#22d3ee",
  "Strong Buy":     "var(--accent)",
  "Aggressive Buy": "var(--yellow)",
  "Crisis Buy":     "var(--red)",
};

function fmt(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

interface Props {
  data: DCASummaryData;
}

export default function CashDeploymentCard({ data }: Props) {
  const remaining = data.cashReserved - data.cashUsed;

  return (
    <div
      className="rounded-lg border p-5"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
        Cash Deployment
      </p>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <div>
          <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>Reserved</p>
          <p className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            ${fmt(data.cashReserved)}
          </p>
        </div>
        <div>
          <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>Deployed</p>
          <p className="text-lg font-bold" style={{ color: "var(--accent)" }}>
            ${fmt(data.cashUsed)}
          </p>
        </div>
        <div>
          <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>Remaining</p>
          <p className="text-lg font-bold" style={{ color: "var(--green)" }}>
            ${fmt(remaining)}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex justify-between mb-1">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Cash Usage</span>
          <span className="text-xs font-medium" style={{ color: "var(--accent)" }}>{data.cashUsagePercent}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-hover)" }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${data.cashUsagePercent}%`, background: "var(--accent)" }}
          />
        </div>
      </div>

      {/* Per-level deployment */}
      <div className="flex flex-col gap-2.5">
        {data.scenarios.map((s) => {
          const color = levelColor[s.level];
          return (
            <div key={s.level} className="flex items-center gap-2">
              <span className="text-xs w-28 shrink-0" style={{ color: s.triggered ? "var(--text-secondary)" : "var(--text-muted)", opacity: s.triggered ? 1 : 0.5 }}>
                {s.level}
              </span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-hover)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${s.cashDeployPercent}%`,
                    background: color,
                    opacity: s.triggered ? 1 : 0.25,
                  }}
                />
              </div>
              <span className="text-xs w-14 text-right shrink-0 font-medium" style={{ color: s.current ? color : "var(--text-muted)", opacity: s.triggered ? 1 : 0.5 }}>
                ${fmt(s.cashDeployAmount)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
