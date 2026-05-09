export type AIAction      = "Buy" | "Hold" | "Reduce" | "Sell";
export type AssetCategory = "ETF" | "Crypto" | "Metals" | "Stocks";

export interface RawPosition {
  id:            string;
  ticker:        string;
  name:          string;
  category:      AssetCategory;
  quantity:      number;
  averagePrice:  number;
  currentPrice:  number;
  targetPercent: number;
}

export interface PortfolioPosition extends RawPosition {
  positionValue:      number;
  investedAmount:     number;
  unrealizedPL:       number;
  unrealizedPLPercent:number;
  currentPercent:     number;
  differencePercent:  number;
  aiAction:           AIAction;
}

export interface PortfolioSummaryData {
  totalValue:    number;
  totalInvested: number;
  totalPL:       number;
  totalPLPercent:number;
  positions:     PortfolioPosition[];
}
