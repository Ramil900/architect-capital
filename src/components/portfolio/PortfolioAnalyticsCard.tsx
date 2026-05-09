import type { PortfolioSummaryData } from "@/types/portfolio";

interface Props {
  data: PortfolioSummaryData;
}

export default function PortfolioAnalyticsCard({ data }: Props) {
  const { positions } = data;
  const winners  = positions.filter((p) => p.unrealizedPL > 0).length;
  const losers   = positions.filter((p) => p.unrealizedPL < 0).length;
  const bestPos  = positions.reduce((a, b) => (a.unrealizedPLPercent > b.unrealizedPLPercent ? a : b));
  const worstPos = positions.reduce((a, b) => (a.unrealizedPLPercent < b.unrealizedPLPercent ? a : b));
  const buyCount    = positions.filter((p) => p.aiAction === "Buy").length;
  const holdCount   = positions.filter((p) => p.aiAction === "Hold").length;
  const reduceCount = positions.filter((p) => p.aiAction === "Reduce").length;

  const rows = [
    { label: "Winners / Losers",        value: `${winners} / ${losers}` },
    { label: "Best Performer",          value: `${bestPos.ticker}  +${bestPos.unrealizedPLPercent.toFixed(1)}%`, positive: true },
    { label: "Worst Performer",         value: `${worstPos.ticker}  ${worstPos.unrealizedPLPercent.toFixed(1)}%`, negative: worstPos.unrealizedPLPercent < 0 },
    { label: "AI: Buy / Hold / Reduce", value: `${buyCount} / ${holdCount} / ${reduceCount}` },
  ];

  return (
    <div className="rounded-lg border p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>Analytics</p>
      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-2">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{row.label}</span>
            <span className="text-sm font-medium" style={{ color: row.positive ? "var(--green)" : row.negative ? "var(--red)" : "var(--text-primary)" }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>Portfolio Health</p>
        <div className="flex gap-1 h-2 rounded-full overflow-hidden">
          <div style={{ width: `${(buyCount / positions.length) * 100}%`, background: "var(--green)" }} />
          <div style={{ width: `${(holdCount / positions.length) * 100}%`, background: "var(--yellow)" }} />
          <div style={{ width: `${(reduceCount / positions.length) * 100}%`, background: "var(--red)" }} />
        </div>
        <div className="flex gap-3 mt-2">
          {[{ label: "Buy", color: "var(--green)", count: buyCount }, { label: "Hold", color: "var(--yellow)", count: holdCount }, { label: "Reduce", color: "var(--red)", count: reduceCount }].map((item) => (
            <div key={item.label} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{item.label} {item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
