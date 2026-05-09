import type { MarketData } from "@/types/market";

const regimeStyle: Record<string, { color: string; bg: string }> = {
  "Risk-On":    { color: "var(--green)",  bg: "var(--green)"  },
  "Neutral":    { color: "var(--yellow)", bg: "var(--yellow)" },
  "Risk-Off":   { color: "#f97316",       bg: "#f97316"       },
  "Crisis Mode":{ color: "var(--red)",    bg: "var(--red)"    },
};

interface Props {
  data: MarketData;
}

export default function MarketSummary({ data }: Props) {
  const rs = regimeStyle[data.regime];

  const normal  = data.indicators.filter((i) => i.status === "Normal").length;
  const caution = data.indicators.filter((i) => i.status === "Caution").length;
  const danger  = data.indicators.filter((i) => i.status === "Danger").length;

  return (
    <div
      className="rounded-lg border p-5 grid grid-cols-2 sm:grid-cols-4 gap-6"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div>
        <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
          Market Regime
        </p>
        <span
          className="inline-block text-sm font-bold px-3 py-1 rounded"
          style={{ color: rs.color, background: `${rs.bg}18` }}
        >
          {data.regime}
        </span>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
          VIX
        </p>
        <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          {data.vix}
        </p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
          Risk Score
        </p>
        <p className="text-2xl font-bold" style={{ color: data.riskScore > 40 ? "var(--red)" : data.riskScore > 20 ? "var(--yellow)" : "var(--green)" }}>
          {data.riskScore}<span className="text-sm font-normal" style={{ color: "var(--text-muted)" }}> / 100</span>
        </p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
          Signal Breakdown
        </p>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium" style={{ color: "var(--green)" }}>{normal} Normal</span>
          <span className="text-sm font-medium" style={{ color: "var(--yellow)" }}>{caution} Caution</span>
          {danger > 0 && (
            <span className="text-sm font-medium" style={{ color: "var(--red)" }}>{danger} Danger</span>
          )}
        </div>
      </div>
    </div>
  );
}
