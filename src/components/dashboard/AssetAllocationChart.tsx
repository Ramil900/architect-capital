"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ASSETS } from "@/constants/assets";
import { TARGET_ALLOCATION } from "@/constants/target-allocation";

const data = ASSETS.map((a) => ({
  asset:   a.ticker,
  percent: TARGET_ALLOCATION[a.ticker],
  color:   a.color,
}));

export default function AssetAllocationChart() {
  return (
    <div className="rounded-lg p-5 border" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
        Allocation
      </p>

      <div className="flex gap-4 items-center">
        <div className="w-[140px] h-[140px] shrink-0">
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie data={data} dataKey="percent" nameKey="asset" innerRadius={42} outerRadius={65} strokeWidth={0}>
                {data.map((entry) => (
                  <Cell key={entry.asset} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "12px", color: "var(--text-primary)" }}
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
                <span className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>{item.asset}</span>
              </div>
              <span className="text-xs font-medium shrink-0" style={{ color: "var(--text-primary)" }}>{item.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
