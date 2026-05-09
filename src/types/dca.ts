export type DCALevel     = "Small Buy" | "Normal Buy" | "Strong Buy" | "Aggressive Buy" | "Crisis Buy";
export type DCAStatus    = "No Action" | "Partial DCA" | "Full DCA" | "Crisis DCA";
export type DCARiskLevel = "Low" | "Medium" | "Medium-High" | "High" | "Critical";
export type DCAAction    = "Buy Now" | "Wait for Zone" | "Avoid";

export interface DCAScenario {
  drop:              number;
  level:             DCALevel;
  cashDeployPercent: number;
  cashDeployAmount:  number;
  triggered:         boolean;
  current:           boolean;
}

export interface DCABuyZone {
  ticker:       string;
  name:         string;
  category:     string;
  currentPrice: number;
  smallBuy:     number;
  normalBuy:    number;
  strongBuy:    number;
  aggressiveBuy:number;
  crisisBuy:    number;
  activeLevel:  DCALevel;
}

export interface DCARecommendation {
  ticker: string;
  action: DCAAction;
  amount: number | null;
  note:   string;
}

export interface DCASummaryData {
  marketDrop:        number;
  dcaStatus:         DCAStatus;
  cashReserved:      number;
  cashUsed:          number;
  cashUsagePercent:  number;
  riskLevel:         DCARiskLevel;
  recommendedAssets: string[];
  avoidAssets:       string[];
  scenarios:         DCAScenario[];
  buyZones:          DCABuyZone[];
  riskFactors:       string[];
  recommendations:   DCARecommendation[];
}
