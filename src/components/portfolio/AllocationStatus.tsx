import type { PortfolioPosition } from "@/types/portfolio";

interface Props {
  positions: PortfolioPosition[];
}

function Bar({ current, target }: { current: number; target: number }) {
  const diff  = current - target;
  const isOver = diff > 0;
  const maxBar = Math.max(current, target, 1);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-hover)" }}>
          <div className="h-full rounded-full" style={{ width: `${Math.min((current / maxBar) * 100, 100)}%`, background: isOver ? "var(--red)" : "var(--green)" }} />
        </div>
        <span className="text-xs w-10 text-right" style={{ color: isOver ? "var(--red)" : "var(--green)" }}>{current.toFixed(1)}%</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-hover)" }}>
          <div className="h-full rounded-full" style={{ width: `${Math.min((target / maxBar) * 100, 100)}%`, background: "var(--text-muted)" }} />
        </div>
        <span className="text-xs w-10 text-right" style={{ color: "var(--text-muted)" }}>{target.toFixed(1)}%</span>
      </div>
    </div>
  );
}

export default function AllocationStatus({ positions }: Props) {
  return (
    <div className="rounded-lg border p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>Allocation Status</p>
      <div className="flex flex-col gap-4">
        {positions.map((p) => (
          <div key={p.id} className="flex items-center gap-3">
            <span className="text-xs font-medium w-12 shrink-0" style={{ color: "var(--text-secondary)" }}>{p.ticker}</span>
            <div className="flex-1"><Bar current={p.currentPercent} target={p.targetPercent} /></div>
            <span className="text-xs font-medium w-12 text-right shrink-0" style={{ color: p.differencePercent >= 0 ? "var(--green)" : "var(--red)" }}>
              {p.differencePercent >= 0 ? "+" : ""}{p.differencePercent.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-4 pt-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1.5 rounded-full" style={{ background: "var(--green)" }} />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1.5 rounded-full" style={{ background: "var(--text-muted)" }} />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Target</span>
        </div>
      </div>
    </div>
  );
}
