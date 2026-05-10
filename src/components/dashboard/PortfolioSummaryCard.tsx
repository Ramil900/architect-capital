import { TrendingUp, TrendingDown, ShieldAlert } from "lucide-react";
import type { RiskLevel } from "@/types/ai";

interface Props {
  totalValue:    number;
  totalPL:       number;
  totalPLPercent: number;
  portfolioRisk: RiskLevel;
}

function PLBadge({ value, percent }: { value: number; percent: number }) {
  const positive = value >= 0;
  return (
    <span className="flex items-center gap-1 text-xs font-medium" style={{ color: positive ? "var(--green)" : "var(--red)" }}>
      {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {positive ? "+" : ""}{value.toLocaleString(undefined, { maximumFractionDigits: 0 })} ({positive ? "+" : ""}{percent.toFixed(2)}%)
    </span>
  );
}

const riskColor: Record<RiskLevel, string> = {
  Low:      "var(--green)",
  Moderate: "var(--yellow)",
  High:     "var(--red)",
  Critical: "var(--red)",
};

export default function PortfolioSummaryCard({ totalValue, totalPL, totalPLPercent, portfolioRisk }: Props) {
  return (
    <div className="rounded-lg p-5 border" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
        Portfolio Value
      </p>

      <p className="text-3xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
        ${Math.round(totalValue).toLocaleString()}
      </p>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Unrealized P/L</span>
          <PLBadge value={totalPL} percent={totalPLPercent} />
        </div>
        <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: "var(--border-subtle)" }}>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Risk Level</span>
          <span className="flex items-center gap-1 text-xs font-medium" style={{ color: riskColor[portfolioRisk] }}>
            <ShieldAlert size={12} />
            {portfolioRisk}
          </span>
        </div>
      </div>
    </div>
  );
}
