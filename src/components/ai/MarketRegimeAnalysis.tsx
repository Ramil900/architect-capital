import type { AIAnalysisData } from "@/types/ai";

const regimeColor: Record<string, string> = {
  "Risk-On":    "var(--green)",
  "Neutral":    "var(--yellow)",
  "Risk-Off":   "#f97316",
  "Crisis Mode":"var(--red)",
};

const regimeDesc: Record<string, string> = {
  "Risk-On":    "Условия благоприятны для рисковых активов. Акции и крипто исторически опережают рынок.",
  "Neutral":    "Смешанные сигналы. Рекомендуется сбалансированное позиционирование.",
  "Risk-Off":   "Защитная позиция. Сократите спекулятивные позиции.",
  "Crisis Mode":"Крайний стресс. Приоритет — сохранение капитала.",
};

const regimeHistory = [
  { period: "Feb – Mar", regime: "Neutral",  color: "var(--yellow)" },
  { period: "Mar – Apr", regime: "Risk-Off", color: "#f97316"       },
  { period: "Apr – May", regime: "Risk-On",  color: "var(--green)"  },
];

interface Props {
  data: AIAnalysisData;
}

export default function MarketRegimeAnalysis({ data }: Props) {
  const color = regimeColor[data.marketRegime];

  return (
    <div
      className="rounded-lg border p-5 flex flex-col gap-4"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
        Market Regime
      </p>

      <div>
        <span
          className="text-sm font-bold px-3 py-1 rounded"
          style={{ color, background: `${color}18` }}
        >
          {data.marketRegime}
        </span>
        <p className="text-xs mt-2 leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {regimeDesc[data.marketRegime]}
        </p>
      </div>

      <div>
        <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>Regime History</p>
        <div className="flex flex-col gap-1.5">
          {regimeHistory.map((r) => (
            <div key={r.period} className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{r.period}</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ color: r.color, background: `${r.color}18` }}>
                {r.regime}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
