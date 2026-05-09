"use client";

import { useState } from "react";
import type { AppSettings, BaseCurrency } from "@/types/settings";

const currencies: { value: BaseCurrency; label: string; symbol: string }[] = [
  { value: "USD", label: "US Dollar",     symbol: "$" },
  { value: "EUR", label: "Euro",          symbol: "€" },
  { value: "GBP", label: "British Pound", symbol: "£" },
];

interface Props {
  settings: AppSettings;
}

export default function CurrencySettingsCard({ settings }: Props) {
  const [currency, setCurrency] = useState<BaseCurrency>(settings.baseCurrency);

  return (
    <div className="rounded-lg border p-5 flex flex-col gap-4" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
        Currency Settings
      </p>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs" style={{ color: "var(--text-muted)" }}>Base Currency</label>
        <div className="flex flex-col gap-2">
          {currencies.map((c) => (
            <button
              key={c.value}
              onClick={() => setCurrency(c.value)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 border text-left transition-colors"
              style={
                currency === c.value
                  ? { borderColor: "var(--accent)", background: "color-mix(in srgb, var(--accent) 8%, transparent)" }
                  : { borderColor: "var(--border)", background: "transparent" }
              }
            >
              <span
                className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold shrink-0"
                style={{
                  background: currency === c.value ? "color-mix(in srgb, var(--accent) 20%, transparent)" : "var(--bg-hover)",
                  color: currency === c.value ? "var(--accent)" : "var(--text-muted)",
                }}
              >
                {c.symbol}
              </span>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{c.value}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{c.label}</p>
              </div>
              {currency === c.value && (
                <span className="ml-auto text-xs font-medium" style={{ color: "var(--accent)" }}>Active</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
