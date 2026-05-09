import { BrainCircuit } from "lucide-react";
import type { AIAnalysisData } from "@/types/ai";

const regimeColor: Record<string, string> = {
  "Risk-On":    "var(--green)",
  "Neutral":    "var(--yellow)",
  "Risk-Off":   "#f97316",
  "Crisis Mode":"var(--red)",
};

const riskColor: Record<string, string> = {
  Low:      "var(--green)",
  Moderate: "var(--yellow)",
  High:     "#f97316",
  Critical: "var(--red)",
};

interface Props {
  data: AIAnalysisData;
}

export default function AISummaryCard({ data }: Props) {
  const rc = regimeColor[data.marketRegime];
  const pc = riskColor[data.portfolioRisk];
  const scoreColor = data.riskScore < 30 ? "var(--green)" : data.riskScore < 60 ? "var(--yellow)" : "var(--red)";

  return (
    <div
      className="rounded-lg border p-5 grid grid-cols-2 sm:grid-cols-4 gap-6"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div>
        <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
          AI Engine
        </p>
        <div className="flex items-center gap-2">
          <BrainCircuit size={16} style={{ color: "var(--accent)" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Active
          </span>
          <span
            className="text-xs px-1.5 py-0.5 rounded font-medium"
            style={{ color: "var(--green)", background: "color-mix(in srgb, var(--green) 12%, transparent)" }}
          >
            {data.confidence}% conf.
          </span>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
          Market Regime
        </p>
        <span
          className="text-sm font-bold px-2.5 py-1 rounded"
          style={{ color: rc, background: `${rc}18` }}
        >
          {data.marketRegime}
        </span>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
          Portfolio Risk
        </p>
        <div className="flex items-end gap-1.5">
          <span className="text-2xl font-bold" style={{ color: scoreColor }}>{data.riskScore}</span>
          <span className="text-sm mb-0.5" style={{ color: "var(--text-muted)" }}>/100</span>
          <span
            className="text-xs px-1.5 py-0.5 rounded font-medium mb-0.5"
            style={{ color: pc, background: `${pc}18` }}
          >
            {data.portfolioRisk}
          </span>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
          Last Updated
        </p>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {data.lastUpdated}
        </p>
      </div>
    </div>
  );
}
