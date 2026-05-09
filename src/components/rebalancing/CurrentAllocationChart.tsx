"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { RebalanceSummaryData } from "@/types/rebalancing";

interface Props {
  data: RebalanceSummaryData;
}

export default function CurrentAllocationChart({ data }: Props) {
  const chartData = data.items.map((i) => ({
    name:    i.ticker,
    value:   parseFloat(i.currentPercent.toFixed(1)),
    color:   i.color,
  }));

  return (
    <div
      className="rounded-lg border p-5"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
        Current Allocation
      </p>

      <div className="flex gap-4 items-center">
        <div className="shrink-0">
          <ResponsiveContainer width={150} height={150}>
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={44} outerRadius={68} strokeWidth={0}>
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
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
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                <span className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>{item.name}</span>
              </div>
              <span className="text-xs font-medium shrink-0" style={{ color: "var(--text-primary)" }}>
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
