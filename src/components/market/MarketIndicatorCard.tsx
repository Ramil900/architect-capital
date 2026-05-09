import type { MarketIndicator } from "@/types/market";

const statusStyle: Record<string, { color: string; bg: string; label: string }> = {
  Normal:  { color: "var(--green)",  bg: "var(--green)",  label: "Normal"  },
  Caution: { color: "var(--yellow)", bg: "var(--yellow)", label: "Caution" },
  Danger:  { color: "var(--red)",    bg: "var(--red)",    label: "Danger"  },
};

const categoryColor: Record<string, string> = {
  Volatility: "#8b5cf6",
  Currency:   "#3b82f6",
  Rates:      "#f59e0b",
  Equity:     "#22c55e",
  Metals:     "#94a3b8",
  Crypto:     "#f97316",
};

function Change({ pct }: { pct: number }) {
  const pos = pct >= 0;
  return (
    <span
      className="text-xs font-medium"
      style={{ color: pos ? "var(--green)" : "var(--red)" }}
    >
      {pos ? "+" : ""}{pct.toFixed(2)}%
    </span>
  );
}

interface Props {
  indicator: MarketIndicator;
}

export default function MarketIndicatorCard({ indicator: ind }: Props) {
  const st = statusStyle[ind.status];

  return (
    <div
      className="rounded-lg border p-4 flex flex-col gap-3"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="text-xs font-medium px-1.5 py-0.5 rounded shrink-0"
            style={{ color: categoryColor[ind.category], background: `${categoryColor[ind.category]}18` }}
          >
            {ind.category}
          </span>
          <span className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
            {ind.symbol}
          </span>
        </div>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded shrink-0"
          style={{ color: st.color, background: `${st.bg}18` }}
        >
          {st.label}
        </span>
      </div>

      <div>
        <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>{ind.name}</p>
        <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          {ind.displayValue}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>1D</span>
          <Change pct={ind.dailyChangePct} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>1W</span>
          <Change pct={ind.weeklyChangePct} />
        </div>
      </div>

      <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
        {ind.interpretation}
      </p>
    </div>
  );
}
