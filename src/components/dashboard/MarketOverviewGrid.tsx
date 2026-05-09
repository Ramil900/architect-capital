import { TrendingUp, TrendingDown } from "lucide-react";
import { marketData } from "@/constants/demo-market";

const OVERVIEW_IDS = ["vix", "dxy", "us10y", "sp500", "nasdaq", "btc", "gold"] as const;

const statusColor: Record<string, string> = {
  Normal:  "var(--green)",
  Caution: "var(--yellow)",
  Danger:  "var(--red)",
};

export default function MarketOverviewGrid() {
  const indicators = OVERVIEW_IDS.map((id) => marketData.indicators.find((i) => i.id === id)!);

  return (
    <div className="rounded-lg p-5 border" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
        Market Indicators
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {indicators.map((ind) => {
          const positive = ind.dailyChangePct >= 0;
          return (
            <div key={ind.id} className="rounded p-3 border" style={{ background: "var(--bg-hover)", borderColor: "var(--border-subtle)" }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{ind.symbol}</span>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor[ind.status] }} />
              </div>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                {ind.displayValue}
              </p>
              <div className="flex items-center gap-0.5" style={{ color: positive ? "var(--green)" : "var(--red)" }}>
                {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                <span className="text-xs">{positive ? "+" : ""}{ind.dailyChangePct.toFixed(2)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
