"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { PortfolioPosition, PortfolioSummaryData } from "@/types/portfolio";
import PortfolioRow from "./PortfolioRow";
import AddAssetModal from "./AddAssetModal";
import EditPositionModal from "./EditPositionModal";

const COLUMNS = [
  { label: "Asset",      align: "left"  },
  { label: "Qty",        align: "right" },
  { label: "Avg Price",  align: "right" },
  { label: "Current",    align: "right" },
  { label: "Value",      align: "right" },
  { label: "P/L",        align: "right" },
  { label: "Current %",  align: "right" },
  { label: "Target %",   align: "right" },
  { label: "Diff %",     align: "right" },
  { label: "AI Action",  align: "left"  },
  { label: "",           align: "left"  },
];

interface Props {
  data: PortfolioSummaryData;
}

export default function PortfolioTable({ data }: Props) {
  const [positions, setPositions] = useState<PortfolioPosition[]>(data.positions);
  const [addOpen, setAddOpen]     = useState(false);
  const [editTarget, setEditTarget] = useState<PortfolioPosition | null>(null);

  function handleDelete(id: string) {
    setPositions((prev) => prev.filter((p) => p.id !== id));
  }

  function handleSaveEdit(updated: PortfolioPosition) {
    setPositions((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditTarget(null);
  }

  return (
    <div className="rounded-lg border overflow-hidden" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Positions</p>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          <Plus size={13} /> Add Asset
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr style={{ borderBottom: `1px solid var(--border-subtle)` }}>
              {COLUMNS.map((col) => (
                <th
                  key={col.label}
                  className={`px-4 py-2.5 text-xs font-medium uppercase tracking-wider ${col.align === "right" ? "text-right" : "text-left"}`}
                  style={{ color: "var(--text-muted)" }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {positions.map((pos) => (
              <PortfolioRow key={pos.id} position={pos} onEdit={setEditTarget} onDelete={handleDelete} />
            ))}
          </tbody>
        </table>
      </div>

      {addOpen && <AddAssetModal onClose={() => setAddOpen(false)} />}
      {editTarget && <EditPositionModal position={editTarget} onClose={() => setEditTarget(null)} onSave={handleSaveEdit} />}
    </div>
  );
}
