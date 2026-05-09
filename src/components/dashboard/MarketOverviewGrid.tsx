import { TrendingUp, TrendingDown } from "lucide-react";

const indicators = [
  { name: "VIX",     value: 21.4,   change: +1.2,  status: "Caution" },
  { name: "DXY",     value: 105.2,  change: +0.4,  status: "Caution" },
  { name: "US10Y",   value: 4.32,   change: +0.03, status: "Caution" },
  { name: "S&P500",  value: 5248,   change: -0.5,  status: "Normal"  },
  { name: "Nasdaq",  value: 18450,  change: -0.8,  status: "Caution" },
  { name: "BTC",     value: 67800,  change: -1.4,  status: "Caution" },
  { name: "Gold",    value: 2345,   change: +0.6,  status: "Normal"  },
];

const statusColor: Record<string, string> = {
  Normal:  "var(--green)",
  Caution: "var(--yellow)",
  Danger:  "var(--red)",
};

export default function MarketOverviewGrid() {
  return (
    <div
      className="rounded-lg p-5 border"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
        Market Indicators
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {indicators.map((ind) => {
          const positive = ind.change >= 0;
          return (
            <div
              key={ind.name}
              className="rounded p-3 border"
              style={{ background: "var(--bg-hover)", borderColor: "var(--border-subtle)" }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                  {ind.name}
                </span>
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: statusColor[ind.status] }}
                />
              </div>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                {ind.value.toLocaleString()}
              </p>
              <div className="flex items-center gap-0.5" style={{ color: positive ? "var(--green)" : "var(--red)" }}>
                {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                <span className="text-xs">
                  {positive ? "+" : ""}{ind.change}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
