"use client";

import { useRef } from "react";
import { X } from "lucide-react";
import type { AssetCategory } from "@/types/portfolio";

interface Props { onClose: () => void; }

const CATEGORIES: AssetCategory[] = ["ETF", "Stocks", "Crypto", "Metals"];

function Field({ label, name, placeholder, type = "text" }: { label: string; name: string; placeholder: string; type?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</label>
      <input name={name} type={type} placeholder={placeholder} className="rounded px-3 py-2 text-sm border outline-none"
        style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
    </div>
  );
}

export default function AddAssetModal({ onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="relative w-full max-w-md rounded-xl border p-6 shadow-2xl" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded" style={{ color: "var(--text-muted)" }}><X size={16} /></button>
        <p className="text-sm font-semibold mb-5" style={{ color: "var(--text-primary)" }}>Add Asset</p>
        <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          <Field label="Ticker" name="ticker" placeholder="e.g. AAPL" />
          <Field label="Name" name="name" placeholder="e.g. Apple Inc." />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs" style={{ color: "var(--text-muted)" }}>Category</label>
            <select name="category" className="rounded px-3 py-2 text-sm border outline-none"
              style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Quantity" name="quantity" placeholder="0" type="number" />
            <Field label="Avg Price ($)" name="averagePrice" placeholder="0.00" type="number" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Current Price ($)" name="currentPrice" placeholder="0.00" type="number" />
            <Field label="Target %" name="targetPercent" placeholder="0" type="number" />
          </div>
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded text-sm border" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>Cancel</button>
            <button type="submit" className="flex-1 py-2 rounded text-sm font-medium" style={{ background: "var(--accent)", color: "#fff" }}>Add</button>
          </div>
        </form>
      </div>
    </div>
  );
}
