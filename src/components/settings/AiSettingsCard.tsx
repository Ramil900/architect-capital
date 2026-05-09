"use client";

import { useState } from "react";
import { BrainCircuit } from "lucide-react";
import type { AppSettings, AIMode } from "@/types/settings";

const modes: AIMode[] = ["Conservative", "Balanced", "Aggressive"];

const modeDesc: Record<AIMode, string> = {
  Conservative: "Prioritises capital preservation. Fewer signals, lower risk tolerance.",
  Balanced:     "Balanced risk/reward. Recommended for most portfolios.",
  Aggressive:   "Maximises return potential. Higher signal frequency and risk tolerance.",
};

const modeColor: Record<AIMode, string> = {
  Conservative: "var(--green)",
  Balanced:     "var(--accent)",
  Aggressive:   "#f97316",
};

interface Props {
  settings: AppSettings;
}

export default function AiSettingsCard({ settings }: Props) {
  const [mode, setMode] = useState<AIMode>(settings.aiMode);

  return (
    <div className="rounded-lg border p-5 flex flex-col gap-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <div className="flex items-center gap-2">
        <BrainCircuit size={14} style={{ color: "var(--accent)" }} />
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          AI Settings
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs" style={{ color: "var(--text-muted)" }}>AI Mode</label>
        <div className="flex gap-2">
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="flex-1 text-xs font-semibold py-2 rounded border transition-colors"
              style={
                mode === m
                  ? { borderColor: modeColor[m], color: modeColor[m], background: `${modeColor[m]}18` }
                  : { borderColor: "var(--border)", color: "var(--text-muted)", background: "transparent" }
              }
            >
              {m}
            </button>
          ))}
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {modeDesc[mode]}
        </p>
      </div>
    </div>
  );
}
