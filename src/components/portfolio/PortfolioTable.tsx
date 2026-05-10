"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { PortfolioPosition, PortfolioSummaryData } from "@/types/portfolio";
import { deletePosition } from "@/services/client/portfolio.client";
import PortfolioRow      from "./PortfolioRow";
import AddAssetModal     from "./AddAssetModal";
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
  data:       PortfolioSummaryData;
  onRefetch:  () => void;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function PortfolioTable({ data, onRefetch }: Props) {
  const [addOpen,     setAddOpen]     = useState(false);
  const [editTarget,  setEditTarget]  = useState<PortfolioPosition | null>(null);
  const [deletingId,  setDeletingId]  = useState<string | null>(null);
  const [tableError,  setTableError]  = useState<string | null>(null);

  const hasDemo = data.positions.some((p) => !UUID_RE.test(p.id));

  async function handleDelete(id: string) {
    setDeletingId(id);
    setTableError(null);
    try {
      await deletePosition(id);
      onRefetch();
    } catch (e) {
      setTableError(e instanceof Error ? e.message : "Failed to delete position");
    } finally {
      setDeletingId(null);
    }
  }

  function handleSuccess() {
    setAddOpen(false);
    setEditTarget(null);
    onRefetch();
  }

  return (
    <div className="rounded-lg border overflow-hidden" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Positions</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            <Plus size={13} /> Add Asset
          </button>
        </div>
      </div>

      {hasDemo && (
        <div className="px-5 py-2.5 border-b text-xs" style={{ color: "var(--yellow)", borderColor: "var(--border-subtle)", background: "color-mix(in srgb, var(--yellow) 6%, transparent)" }}>
          Showing demo data — click <strong>Add Asset</strong> to add your own positions.
        </div>
      )}

      {tableError && (
        <div className="px-5 py-2.5 border-b text-xs" style={{ color: "var(--red)", borderColor: "var(--border-subtle)", background: "color-mix(in srgb, var(--red) 6%, transparent)" }}>
          {tableError}
        </div>
      )}

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
            {data.positions.map((pos) => (
              <PortfolioRow
                key={pos.id}
                position={pos}
                onEdit={setEditTarget}
                onDelete={handleDelete}
                deleting={deletingId === pos.id}
              />
            ))}
          </tbody>
        </table>
      </div>

      {addOpen    && <AddAssetModal     onClose={() => setAddOpen(false)}    onSuccess={handleSuccess} />}
      {editTarget && <EditPositionModal position={editTarget}                onClose={() => setEditTarget(null)} onSuccess={handleSuccess} />}
    </div>
  );
}
