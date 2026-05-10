import { TrendingUp, TrendingDown } from "lucide-react";
import type { MarketIndicator } from "@/types/market";

interface Props {
  indicators: MarketIndicator[];
}

const OVERVIEW_SYMBOLS = ["VIX", "DXY", "US10Y", "SPX", "IXIC", "BTC", "XAU"];

const statusColor: Record<string, string> = {
  Normal:  "var(--green)",
  Caution: "var(--yellow)",
  Danger:  "var(--red)",
};

export default function MarketOverviewGrid({ indicators }: Props) {
  const visible = OVERVIEW_SYMBOLS
    .map((sym) => indicators.find((i) => i.symbol === sym))
    .filter((i): i is MarketIndicator => i !== undefined);

  return (
    <div className="rounded-lg p-5 border" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
        Market Indicators
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {visible.map((ind) => {
          const positive = ind.dailyChangePct >= 0;
          return (
            <div key={ind.symbol} className="rounded p-3 border" style={{ background: "var(--bg-hover)", borderColor: "var(--border-subtle)" }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{ind.symbol}</span>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor[ind.status] }} />
              </div>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{ind.displayValue}</p>
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
