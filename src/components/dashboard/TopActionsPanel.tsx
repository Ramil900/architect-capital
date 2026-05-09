import { ArrowUpCircle, MinusCircle, PauseCircle, AlertTriangle } from "lucide-react";

const actions = [
  {
    type: "Buy",
    asset: "VOO",
    reason: "Underweight by 3%. Defensive ETF in neutral market.",
    icon: ArrowUpCircle,
    color: "var(--green)",
  },
  {
    type: "Buy",
    asset: "GLD",
    reason: "Gold underweight. Good hedge in current regime.",
    icon: ArrowUpCircle,
    color: "var(--green)",
  },
  {
    type: "Hold",
    asset: "SOXX",
    reason: "Near target. Semiconductor exposure is already elevated.",
    icon: PauseCircle,
    color: "var(--yellow)",
  },
  {
    type: "Reduce",
    asset: "TSLA",
    reason: "Single stock risk is high. Overweight by 2%.",
    icon: MinusCircle,
    color: "var(--red)",
  },
  {
    type: "Warning",
    asset: "Crypto",
    reason: "BTC + ETH combined exposure near warning zone.",
    icon: AlertTriangle,
    color: "var(--yellow)",
  },
];

export default function TopActionsPanel() {
  return (
    <div
      className="rounded-lg p-5 border"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
        Top Actions
      </p>

      <div className="flex flex-col gap-2">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded border"
              style={{ background: "var(--bg-hover)", borderColor: "var(--border-subtle)" }}
            >
              <Icon size={15} className="shrink-0 mt-0.5" style={{ color: action.color }} />
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold" style={{ color: action.color }}>
                    {action.type}
                  </span>
                  <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                    {action.asset}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {action.reason}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
