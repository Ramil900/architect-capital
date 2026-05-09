import { ArrowDownUp } from "lucide-react";
import type { AIAnalysisData } from "@/types/ai";

const statusStyle: Record<string, { color: string }> = {
  Active:      { color: "var(--green)"  },
  Paused:      { color: "var(--yellow)" },
  Recommended: { color: "var(--accent)" },
};

interface Props {
  data: AIAnalysisData;
}

export default function DcaStatusCard({ data }: Props) {
  const st = statusStyle[data.dcaStatus];

  return (
    <div
      className="rounded-lg border p-5 flex flex-col gap-4"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          DCA Status
        </p>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1"
          style={{ color: st.color, background: `${st.color}18` }}
        >
          <ArrowDownUp size={11} />
          {data.dcaStatus}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>Amount</p>
          <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            ${data.dcaAmount}
          </p>
        </div>
        <div>
          <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>Frequency</p>
          <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            {data.dcaFrequency}
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>Allocation</p>
        <div className="flex flex-col gap-2">
          {data.dcaAllocation.map((item) => (
            <div key={item.ticker} className="flex items-center gap-2">
              <span className="text-xs w-10 font-medium" style={{ color: "var(--text-secondary)" }}>
                {item.ticker}
              </span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-hover)" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${item.percent}%`, background: "var(--accent)" }}
                />
              </div>
              <span className="text-xs w-8 text-right" style={{ color: "var(--text-muted)" }}>
                {item.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
