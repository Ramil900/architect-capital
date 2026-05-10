import { ArrowUpCircle, MinusCircle, PauseCircle } from "lucide-react";
import type { ComponentType } from "react";
import type { AIRecommendation, AIAction } from "@/types/ai";

interface Props {
  recommendations: AIRecommendation[];
}

type IconComponent = ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;

const ACTION_CONFIG: Record<AIAction, { icon: IconComponent; color: string }> = {
  Buy:    { icon: ArrowUpCircle, color: "var(--green)"  },
  Hold:   { icon: PauseCircle,  color: "var(--yellow)" },
  Reduce: { icon: MinusCircle,  color: "var(--red)"    },
  Sell:   { icon: MinusCircle,  color: "var(--red)"    },
};

export default function TopActionsPanel({ recommendations }: Props) {
  return (
    <div className="rounded-lg p-5 border" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
        Top Actions
      </p>

      <div className="flex flex-col gap-2">
        {recommendations.map((r) => {
          const { icon: Icon, color } = ACTION_CONFIG[r.action];
          return (
            <div key={r.ticker} className="flex items-start gap-3 p-3 rounded border" style={{ background: "var(--bg-hover)", borderColor: "var(--border-subtle)" }}>
              <Icon size={15} className="shrink-0 mt-0.5" style={{ color }} />
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold" style={{ color }}>{r.action}</span>
                  <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{r.ticker}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{r.reasoning}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
