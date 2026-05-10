"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { ASSETS } from "@/constants/assets";
import { addPosition } from "@/services/client/portfolio.client";

interface Props {
  onClose:   () => void;
  onSuccess: () => void;
}

export default function AddAssetModal({ onClose, onSuccess }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [ticker,       setTicker]       = useState(ASSETS[0].ticker);
  const [quantity,     setQuantity]     = useState("");
  const [averagePrice, setAveragePrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [saving,       setSaving]       = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const qty = parseFloat(quantity);
    const avg = parseFloat(averagePrice);
    const cur = parseFloat(currentPrice);
    if (!qty || !avg || !cur) {
      setError("All numeric fields are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await addPosition({ ticker, quantity: qty, averagePrice: avg, currentPrice: cur });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add position");
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
        <p className="text-sm font-semibold mb-5" style={{ color: "var(--text-primary)" }}>Add Asset</p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Asset picker */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs" style={{ color: "var(--text-muted)" }}>Asset</label>
            <select
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className="rounded px-3 py-2 text-sm border outline-none"
              style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
            >
              {ASSETS.map((a) => (
                <option key={a.ticker} value={a.ticker}>
                  {a.ticker} — {a.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs" style={{ color: "var(--text-muted)" }}>Quantity</label>
              <input
                type="number" step="any" placeholder="0" value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="rounded px-3 py-2 text-sm border outline-none"
                style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs" style={{ color: "var(--text-muted)" }}>Avg Price ($)</label>
              <input
                type="number" step="any" placeholder="0.00" value={averagePrice}
                onChange={(e) => setAveragePrice(e.target.value)}
                className="rounded px-3 py-2 text-sm border outline-none"
                style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs" style={{ color: "var(--text-muted)" }}>Current Price ($)</label>
            <input
              type="number" step="any" placeholder="0.00" value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              className="rounded px-3 py-2 text-sm border outline-none"
              style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
            />
          </div>

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
              {saving ? "Adding…" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
