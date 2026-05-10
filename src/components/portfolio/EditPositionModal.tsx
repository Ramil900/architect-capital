"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import type { PortfolioPosition } from "@/types/portfolio";
import { updatePosition } from "@/services/client/portfolio.client";

interface Props {
  position:  PortfolioPosition;
  onClose:   () => void;
  onSuccess: () => void;
}

function EditField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</label>
      <input
        type="number" step="any" value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded px-3 py-2 text-sm border outline-none"
        style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
      />
    </div>
  );
}

export default function EditPositionModal({ position, onClose, onSuccess }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [qty,    setQty]    = useState(String(position.quantity));
  const [avg,    setAvg]    = useState(String(position.averagePrice));
  const [cur,    setCur]    = useState(String(position.currentPrice));
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const quantity     = parseFloat(qty) || position.quantity;
    const averagePrice = parseFloat(avg) || position.averagePrice;
    const currentPrice = parseFloat(cur) || position.currentPrice;
    setSaving(true);
    setError(null);
    try {
      await updatePosition(position.id, { quantity, averagePrice, currentPrice });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save position");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)" }}
    >
      <div className="relative w-full max-w-md rounded-xl border p-6 shadow-2xl" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded" style={{ color: "var(--text-muted)" }}>
          <X size={16} />
        </button>
        <div className="mb-5">
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Edit Position</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{position.ticker} — {position.name}</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSave}>
          <div className="grid grid-cols-2 gap-3">
            <EditField label="Quantity"       value={qty} onChange={setQty} />
            <EditField label="Avg Price ($)"  value={avg} onChange={setAvg} />
          </div>
          <EditField label="Current Price ($)" value={cur} onChange={setCur} />

          {error && (
            <p className="text-xs px-3 py-2 rounded border" style={{ color: "var(--red)", borderColor: "var(--red)", background: "color-mix(in srgb, var(--red) 8%, transparent)" }}>
              {error}
            </p>
          )}

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded text-sm border" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 rounded text-sm font-medium disabled:opacity-60"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
