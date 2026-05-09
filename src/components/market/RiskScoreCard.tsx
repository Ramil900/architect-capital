import type { MarketData } from "@/types/market";

const regimeStyle: Record<string, { color: string; bg: string; description: string }> = {
  "Risk-On":    { color: "var(--green)",  bg: "var(--green)",  description: "Markets favour risk assets. Equities and crypto historically outperform." },
  "Neutral":    { color: "var(--yellow)", bg: "var(--yellow)", description: "Mixed signals. Balanced positioning recommended across asset classes." },
  "Risk-Off":   { color: "#f97316",       bg: "#f97316",       description: "Defensive posture warranted. Reduce speculative exposure." },
  "Crisis Mode":{ color: "var(--red)",    bg: "var(--red)",    description: "Extreme stress. Capital preservation is the primary objective." },
};

const thresholds = [
  { label: "Risk-On",    max: 18,   color: "var(--green)"  },
  { label: "Neutral",    max: 25,   color: "var(--yellow)" },
  { label: "Risk-Off",   max: 35,   color: "#f97316"       },
  { label: "Crisis",     max: 50,   color: "var(--red)"    },
];

interface Props {
  data: MarketData;
}

export default function RiskScoreCard({ data }: Props) {
  const rs = regimeStyle[data.regime];
  const score = data.riskScore;
  const scoreColor = score > 40 ? "var(--red)" : score > 20 ? "var(--yellow)" : "var(--green)";

  return (
    <div
      className="rounded-lg border p-5 flex flex-col gap-4"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
        Risk Score
      </p>

      <div className="flex items-end gap-2">
        <span className="text-5xl font-bold" style={{ color: scoreColor }}>{score}</span>
        <span className="text-lg mb-1" style={{ color: "var(--text-muted)" }}>/100</span>
      </div>

      <div className="flex gap-1 h-2 rounded-full overflow-hidden">
        <div style={{ width: "30%", background: "var(--green)",  opacity: score <= 20 ? 1 : 0.3 }} />
        <div style={{ width: "30%", background: "var(--yellow)", opacity: score > 20 && score <= 40 ? 1 : 0.3 }} />
        <div style={{ width: "20%", background: "#f97316",       opacity: score > 40 && score <= 65 ? 1 : 0.3 }} />
        <div style={{ width: "20%", background: "var(--red)",    opacity: score > 65 ? 1 : 0.3 }} />
      </div>

      <div className="flex justify-between">
        {thresholds.map((t) => (
          <span key={t.label} className="text-xs" style={{ color: t.color, opacity: 0.7 }}>{t.label}</span>
        ))}
      </div>

      <div
        className="rounded p-3"
        style={{ background: `${rs.bg}10`, border: `1px solid ${rs.bg}30` }}
      >
        <p className="text-xs font-semibold mb-1" style={{ color: rs.color }}>{data.regime}</p>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {rs.description}
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>VIX Thresholds</p>
        {[
          { label: "Risk-On",    range: "< 18",    color: "var(--green)"  },
          { label: "Neutral",    range: "18 – 25",  color: "var(--yellow)" },
          { label: "Risk-Off",   range: "25 – 35",  color: "#f97316"       },
          { label: "Crisis",     range: "> 35",     color: "var(--red)"    },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{item.label}</span>
            </div>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{item.range}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
