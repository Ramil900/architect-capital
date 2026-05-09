import { BrainCircuit } from "lucide-react";

const data = {
  summary: "Market is neutral. Avoid aggressive buying. Gradual DCA is allowed.",
  buy: ["VOO", "GLD"],
  hold: ["SOXX", "SMH", "BTC"],
  reduce: ["TSLA"],
  dcaStatus: "Partial DCA only",
};

const actionColors: Record<string, string> = {
  buy:    "var(--green)",
  hold:   "var(--yellow)",
  reduce: "var(--red)",
};

function TagGroup({ label, items, color }: { label: string; items: string[]; color: string }) {
  if (!items.length) return null;
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs w-12 shrink-0" style={{ color: "var(--text-muted)" }}>{label}</span>
      {items.map((item) => (
        <span
          key={item}
          className="text-xs px-2 py-0.5 rounded font-medium"
          style={{ background: `${color}18`, color }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default function AIRecommendationCard() {
  return (
    <div
      className="rounded-lg p-5 border"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <BrainCircuit size={14} style={{ color: "var(--accent)" }} />
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          AI Recommendation
        </p>
      </div>

      <p className="text-xs mb-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {data.summary}
      </p>

      <div className="flex flex-col gap-2">
        <TagGroup label="Buy" items={data.buy} color={actionColors.buy} />
        <TagGroup label="Hold" items={data.hold} color={actionColors.hold} />
        <TagGroup label="Reduce" items={data.reduce} color={actionColors.reduce} />
      </div>

      <div
        className="mt-3 pt-3 border-t flex items-center justify-between"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>DCA Status</span>
        <span className="text-xs font-medium" style={{ color: "var(--yellow)" }}>
          {data.dcaStatus}
        </span>
      </div>
    </div>
  );
}
