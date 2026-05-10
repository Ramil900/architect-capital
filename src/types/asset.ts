export type AssetCategory = "ETF" | "Stocks" | "Crypto" | "Metals";
export type RiskLevel    = "Low" | "Medium" | "High" | "Extreme";

export interface Asset {
  id:         string;
  ticker:     string;
  name:       string;
  category:   AssetCategory;
  color:      string;
  riskLevel:  RiskLevel;
}
