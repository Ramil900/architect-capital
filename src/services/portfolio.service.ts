import { portfolioData } from "@/constants/demo-portfolio";
import type { PortfolioSummaryData, PortfolioPosition } from "@/types/portfolio";

export function getPortfolioSummary(): PortfolioSummaryData {
  return portfolioData;
}

export function getPortfolioPositions(): PortfolioPosition[] {
  return portfolioData.positions;
}

export function getPortfolioAllocation(): { ticker: string; percent: number; color: string }[] {
  const { positions, totalValue } = portfolioData;
  return positions.map((p) => ({
    ticker:  p.ticker,
    percent: Math.round((p.positionValue / totalValue) * 1000) / 10,
    color:   "", // color comes from ASSETS — callers can join if needed
  }));
}
