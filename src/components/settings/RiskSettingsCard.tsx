"use client";

import { useState } from "react";
import type { AppSettings } from "@/types/settings";

interface Props {
  settings: AppSettings;
}

export default function RiskSettingsCard({ settings }: Props) {
  const [leverage, setLeverage]       = useState(settings.leverage);
  const [threshold, setThreshold]     = useState(settings.aiRebalanceThreshold);

  return (
    <div className="rounded-lg border p-5 flex flex-col gap-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
        Risk Parameters
      </p>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs" style={{ color: "var(--text-muted)" }}>
          Leverage: {leverage.toFixed(1)}x
        </label>
        <input
          type="range" min={0} max={3} step={0.1} value={leverage}
          onChange={(e) => setLeverage(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none"
          style={{ accentColor: leverage > 1 ? "var(--red)" : "var(--accent)" }}
        />
        <div className="flex justify-between">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>0x (No leverage)</span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>3x</span>
        </div>
        {leverage > 1 && (
          <p className="text-xs" style={{ color: "var(--red)" }}>
            ⚠ Leverage above 1x increases liquidation risk.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs" style={{ color: "var(--text-muted)" }}>
          AI Rebalance Threshold: ±{threshold}%
        </label>
        <input
          type="range" min={1} max={10} step={0.5} value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none"
          style={{ accentColor: "var(--accent)" }}
        />
        <div className="flex justify-between">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>1% (Frequent)</span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>10% (Rare)</span>
        </div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          AI triggers rebalancing when any position drifts more than ±{threshold}% from target.
        </p>
      </div>
    </div>
  );
}
