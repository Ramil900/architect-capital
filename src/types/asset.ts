export type AssetCategory = "ETF" | "Stocks" | "Crypto" | "Metals";

export interface Asset {
  id:       string;
  ticker:   string;
  name:     string;
  category: AssetCategory;
  color:    string;
}
