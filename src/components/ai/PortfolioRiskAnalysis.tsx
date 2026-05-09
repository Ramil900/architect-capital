import { AlertTriangle } from "lucide-react";
import type { AIAnalysisData } from "@/types/ai";

interface Props {
  data: AIAnalysisData;
}

export default function PortfolioRiskAnalysis({ data }: Props) {
  const score = data.riskScore;
  const scoreColor = score < 30 ? "var(--green)" : score < 60 ? "var(--yellow)" : "var(--red)";

  return (
    <div
      className="rounded-lg border p-5 flex flex-col gap-4"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
        Portfolio Risk Analysis
      </p>

      {/* Score */}
      <div className="flex items-end gap-2">
        <span className="text-5xl font-bold" style={{ color: scoreColor }}>{score}</span>
        <span className="text-lg mb-1" style={{ color: "var(--text-muted)" }}>/100</span>
        <span
          className="text-xs font-semibold px-2 py-1 rounded mb-1"
          style={{ color: scoreColor, background: `${scoreColor}18` }}
        >
          {data.portfolioRisk}
        </span>
      </div>

      {/* Bar */}
      <div className="flex gap-0.5 h-1.5 rounded-full overflow-hidden">
        <div style={{ width: "30%", background: "var(--green)",  opacity: score <= 30 ? 1 : 0.25 }} />
        <div style={{ width: "30%", background: "var(--yellow)", opacity: score > 30 && score <= 60 ? 1 : 0.25 }} />
        <div style={{ width: "20%", background: "#f97316",       opacity: score > 60 && score <= 80 ? 1 : 0.25 }} />
        <div style={{ width: "20%", background: "var(--red)",    opacity: score > 80 ? 1 : 0.25 }} />
      </div>

      {/* Risk factors */}
      <div>
        <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>Main Risk Factors</p>
        <div className="flex flex-col gap-2">
          {data.mainRiskFactors.map((factor) => (
            <div key={factor} className="flex items-start gap-2">
              <AlertTriangle size={12} className="shrink-0 mt-0.5" style={{ color: "var(--yellow)" }} />
              <span className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {factor}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Final summary */}
      <div
        className="rounded p-3 text-xs leading-relaxed"
        style={{
          background: "var(--bg-hover)",
          borderLeft: "2px solid var(--accent)",
          color: "var(--text-secondary)",
        }}
      >
        {data.finalSummary}
      </div>
    </div>
  );
}
