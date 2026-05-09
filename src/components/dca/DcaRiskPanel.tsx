import { AlertTriangle } from "lucide-react";
import type { DCASummaryData } from "@/types/dca";

const riskColor: Record<string, string> = {
  "Low":         "var(--green)",
  "Medium":      "var(--yellow)",
  "Medium-High": "#f97316",
  "High":        "var(--red)",
  "Critical":    "var(--red)",
};

interface Props {
  data: DCASummaryData;
}

export default function DcaRiskPanel({ data }: Props) {
  const color = riskColor[data.riskLevel];

  return (
    <div
      className="rounded-lg border p-5 flex flex-col gap-4"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          DCA Risk Assessment
        </p>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded"
          style={{ color, background: `${color}18` }}
        >
          {data.riskLevel}
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {data.riskFactors.map((factor) => (
          <div key={factor} className="flex items-start gap-2">
            <AlertTriangle size={13} className="shrink-0 mt-0.5" style={{ color: "var(--yellow)" }} />
            <span className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {factor}
            </span>
          </div>
        ))}
      </div>

      <div
        className="rounded p-3 mt-1"
        style={{ background: "var(--bg-hover)", borderLeft: "2px solid var(--yellow)" }}
      >
        <p className="text-xs font-semibold mb-1" style={{ color: "var(--yellow)" }}>Avoid Aggressive Buying</p>
        <div className="flex gap-2 flex-wrap">
          {data.avoidAssets.map((ticker) => (
            <span
              key={ticker}
              className="text-xs font-medium px-2 py-0.5 rounded"
              style={{ color: "var(--red)", background: "color-mix(in srgb, var(--red) 12%, transparent)" }}
            >
              {ticker}
            </span>
          ))}
        </div>
      </div>

      <div
        className="rounded p-3"
        style={{ background: "var(--bg-hover)", borderLeft: "2px solid var(--green)" }}
      >
        <p className="text-xs font-semibold mb-1" style={{ color: "var(--green)" }}>Recommended for DCA</p>
        <div className="flex gap-2 flex-wrap">
          {data.recommendedAssets.map((ticker) => (
            <span
              key={ticker}
              className="text-xs font-medium px-2 py-0.5 rounded"
              style={{ color: "var(--green)", background: "color-mix(in srgb, var(--green) 12%, transparent)" }}
            >
              {ticker}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
