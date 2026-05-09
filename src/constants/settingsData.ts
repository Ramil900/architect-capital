import type { AppSettings } from "@/types/settings";

export const defaultSettings: AppSettings = {
  riskProfile:          "Aggressive",
  maxDrawdown:          55,
  investmentHorizon:    "Long",
  dcaEnabled:           true,
  dcaAmount:            500,
  dcaFrequency:         "Weekly",
  leverage:             0.3,
  cashReservePercent:   10,
  aiMode:               "Balanced",
  aiRebalanceThreshold: 2,
  baseCurrency:         "USD",
  notifications: {
    dailyReport:    true,
    crisisAlert:    true,
    dcaTrigger:     true,
    rebalanceAlert: true,
    weeklyReport:   false,
  },
  account: {
    name:     "Ramil Guliyev",
    email:    "investor@architectcapital.io",
    plan:     "Institutional",
    joinedAt: "Jan 1, 2026",
  },
};
