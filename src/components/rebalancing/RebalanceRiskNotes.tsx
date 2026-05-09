import { Info } from "lucide-react";

const notes = [
  {
    title: "Tax Implications",
    body:  "Reducing BRK.B and ETH may trigger capital gains. Prioritize rebalancing within tax-advantaged accounts first.",
  },
  {
    title: "Execution Strategy",
    body:  "Deploy VOO and QQQ purchases incrementally via DCA to reduce timing risk. Avoid single large-block orders.",
  },
  {
    title: "Market Timing",
    body:  "Consider executing Buy actions after a -5% pullback from current levels for improved entry price.",
  },
  {
    title: "Transaction Costs",
    body:  "Estimate ~0.05% transaction cost per trade. Factor into rebalancing threshold — minor drift (< 1%) may not justify fees.",
  },
  {
    title: "Rebalance Frequency",
    body:  "Review rebalancing quarterly or when any position drifts more than 3% from target. Avoid over-trading.",
  },
];

export default function RebalanceRiskNotes() {
  return (
    <div
      className="rounded-lg border p-5 flex flex-col gap-4"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
        Risk Notes
      </p>

      <div className="flex flex-col gap-3">
        {notes.map((note) => (
          <div key={note.title} className="flex items-start gap-2.5">
            <Info size={13} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
            <div>
              <p className="text-xs font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>
                {note.title}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {note.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
