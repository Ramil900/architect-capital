"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

const vixHistory = [
  { date: "Apr 01", vix: 22.1 },
  { date: "Apr 02", vix: 21.8 },
  { date: "Apr 03", vix: 23.4 },
  { date: "Apr 04", vix: 22.9 },
  { date: "Apr 07", vix: 21.5 },
  { date: "Apr 08", vix: 20.8 },
  { date: "Apr 09", vix: 21.2 },
  { date: "Apr 10", vix: 22.0 },
  { date: "Apr 11", vix: 21.6 },
  { date: "Apr 14", vix: 20.3 },
  { date: "Apr 15", vix: 19.8 },
  { date: "Apr 16", vix: 20.5 },
  { date: "Apr 17", vix: 21.1 },
  { date: "Apr 18", vix: 19.7 },
  { date: "Apr 21", vix: 18.9 },
  { date: "Apr 22", vix: 18.4 },
  { date: "Apr 23", vix: 19.2 },
  { date: "Apr 24", vix: 18.8 },
  { date: "Apr 25", vix: 17.9 },
  { date: "Apr 28", vix: 18.1 },
  { date: "Apr 29", vix: 17.5 },
  { date: "Apr 30", vix: 18.0 },
  { date: "May 01", vix: 17.2 },
  { date: "May 02", vix: 17.8 },
  { date: "May 05", vix: 17.3 },
  { date: "May 06", vix: 16.9 },
  { date: "May 07", vix: 17.4 },
  { date: "May 08", vix: 17.1 },
  { date: "May 09", vix: 16.5 },
  { date: "May 10", vix: 16.8 },
];

const ticks = ["Apr 01", "Apr 14", "Apr 28", "May 10"];

export default function MarketTrendChart() {
  return (
    <div
      className="rounded-lg border p-5"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          VIX — 30-Day Trend
        </p>
        <div className="flex items-center gap-4">
          {[
            { label: "Risk-On < 18",  color: "var(--green)"  },
            { label: "Neutral 18–25", color: "var(--yellow)" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={vixHistory} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="date"
            ticks={ticks}
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[14, 26]}
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              fontSize: "12px",
              color: "var(--text-primary)",
            }}
            formatter={(value) => [value, "VIX"]}
          />
          <ReferenceLine y={18} stroke="var(--green)"  strokeDasharray="3 3" strokeOpacity={0.5} />
          <ReferenceLine y={25} stroke="var(--yellow)" strokeDasharray="3 3" strokeOpacity={0.5} />
          <Line
            type="monotone"
            dataKey="vix"
            stroke="var(--accent)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "var(--accent)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
