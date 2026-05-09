export type RiskProfile       = "Conservative" | "Moderate" | "Aggressive" | "Custom";
export type InvestmentHorizon = "Short" | "Medium" | "Long";
export type AIMode            = "Conservative" | "Balanced" | "Aggressive";
export type BaseCurrency      = "USD" | "EUR" | "GBP";

export interface AppSettings {
  riskProfile:          RiskProfile;
  maxDrawdown:          number;
  investmentHorizon:    InvestmentHorizon;
  dcaEnabled:           boolean;
  dcaAmount:            number;
  dcaFrequency:         string;
  leverage:             number;
  cashReservePercent:   number;
  aiMode:               AIMode;
  aiRebalanceThreshold: number;
  baseCurrency:         BaseCurrency;
  notifications: {
    dailyReport:    boolean;
    crisisAlert:    boolean;
    dcaTrigger:     boolean;
    rebalanceAlert: boolean;
    weeklyReport:   boolean;
  };
  account: {
    name:      string;
    email:     string;
    plan:      string;
    joinedAt:  string;
  };
}
