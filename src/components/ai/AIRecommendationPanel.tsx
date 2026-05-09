import type { AIAnalysisData } from "@/types/ai";
import type { AIAction } from "@/types/ai";

const actionStyle: Record<AIAction, { color: string }> = {
  Buy:    { color: "var(--green)"  },
  Hold:   { color: "var(--yellow)" },
  Reduce: { color: "#f97316"       },
  Sell:   { color: "var(--red)"    },
};

interface Props {
  data: AIAnalysisData;
}

export default function AIRecommendationPanel({ data }: Props) {
  return (
    <div
      className="rounded-lg border p-5 flex flex-col gap-4"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
        AI Recommendations
      </p>

      <div className="flex flex-col gap-4">
        {data.recommendations.map((rec) => {
          const st = actionStyle[rec.action];
          return (
            <div
              key={rec.ticker}
              className="flex flex-col gap-1.5 pb-4 border-b last:border-b-0 last:pb-0"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                    {rec.ticker}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{rec.name}</span>
                </div>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded shrink-0"
                  style={{ color: st.color, background: `${st.color}18` }}
                >
                  {rec.action}
                </span>
              </div>

              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {rec.reasoning}
              </p>

              {/* Confidence bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "var(--bg-hover)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${rec.confidence}%`, background: st.color }}
                  />
                </div>
                <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>
                  {rec.confidence}% conf.
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
