import { Activity } from "lucide-react";
import { REGIME_CONFIG } from "@/constants/risk-levels";
import type { MarketRegime } from "@/types/market";

interface Props {
  regime:    MarketRegime;
  vix:       number;
  riskScore: number;
}

export default function MarketRegimeCard({ regime, vix, riskScore }: Props) {
  const config = REGIME_CONFIG[regime];

  return (
    <div className="rounded-lg p-5 border" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
        Market Regime
      </p>

      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full" style={{ background: config.color }} />
        <span className="text-xl font-semibold" style={{ color: config.color }}>{regime}</span>
      </div>

      <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>{config.desc}</p>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>VIX</span>
          <span className="text-xs font-medium" style={{ color: "var(--yellow)" }}>{vix}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Risk Score</span>
          <span className="flex items-center gap-1 text-xs font-medium" style={{ color: "var(--yellow)" }}>
            <Activity size={11} />
            {riskScore}/100
          </span>
        </div>
      </div>
    </div>
  );
}
