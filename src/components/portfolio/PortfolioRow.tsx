import { Pencil, Trash2 } from "lucide-react";
import type { PortfolioPosition } from "@/types/portfolio";

const actionStyle: Record<string, string> = {
  Buy:    "var(--green)",
  Hold:   "var(--yellow)",
  Reduce: "var(--red)",
  Sell:   "var(--red)",
};

const categoryStyle: Record<string, string> = {
  ETF:    "#3b82f6",
  Crypto: "#f97316",
  Metals: "#f59e0b",
  Stocks: "#22c55e",
};

function fmt(n: number, decimals = 0) {
  return n.toLocaleString("en-US", { maximumFractionDigits: decimals });
}

interface Props {
  position: PortfolioPosition;
  onEdit:   (position: PortfolioPosition) => void;
  onDelete: (id: string) => void;
  deleting?: boolean;
}

export default function PortfolioRow({ position: p, onEdit, onDelete, deleting }: Props) {
  const plPos   = p.unrealizedPL >= 0;
  const diffPos = p.differencePercent >= 0;

  return (
    <tr className="border-b transition-colors" style={{ borderColor: "var(--border-subtle)" }}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xs px-1.5 py-0.5 rounded font-medium shrink-0" style={{ background: `${categoryStyle[p.category]}18`, color: categoryStyle[p.category] }}>
            {p.category}
          </span>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{p.ticker}</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{p.name}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-right" style={{ color: "var(--text-secondary)" }}>
        {fmt(p.quantity, p.quantity < 1 ? 3 : 0)}
      </td>
      <td className="px-4 py-3 text-sm text-right" style={{ color: "var(--text-secondary)" }}>
        ${fmt(p.averagePrice, p.averagePrice < 100 ? 2 : 0)}
      </td>
      <td className="px-4 py-3 text-sm text-right font-medium" style={{ color: "var(--text-primary)" }}>
        ${fmt(p.currentPrice, p.currentPrice < 100 ? 2 : 0)}
      </td>
      <td className="px-4 py-3 text-sm text-right font-semibold" style={{ color: "var(--text-primary)" }}>
        ${fmt(p.positionValue)}
      </td>
      <td className="px-4 py-3 text-right">
        <p className="text-xs font-medium" style={{ color: plPos ? "var(--green)" : "var(--red)" }}>
          {plPos ? "+" : ""}${fmt(p.unrealizedPL)}
        </p>
        <p className="text-xs" style={{ color: plPos ? "var(--green)" : "var(--red)" }}>
          {plPos ? "+" : ""}{p.unrealizedPLPercent.toFixed(1)}%
        </p>
      </td>
      <td className="px-4 py-3 text-sm text-right" style={{ color: "var(--text-secondary)" }}>
        {p.currentPercent.toFixed(1)}%
      </td>
      <td className="px-4 py-3 text-sm text-right" style={{ color: "var(--text-muted)" }}>
        {p.targetPercent}%
      </td>
      <td className="px-4 py-3 text-sm text-right font-medium" style={{ color: diffPos ? "var(--green)" : "var(--red)" }}>
        {diffPos ? "+" : ""}{p.differencePercent.toFixed(1)}%
      </td>
      <td className="px-4 py-3">
        <span className="text-xs font-semibold px-2 py-1 rounded" style={{ color: actionStyle[p.aiAction], background: `${actionStyle[p.aiAction]}18` }}>
          {p.aiAction}
        </span>
      </td>
      <td className="px-4 py-3">
        {!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p.id) ? (
          <span className="text-xs px-2 py-0.5 rounded" style={{ color: "var(--text-muted)", background: "var(--bg-hover)" }}>demo</span>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={() => onEdit(p)} className="p-1 rounded" style={{ color: "var(--text-muted)" }}>
              <Pencil size={13} />
            </button>
            <button onClick={() => onDelete(p.id)} disabled={deleting} className="p-1 rounded disabled:opacity-40" style={{ color: "var(--text-muted)" }}>
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
