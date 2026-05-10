import type { RawPosition, PortfolioPosition, PortfolioSummaryData, AIAction } from "@/types/portfolio";

export function calculatePositionValue(quantity: number, currentPrice: number): number {
  return quantity * currentPrice;
}

export function calculateTotalPortfolioValue(positions: Pick<RawPosition, "quantity" | "currentPrice">[]): number {
  return positions.reduce((sum, p) => sum + p.quantity * p.currentPrice, 0);
}

export function calculateCurrentWeight(positionValue: number, totalValue: number): number {
  return totalValue === 0 ? 0 : (positionValue / totalValue) * 100;
}

export function calculatePortfolioWeights(
  raw: RawPosition[]
): PortfolioPosition[] {
  const totalValue = calculateTotalPortfolioValue(raw);

  return raw.map((p) => {
    const positionValue       = calculatePositionValue(p.quantity, p.currentPrice);
    const investedAmount      = calculatePositionValue(p.quantity, p.averagePrice);
    const unrealizedPL        = positionValue - investedAmount;
    const unrealizedPLPercent = investedAmount === 0 ? 0 : (unrealizedPL / investedAmount) * 100;
    const currentPercent      = calculateCurrentWeight(positionValue, totalValue);
    const differencePercent   = p.targetPercent - currentPercent;
    const aiAction            = getAIActionFromDiff(differencePercent);
    return { ...p, positionValue, investedAmount, unrealizedPL, unrealizedPLPercent, currentPercent, differencePercent, aiAction };
  });
}

export function buildPortfolioSummary(raw: RawPosition[]): PortfolioSummaryData {
  const positions     = calculatePortfolioWeights(raw);
  const totalValue    = calculateTotalPortfolioValue(raw);
  const totalInvested = positions.reduce((s, p) => s + p.investedAmount, 0);
  const totalPL       = totalValue - totalInvested;
  const totalPLPercent = totalInvested === 0 ? 0 : (totalPL / totalInvested) * 100;
  return { totalValue, totalInvested, totalPL, totalPLPercent, positions };
}

function getAIActionFromDiff(diff: number): AIAction {
  if (diff > 2)  return "Buy";
  if (diff < -2) return "Reduce";
  return "Hold";
}
