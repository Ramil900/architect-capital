import { TrendingUp, TrendingDown, ShieldAlert } from "lucide-react";

const data = {
  totalValue: 165000,
  dailyPL: 1250,
  dailyPLPercent: 0.76,
  monthlyPL: 7400,
  monthlyPLPercent: 4.7,
  portfolioRisk: "Medium-High",
};

function PLBadge({ value, percent }: { value: number; percent: number }) {
  const positive = value >= 0;
  return (
    <span
      className="flex items-center gap-1 text-xs font-medium"
      style={{ color: positive ? "var(--green)" : "var(--red)" }}
    >
      {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {positive ? "+" : ""}
      {value.toLocaleString()} ({positive ? "+" : ""}
      {percent.toFixed(2)}%)
    </span>
  );
}

export default function PortfolioSummaryCard() {
  return (
    <div
      className="rounded-lg p-5 border"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border)",
      }}
    >
      <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
        Portfolio Value
      </p>

      <p className="text-3xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
        ${data.totalValue.toLocaleString()}
      </p>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Daily P/L</span>
          <PLBadge value={data.dailyPL} percent={data.dailyPLPercent} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Monthly P/L</span>
          <PLBadge value={data.monthlyPL} percent={data.monthlyPLPercent} />
        </div>
        <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: "var(--border-subtle)" }}>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Risk Level</span>
          <span className="flex items-center gap-1 text-xs font-medium" style={{ color: "var(--yellow)" }}>
            <ShieldAlert size={12} />
            {data.portfolioRisk}
          </span>
        </div>
      </div>
    </div>
  );
}
