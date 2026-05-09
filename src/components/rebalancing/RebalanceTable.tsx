import type { RebalanceSummaryData, RebalanceAction } from "@/types/rebalancing";

const actionStyle: Record<RebalanceAction, { color: string }> = {
  Buy:    { color: "var(--green)"  },
  Hold:   { color: "var(--yellow)" },
  Reduce: { color: "#f97316"       },
  Sell:   { color: "var(--red)"    },
};

const categoryColor: Record<string, string> = {
  ETF:    "#3b82f6",
  Crypto: "#f97316",
  Metals: "#f59e0b",
  Stocks: "#22c55e",
};

function fmt(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

const COLUMNS = [
  "Asset", "Current Value", "Current %", "Target %", "Target Value", "Diff %", "Diff Value", "Action",
];

interface Props {
  data: RebalanceSummaryData;
}

export default function RebalanceTable({ data }: Props) {
  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          Rebalancing Plan
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px]">
          <thead>
            <tr style={{ borderBottom: `1px solid var(--border-subtle)` }}>
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  className={`px-4 py-2.5 text-xs font-medium uppercase tracking-wider ${col === "Asset" || col === "Action" ? "text-left" : "text-right"}`}
                  style={{ color: "var(--text-muted)" }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => {
              const st  = actionStyle[item.action];
              const cat = categoryColor[item.category];
              const diffPos = item.diffPercent >= 0;

              return (
                <tr key={item.ticker} className="border-b" style={{ borderColor: "var(--border-subtle)" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs px-1.5 py-0.5 rounded font-medium shrink-0"
                        style={{ color: cat, background: `${cat}18` }}
                      >
                        {item.category}
                      </span>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{item.ticker}</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{item.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-right" style={{ color: "var(--text-secondary)" }}>
                    ${fmt(item.currentValue)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right" style={{ color: "var(--text-secondary)" }}>
                    {item.currentPercent.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-sm text-right" style={{ color: "var(--text-muted)" }}>
                    {item.targetPercent}%
                  </td>
                  <td className="px-4 py-3 text-sm text-right" style={{ color: "var(--text-secondary)" }}>
                    ${fmt(item.targetValue)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium" style={{ color: diffPos ? "var(--green)" : "var(--red)" }}>
                    {diffPos ? "+" : ""}{item.diffPercent.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium" style={{ color: diffPos ? "var(--green)" : "var(--red)" }}>
                    {diffPos ? "+" : ""}${fmt(item.diffValue)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{ color: st.color, background: `${st.color}18` }}
                    >
                      {item.action}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
