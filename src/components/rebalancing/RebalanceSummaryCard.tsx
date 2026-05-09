import type { RebalanceSummaryData } from "@/types/rebalancing";

function fmt(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

interface Props {
  data: RebalanceSummaryData;
}

export default function RebalanceSummaryCard({ data }: Props) {
  const scoreColor =
    data.balanceScore >= 80 ? "var(--green)" :
    data.balanceScore >= 60 ? "var(--yellow)" : "var(--red)";

  return (
    <div
      className="rounded-lg border p-5 grid grid-cols-2 sm:grid-cols-5 gap-6"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div>
        <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
          Total Value
        </p>
        <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          ${fmt(data.totalValue)}
        </p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
          Balance Score
        </p>
        <div className="flex items-end gap-1.5">
          <p className="text-2xl font-bold" style={{ color: scoreColor }}>{data.balanceScore}</p>
          <p className="text-sm mb-0.5" style={{ color: "var(--text-muted)" }}>/100</p>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
          Actions Needed
        </p>
        <p className="text-2xl font-bold" style={{ color: data.actionsNeeded > 0 ? "var(--yellow)" : "var(--green)" }}>
          {data.actionsNeeded}
        </p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
          Buy Needed
        </p>
        <p className="text-2xl font-bold" style={{ color: "var(--green)" }}>
          +${fmt(data.totalBuyNeeded)}
        </p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
          Reduce Needed
        </p>
        <p className="text-2xl font-bold" style={{ color: "var(--red)" }}>
          -${fmt(data.totalReduceNeeded)}
        </p>
      </div>
    </div>
  );
}
