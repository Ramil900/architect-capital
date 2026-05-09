"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { asset: "VOO",   percent: 20, color: "#3b82f6" },
  { asset: "QQQ",   percent: 15, color: "#6366f1" },
  { asset: "SOXX",  percent: 10, color: "#8b5cf6" },
  { asset: "SMH",   percent: 10, color: "#a855f7" },
  { asset: "GLD",   percent: 10, color: "#f59e0b" },
  { asset: "SLV",   percent: 10, color: "#94a3b8" },
  { asset: "BTC",   percent: 7,  color: "#f97316" },
  { asset: "ETH",   percent: 3,  color: "#06b6d4" },
  { asset: "BRK.B", percent: 10, color: "#22c55e" },
  { asset: "TSLA",  percent: 5,  color: "#ef4444" },
];

export default function AssetAllocationChart() {
  return (
    <div
      className="rounded-lg p-5 border"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
        Allocation
      </p>

      <div className="flex gap-4 items-center">
        <div className="w-[140px] h-[140px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="percent"
                nameKey="asset"
                innerRadius={42}
                outerRadius={65}
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell key={entry.asset} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "var(--text-primary)",
                }}
                formatter={(value) => [`${value}%`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          {data.map((item) => (
            <div key={item.asset} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                <span className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                  {item.asset}
                </span>
              </div>
              <span className="text-xs font-medium shrink-0" style={{ color: "var(--text-primary)" }}>
                {item.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
