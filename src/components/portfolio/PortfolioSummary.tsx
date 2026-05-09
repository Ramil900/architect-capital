import { Layers } from "lucide-react";
import type { PortfolioSummaryData } from "@/types/portfolio";

function fmt(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function PLCell({ value, percent }: { value: number; percent: number }) {
  const pos = value >= 0;
  return (
    <div className="flex flex-col">
      <span className="text-sm font-semibold" style={{ color: pos ? "var(--green)" : "var(--red)" }}>
        {pos ? "+" : ""}${fmt(value)}
      </span>
      <span className="text-xs" style={{ color: pos ? "var(--green)" : "var(--red)" }}>
        {pos ? "+" : ""}{percent.toFixed(2)}%
      </span>
    </div>
  );
}

export default function PortfolioSummary({ data }: { data: PortfolioSummaryData }) {
  return (
    <div
      className="rounded-lg p-5 border grid grid-cols-2 sm:grid-cols-4 gap-6"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div>
        <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>Total Value</p>
        <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>${fmt(data.totalValue)}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>Invested</p>
        <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>${fmt(data.totalInvested)}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>Total P/L</p>
        <PLCell value={data.totalPL} percent={data.totalPLPercent} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>Positions</p>
        <div className="flex items-center gap-2">
          <Layers size={16} style={{ color: "var(--accent)" }} />
          <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{data.positions.length}</p>
        </div>
      </div>
    </div>
  );
}
