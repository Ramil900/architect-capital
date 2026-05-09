import type { ReportSummaryData } from "@/types/reports";

export const reportsData: ReportSummaryData = {
  totalReports:  14,
  lastGenerated: "May 10, 2026 · 09:00 AM",
  aiSummary:
    "Portfolio remains well-positioned in Risk-On regime. Total value $164,713 (+12.4% MTD). " +
    "Primary action required: reduce BRK.B overweight (-3.7% vs target) and deploy capital into VOO (+4.5% underweight). " +
    "DCA strategy active — $2,000 deployed this week. No crisis conditions detected. Rebalancing score: 71/100.",
  keyMetrics: [
    { label: "Total Value",       value: "$164,713",  positive: true  },
    { label: "MTD Return",        value: "+12.4%",    positive: true  },
    { label: "YTD Return",        value: "+18.7%",    positive: true  },
    { label: "Sharpe Ratio",      value: "1.42"                        },
    { label: "Max Drawdown",      value: "-8.3%",     positive: false  },
    { label: "Portfolio Beta",    value: "0.87"                        },
  ],
  reports: [
    {
      id:          "r1",
      type:        "Daily",
      title:       "Daily Portfolio Report",
      description: "End-of-day summary: positions, P/L, AI signals, and market regime.",
      status:      "Ready",
      generatedAt: "May 10, 2026 · 09:00 AM",
      size:        "142 KB",
    },
    {
      id:          "r2",
      type:        "Weekly",
      title:       "Weekly Performance Report",
      description: "7-day performance, allocation drift, rebalancing actions, DCA summary.",
      status:      "Ready",
      generatedAt: "May 6, 2026 · 07:00 AM",
      size:        "384 KB",
    },
    {
      id:          "r3",
      type:        "Crisis",
      title:       "Crisis Scenario Report",
      description: "Stress test: portfolio impact under -20%, -35%, -50% market drawdown scenarios.",
      status:      "Generated",
      generatedAt: "May 3, 2026 · 11:30 AM",
      size:        "218 KB",
    },
    {
      id:          "r4",
      type:        "DCA",
      title:       "DCA Execution Report",
      description: "DCA buy zones, triggered levels, cash deployment progress, and next targets.",
      status:      "Ready",
      generatedAt: "May 10, 2026 · 09:00 AM",
      size:        "96 KB",
    },
    {
      id:          "r5",
      type:        "Rebalance",
      title:       "Rebalancing Action Report",
      description: "Full rebalancing plan: current vs target allocation, required trades, risk notes.",
      status:      "Ready",
      generatedAt: "May 10, 2026 · 09:00 AM",
      size:        "176 KB",
    },
  ],
};
