import type { AssetCategory } from "@/types/asset";
export type { AssetCategory } from "@/types/asset";

export type RebalanceAction   = "Buy" | "Hold" | "Reduce" | "Sell";
export type RebalancePriority = "High" | "Medium" | "Low";

export interface RebalanceItem {
  ticker:         string;
  name:           string;
  category:       AssetCategory;
  color:          string;
  currentValue:   number;
  currentPercent: number;
  targetPercent:  number;
  targetValue:    number;
  diffPercent:    number;
  diffValue:      number;
  action:         RebalanceAction;
  priority:       RebalancePriority;
}

export interface RebalanceSummaryData {
  totalValue:        number;
  balanceScore:      number;
  actionsNeeded:     number;
  totalBuyNeeded:    number;
  totalReduceNeeded: number;
  items:             RebalanceItem[];
}
