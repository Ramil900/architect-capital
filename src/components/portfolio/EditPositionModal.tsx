"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import type { PortfolioPosition } from "@/types/portfolio";

interface Props {
  position: PortfolioPosition;
  onClose:  () => void;
  onSave:   (updated: PortfolioPosition) => void;
}

function EditField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(e.target.value)} className="rounded px-3 py-2 text-sm border outline-none"
        style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
    </div>
  );
}

export default function EditPositionModal({ position, onClose, onSave }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [qty, setQty] = useState(String(position.quantity));
  const [avg, setAvg] = useState(String(position.averagePrice));
  const [cur, setCur] = useState(String(position.currentPrice));
  const [tgt, setTgt] = useState(String(position.targetPercent));

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const quantity      = parseFloat(qty)  || position.quantity;
    const averagePrice  = parseFloat(avg)  || position.averagePrice;
    const currentPrice  = parseFloat(cur)  || position.currentPrice;
    const targetPercent = parseFloat(tgt)  || position.targetPercent;
    const positionValue       = quantity * currentPrice;
    const investedAmount      = quantity * averagePrice;
    const unrealizedPL        = positionValue - investedAmount;
    const unrealizedPLPercent = (unrealizedPL / investedAmount) * 100;
    const differencePercent   = targetPercent - position.currentPercent;
    const aiAction            = differencePercent > 2 ? "Buy" : differencePercent < -2 ? "Reduce" : "Hold";
    onSave({ ...position, quantity, averagePrice, currentPrice, targetPercent, positionValue, investedAmount, unrealizedPL, unrealizedPLPercent, differencePercent, aiAction });
  }

  return (
    <div ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="relative w-full max-w-md rounded-xl border p-6 shadow-2xl" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded" style={{ color: "var(--text-muted)" }}><X size={16} /></button>
        <div className="mb-5">
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Edit Position</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{position.ticker} — {position.name}</p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSave}>
          <div className="grid grid-cols-2 gap-3">
            <EditField label="Quantity" value={qty} onChange={setQty} />
            <EditField label="Avg Price ($)" value={avg} onChange={setAvg} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <EditField label="Current Price ($)" value={cur} onChange={setCur} />
            <EditField label="Target %" value={tgt} onChange={setTgt} />
          </div>
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded text-sm border" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>Cancel</button>
            <button type="submit" className="flex-1 py-2 rounded text-sm font-medium" style={{ background: "var(--accent)", color: "#fff" }}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
