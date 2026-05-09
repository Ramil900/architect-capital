import type { DCASummaryData } from "@/types/dca";

const categoryColor: Record<string, string> = {
  ETF:    "#3b82f6",
  Crypto: "#f97316",
  Metals: "#f59e0b",
  Stocks: "#22c55e",
};

const levelColor: Record<string, string> = {
  "Small Buy":      "var(--green)",
  "Normal Buy":     "#22d3ee",
  "Strong Buy":     "var(--accent)",
  "Aggressive Buy": "var(--yellow)",
  "Crisis Buy":     "var(--red)",
};

function fmtPrice(n: number) {
  if (n >= 1000) return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (n < 10)    return `$${n.toFixed(2)}`;
  return `$${n.toFixed(0)}`;
}

const ZONE_COLS = [
  { key: "smallBuy",      label: "-5%",  level: "Small Buy"      },
  { key: "normalBuy",     label: "-10%", level: "Normal Buy"     },
  { key: "strongBuy",     label: "-20%", level: "Strong Buy"     },
  { key: "aggressiveBuy", label: "-35%", level: "Aggressive Buy" },
  { key: "crisisBuy",     label: "-50%", level: "Crisis Buy"     },
] as const;

interface Props {
  data: DCASummaryData;
}

export default function DcaBuyZoneTable({ data }: Props) {
  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          Buy Zone Targets
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px]">
          <thead>
            <tr style={{ borderBottom: `1px solid var(--border-subtle)` }}>
              <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Asset
              </th>
              <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Current
              </th>
              {ZONE_COLS.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wider"
                  style={{ color: levelColor[col.level] }}
                >
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Active Zone
              </th>
            </tr>
          </thead>
          <tbody>
            {data.buyZones.map((zone) => {
              const catColor = categoryColor[zone.category] ?? "var(--text-muted)";
              const zoneColor = levelColor[zone.activeLevel];
              return (
                <tr key={zone.ticker} className="border-b" style={{ borderColor: "var(--border-subtle)" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs px-1.5 py-0.5 rounded font-medium shrink-0"
                        style={{ color: catColor, background: `${catColor}18` }}
                      >
                        {zone.category}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        {zone.ticker}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium" style={{ color: "var(--text-primary)" }}>
                    {fmtPrice(zone.currentPrice)}
                  </td>
                  {ZONE_COLS.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-sm text-right"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {fmtPrice(zone[col.key])}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded"
                      style={{ color: zoneColor, background: `${zoneColor}18` }}
                    >
                      {zone.activeLevel}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
