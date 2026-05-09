import type { AIAction, PortfolioPosition, PortfolioSummaryData, RawPosition } from "@/types/portfolio";
import { ASSETS } from "@/constants/assets";
import { TARGET_ALLOCATION } from "@/constants/target-allocation";

const POSITION_PRICES: Record<string, { quantity: number; averagePrice: number; currentPrice: number }> = {
  "VOO":   { quantity: 50,    averagePrice: 480,   currentPrice: 512   },
  "QQQ":   { quantity: 45,    averagePrice: 430,   currentPrice: 455   },
  "SOXX":  { quantity: 72,    averagePrice: 210,   currentPrice: 230   },
  "SMH":   { quantity: 68,    averagePrice: 215,   currentPrice: 240   },
  "GLD":   { quantity: 78,    averagePrice: 200,   currentPrice: 225   },
  "SLV":   { quantity: 560,   averagePrice: 25,    currentPrice: 29    },
  "BTC":   { quantity: 0.185, averagePrice: 55000, currentPrice: 67800 },
  "ETH":   { quantity: 2.5,   averagePrice: 2800,  currentPrice: 3600  },
  "BRK.B": { quantity: 55,    averagePrice: 380,   currentPrice: 410   },
  "TSLA":  { quantity: 45,    averagePrice: 200,   currentPrice: 175   },
};

function getAIAction(diff: number): AIAction {
  if (diff > 2)  return "Buy";
  if (diff < -2) return "Reduce";
  return "Hold";
}

const rawPositions: RawPosition[] = ASSETS.map((a) => ({
  id:            a.id,
  ticker:        a.ticker,
  name:          a.name,
  category:      a.category,
  targetPercent: TARGET_ALLOCATION[a.ticker],
  ...POSITION_PRICES[a.ticker],
}));

function buildPortfolio(raw: RawPosition[]): PortfolioSummaryData {
  const totalValue = raw.reduce((sum, p) => sum + p.quantity * p.currentPrice, 0);

  const positions: PortfolioPosition[] = raw.map((p) => {
    const positionValue       = p.quantity * p.currentPrice;
    const investedAmount      = p.quantity * p.averagePrice;
    const unrealizedPL        = positionValue - investedAmount;
    const unrealizedPLPercent = (unrealizedPL / investedAmount) * 100;
    const currentPercent      = (positionValue / totalValue) * 100;
    const differencePercent   = p.targetPercent - currentPercent;
    const aiAction            = getAIAction(differencePercent);
    return { ...p, positionValue, investedAmount, unrealizedPL, unrealizedPLPercent, currentPercent, differencePercent, aiAction };
  });

  const totalInvested  = positions.reduce((s, p) => s + p.investedAmount, 0);
  const totalPL        = totalValue - totalInvested;
  const totalPLPercent = (totalPL / totalInvested) * 100;

  return { totalValue, totalInvested, totalPL, totalPLPercent, positions };
}

export const portfolioData: PortfolioSummaryData = buildPortfolio(rawPositions);
