import type { RebalanceSummaryData, RebalanceAction, RebalancePriority } from "@/types/rebalancing";

const actionStyle: Record<RebalanceAction, { color: string }> = {
  Buy:    { color: "var(--green)"  },
  Hold:   { color: "var(--yellow)" },
  Reduce: { color: "#f97316"       },
  Sell:   { color: "var(--red)"    },
};

const priorityStyle: Record<RebalancePriority, { color: string; label: string }> = {
  High:   { color: "var(--red)",    label: "High"   },
  Medium: { color: "var(--yellow)", label: "Medium" },
  Low:    { color: "var(--green)",  label: "Low"    },
};

function fmt(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

interface Props {
  data: RebalanceSummaryData;
}

export default function RebalanceActionCard({ data }: Props) {
  const actionItems = data.items
    .filter((i) => i.action !== "Hold")
    .sort((a, b) => {
      const order: Record<RebalancePriority, number> = { High: 0, Medium: 1, Low: 2 };
      return order[a.priority] - order[b.priority];
    });

  return (
    <div
      className="rounded-lg border p-5 flex flex-col gap-4"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          Priority Actions
        </p>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded"
          style={{ color: "var(--yellow)", background: "color-mix(in srgb, var(--yellow) 12%, transparent)" }}
        >
          {actionItems.length} to action
        </span>
      </div>

      {actionItems.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--green)" }}>Portfolio is balanced. No actions required.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {actionItems.map((item) => {
            const st  = actionStyle[item.action];
            const pri = priorityStyle[item.priority];
            const diffPos = item.diffValue >= 0;

            return (
              <div
                key={item.ticker}
                className="rounded-lg p-3 flex flex-col gap-2"
                style={{ background: "var(--bg-hover)", borderLeft: `2px solid ${st.color}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                      {item.ticker}
                    </span>
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded"
                      style={{ color: st.color, background: `${st.color}18` }}
                    >
                      {item.action}
                    </span>
                  </div>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-medium"
                    style={{ color: pri.color, background: `${pri.color}18` }}
                  >
                    {pri.label}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
                  <span>
                    {item.currentPercent.toFixed(1)}% → {item.targetPercent}%
                    <span className="ml-2" style={{ color: diffPos ? "var(--green)" : "var(--red)" }}>
                      ({diffPos ? "+" : ""}{item.diffPercent.toFixed(1)}%)
                    </span>
                  </span>
                  <span className="font-semibold" style={{ color: diffPos ? "var(--green)" : "var(--red)" }}>
                    {diffPos ? "+" : ""}${fmt(item.diffValue)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
