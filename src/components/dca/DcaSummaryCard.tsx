import type { DCASummaryData } from "@/types/dca";

const statusStyle: Record<string, { color: string }> = {
  "No Action":  { color: "var(--text-muted)" },
  "Partial DCA":{ color: "var(--yellow)"     },
  "Full DCA":   { color: "var(--green)"      },
  "Crisis DCA": { color: "var(--red)"        },
};

const riskStyle: Record<string, { color: string }> = {
  "Low":         { color: "var(--green)"  },
  "Medium":      { color: "var(--yellow)" },
  "Medium-High": { color: "#f97316"       },
  "High":        { color: "var(--red)"    },
  "Critical":    { color: "var(--red)"    },
};

function fmt(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

interface Props {
  data: DCASummaryData;
}

export default function DcaSummaryCard({ data }: Props) {
  const st = statusStyle[data.dcaStatus];
  const rt = riskStyle[data.riskLevel];

  return (
    <div
      className="rounded-lg border p-5 grid grid-cols-2 sm:grid-cols-5 gap-6"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div>
        <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
          Market Drop
        </p>
        <p className="text-2xl font-bold" style={{ color: "var(--red)" }}>
          {data.marketDrop}%
        </p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
          DCA Status
        </p>
        <span
          className="text-sm font-bold px-2.5 py-1 rounded"
          style={{ color: st.color, background: `${st.color}18` }}
        >
          {data.dcaStatus}
        </span>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
          Cash Reserved
        </p>
        <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          ${fmt(data.cashReserved)}
        </p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
          Cash Deployed
        </p>
        <div className="flex items-end gap-1.5">
          <p className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
            ${fmt(data.cashUsed)}
          </p>
          <p className="text-sm mb-0.5" style={{ color: "var(--text-muted)" }}>
            ({data.cashUsagePercent}%)
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
          Risk Level
        </p>
        <span
          className="text-sm font-bold px-2.5 py-1 rounded"
          style={{ color: rt.color, background: `${rt.color}18` }}
        >
          {data.riskLevel}
        </span>
      </div>
    </div>
  );
}
