import type { DCASummaryData, DCAAction } from "@/types/dca";

const actionStyle: Record<DCAAction, { color: string; label: string }> = {
  "Buy Now":       { color: "var(--green)",  label: "Buy Now"  },
  "Wait for Zone": { color: "var(--yellow)", label: "Wait"     },
  "Avoid":         { color: "var(--red)",    label: "Avoid"    },
};

function fmt(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

interface Props {
  data: DCASummaryData;
}

export default function DcaRecommendationPanel({ data }: Props) {
  return (
    <div
      className="rounded-lg border p-5 flex flex-col gap-4"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
        DCA Recommendations
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
                <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                  {rec.ticker}
                </span>
                <div className="flex items-center gap-2">
                  {rec.amount !== null && (
                    <span className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
                      ${fmt(rec.amount)}
                    </span>
                  )}
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded shrink-0"
                    style={{ color: st.color, background: `${st.color}18` }}
                  >
                    {st.label}
                  </span>
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {rec.note}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
