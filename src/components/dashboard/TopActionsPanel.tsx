import { ArrowUpCircle, MinusCircle, PauseCircle } from "lucide-react";
import type { ComponentType } from "react";
import { aiAnalysis } from "@/constants/demo-ai";
import type { AIAction } from "@/types/ai";

type IconComponent = ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;

const ACTION_CONFIG: Record<AIAction, { icon: IconComponent; color: string }> = {
  Buy:    { icon: ArrowUpCircle, color: "var(--green)"  },
  Hold:   { icon: PauseCircle,  color: "var(--yellow)" },
  Reduce: { icon: MinusCircle,  color: "var(--red)"    },
  Sell:   { icon: MinusCircle,  color: "var(--red)"    },
};

export default function TopActionsPanel() {
  const actions = aiAnalysis.recommendations.map((r) => ({
    type:   r.action,
    asset:  r.ticker,
    reason: r.reasoning,
    ...ACTION_CONFIG[r.action],
  }));

  return (
    <div className="rounded-lg p-5 border" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
        Top Actions
      </p>

      <div className="flex flex-col gap-2">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <div key={i} className="flex items-start gap-3 p-3 rounded border" style={{ background: "var(--bg-hover)", borderColor: "var(--border-subtle)" }}>
              <Icon size={15} className="shrink-0 mt-0.5" style={{ color: action.color }} />
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold" style={{ color: action.color }}>{action.type}</span>
                  <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{action.asset}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{action.reason}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
