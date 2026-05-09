"use client";

import { useState } from "react";
import type { AppSettings } from "@/types/settings";

const frequencies = ["Daily", "Weekly", "Bi-Weekly", "Monthly"];

interface Props {
  settings: AppSettings;
}

export default function DcaSettingsCard({ settings }: Props) {
  const [enabled,   setEnabled]   = useState(settings.dcaEnabled);
  const [amount,    setAmount]    = useState(settings.dcaAmount);
  const [frequency, setFrequency] = useState(settings.dcaFrequency);

  return (
    <div className="rounded-lg border p-5 flex flex-col gap-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          DCA Settings
        </p>
        <Toggle enabled={enabled} onChange={setEnabled} />
      </div>

      <div className="flex flex-col gap-1.5" style={{ opacity: enabled ? 1 : 0.4, pointerEvents: enabled ? "auto" : "none" }}>
        <label className="text-xs" style={{ color: "var(--text-muted)" }}>DCA Amount ($)</label>
        <input
          type="number" value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="rounded px-3 py-2 text-sm border outline-none"
          style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
        />
      </div>

      <div className="flex flex-col gap-1.5" style={{ opacity: enabled ? 1 : 0.4, pointerEvents: enabled ? "auto" : "none" }}>
        <label className="text-xs" style={{ color: "var(--text-muted)" }}>Frequency</label>
        <div className="flex gap-2 flex-wrap">
          {frequencies.map((f) => (
            <button
              key={f}
              onClick={() => setFrequency(f)}
              className="text-xs font-medium px-3 py-1.5 rounded border transition-colors"
              style={
                frequency === f
                  ? { borderColor: "var(--accent)", color: "var(--accent)", background: "color-mix(in srgb, var(--accent) 12%, transparent)" }
                  : { borderColor: "var(--border)", color: "var(--text-muted)", background: "transparent" }
              }
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="relative w-10 h-5 rounded-full transition-colors"
      style={{ background: enabled ? "var(--accent)" : "var(--border)" }}
    >
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full transition-transform"
        style={{
          background: "#fff",
          left: enabled ? "calc(100% - 18px)" : "2px",
        }}
      />
    </button>
  );
}
