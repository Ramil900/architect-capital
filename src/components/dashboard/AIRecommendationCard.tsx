import { BrainCircuit } from "lucide-react";
import { portfolioData } from "@/constants/demo-portfolio";
import { aiAnalysis } from "@/constants/demo-ai";

const actionColors: Record<string, string> = {
  Buy:    "var(--green)",
  Hold:   "var(--yellow)",
  Reduce: "var(--red)",
  Sell:   "var(--red)",
};

function TagGroup({ label, items, color }: { label: string; items: string[]; color: string }) {
  if (!items.length) return null;
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs w-12 shrink-0" style={{ color: "var(--text-muted)" }}>{label}</span>
      {items.map((item) => (
        <span key={item} className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: `${color}18`, color }}>
          {item}
        </span>
      ))}
    </div>
  );
}

export default function AIRecommendationCard() {
  const buy    = portfolioData.positions.filter((p) => p.aiAction === "Buy").map((p) => p.ticker);
  const hold   = portfolioData.positions.filter((p) => p.aiAction === "Hold").map((p) => p.ticker);
  const reduce = portfolioData.positions.filter((p) => p.aiAction === "Reduce").map((p) => p.ticker);

  return (
    <div className="rounded-lg p-5 border" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <div className="flex items-center gap-2 mb-3">
        <BrainCircuit size={14} style={{ color: "var(--accent)" }} />
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          AI Recommendation
        </p>
      </div>

      <p className="text-xs mb-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {aiAnalysis.finalSummary}
      </p>

      <div className="flex flex-col gap-2">
        <TagGroup label="Buy"    items={buy}    color={actionColors.Buy}    />
        <TagGroup label="Hold"   items={hold}   color={actionColors.Hold}   />
        <TagGroup label="Reduce" items={reduce} color={actionColors.Reduce} />
      </div>

      <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor: "var(--border-subtle)" }}>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>DCA Status</span>
        <span className="text-xs font-medium" style={{ color: "var(--yellow)" }}>{aiAnalysis.dcaStatus}</span>
      </div>
    </div>
  );
}
