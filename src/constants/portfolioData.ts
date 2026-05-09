import type { AIAction, PortfolioPosition, PortfolioSummaryData, RawPosition } from "@/types/portfolio";

const rawPositions: RawPosition[] = [
  { id: "voo",  ticker: "VOO",   name: "Vanguard S&P 500 ETF",      category: "ETF",    quantity: 50,    averagePrice: 480,   currentPrice: 512,   targetPercent: 20 },
  { id: "qqq",  ticker: "QQQ",   name: "Invesco QQQ Trust",          category: "ETF",    quantity: 45,    averagePrice: 430,   currentPrice: 455,   targetPercent: 15 },
  { id: "soxx", ticker: "SOXX",  name: "iShares Semiconductor ETF",  category: "ETF",    quantity: 72,    averagePrice: 210,   currentPrice: 230,   targetPercent: 10 },
  { id: "smh",  ticker: "SMH",   name: "VanEck Semiconductor ETF",   category: "ETF",    quantity: 68,    averagePrice: 215,   currentPrice: 240,   targetPercent: 10 },
  { id: "gld",  ticker: "GLD",   name: "SPDR Gold Trust",            category: "Metals", quantity: 78,    averagePrice: 200,   currentPrice: 225,   targetPercent: 10 },
  { id: "slv",  ticker: "SLV",   name: "iShares Silver Trust",       category: "Metals", quantity: 560,   averagePrice: 25,    currentPrice: 29,    targetPercent: 10 },
  { id: "btc",  ticker: "BTC",   name: "Bitcoin",                    category: "Crypto", quantity: 0.185, averagePrice: 55000, currentPrice: 67800, targetPercent: 7  },
  { id: "eth",  ticker: "ETH",   name: "Ethereum",                   category: "Crypto", quantity: 2.5,   averagePrice: 2800,  currentPrice: 3600,  targetPercent: 3  },
  { id: "brkb", ticker: "BRK.B", name: "Berkshire Hathaway B",       category: "Stocks", quantity: 55,    averagePrice: 380,   currentPrice: 410,   targetPercent: 10 },
  { id: "tsla", ticker: "TSLA",  name: "Tesla Inc.",                  category: "Stocks", quantity: 45,    averagePrice: 200,   currentPrice: 175,   targetPercent: 5  },
];

function getAIAction(diff: number): AIAction {
  if (diff > 2)  return "Buy";
  if (diff < -2) return "Reduce";
  return "Hold";
}

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
