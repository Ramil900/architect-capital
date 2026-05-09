"use client";

import { useState } from "react";
import type { AppSettings, RiskProfile, InvestmentHorizon } from "@/types/settings";

const riskProfiles: RiskProfile[]          = ["Conservative", "Moderate", "Aggressive", "Custom"];
const horizons: InvestmentHorizon[]        = ["Short", "Medium", "Long"];

const riskColor: Record<RiskProfile, string> = {
  Conservative: "var(--green)",
  Moderate:     "var(--yellow)",
  Aggressive:   "#f97316",
  Custom:       "var(--accent)",
};

interface Props {
  settings: AppSettings;
}

export default function StrategySettingsCard({ settings }: Props) {
  const [riskProfile, setRiskProfile]       = useState(settings.riskProfile);
  const [horizon, setHorizon]               = useState(settings.investmentHorizon);
  const [maxDrawdown, setMaxDrawdown]       = useState(settings.maxDrawdown);
  const [cashReserve, setCashReserve]       = useState(settings.cashReservePercent);

  return (
    <div className="rounded-lg border p-5 flex flex-col gap-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
        Investment Strategy
      </p>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs" style={{ color: "var(--text-muted)" }}>Risk Profile</label>
        <div className="flex gap-2 flex-wrap">
          {riskProfiles.map((p) => (
            <button
              key={p}
              onClick={() => setRiskProfile(p)}
              className="text-xs font-semibold px-3 py-1.5 rounded border transition-colors"
              style={
                riskProfile === p
                  ? { borderColor: riskColor[p], color: riskColor[p], background: `${riskColor[p]}18` }
                  : { borderColor: "var(--border)", color: "var(--text-muted)", background: "transparent" }
              }
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs" style={{ color: "var(--text-muted)" }}>Investment Horizon</label>
        <div className="flex gap-2">
          {horizons.map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className="text-xs font-semibold px-3 py-1.5 rounded border transition-colors"
              style={
                horizon === h
                  ? { borderColor: "var(--accent)", color: "var(--accent)", background: "color-mix(in srgb, var(--accent) 12%, transparent)" }
                  : { borderColor: "var(--border)", color: "var(--text-muted)", background: "transparent" }
              }
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SliderField
          label={`Max Drawdown: ${maxDrawdown}%`}
          value={maxDrawdown}
          min={10} max={80}
          onChange={setMaxDrawdown}
          color="var(--red)"
        />
        <SliderField
          label={`Cash Reserve: ${cashReserve}%`}
          value={cashReserve}
          min={0} max={50}
          onChange={setCashReserve}
          color="var(--green)"
        />
      </div>
    </div>
  );
}

function SliderField({ label, value, min, max, onChange, color }: {
  label: string; value: number; min: number; max: number;
  onChange: (v: number) => void; color: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</label>
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none"
        style={{ accentColor: color }}
      />
      <div className="flex justify-between">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{min}%</span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{max}%</span>
      </div>
    </div>
  );
}
