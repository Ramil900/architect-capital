import type { Asset } from "@/types/asset";

export const ASSETS: Asset[] = [
  { id: "voo",  ticker: "VOO",   name: "Vanguard S&P 500 ETF",      category: "ETF",    color: "#3b82f6", riskLevel: "Medium"  },
  { id: "qqq",  ticker: "QQQ",   name: "Invesco QQQ Trust",          category: "ETF",    color: "#6366f1", riskLevel: "High"    },
  { id: "soxx", ticker: "SOXX",  name: "iShares Semiconductor ETF",  category: "ETF",    color: "#8b5cf6", riskLevel: "High"    },
  { id: "smh",  ticker: "SMH",   name: "VanEck Semiconductor ETF",   category: "ETF",    color: "#a855f7", riskLevel: "High"    },
  { id: "gld",  ticker: "GLD",   name: "SPDR Gold Shares",           category: "Metals", color: "#f59e0b", riskLevel: "Medium"  },
  { id: "slv",  ticker: "SLV",   name: "iShares Silver Trust",       category: "Metals", color: "#94a3b8", riskLevel: "High"    },
  { id: "btc",  ticker: "BTC",   name: "Bitcoin",                    category: "Crypto", color: "#f97316", riskLevel: "Extreme" },
  { id: "eth",  ticker: "ETH",   name: "Ethereum",                   category: "Crypto", color: "#06b6d4", riskLevel: "Extreme" },
  { id: "brkb", ticker: "BRK.B", name: "Berkshire Hathaway Class B", category: "Stocks", color: "#22c55e", riskLevel: "Medium"  },
  { id: "tsla", ticker: "TSLA",  name: "Tesla Inc.",                  category: "Stocks", color: "#ef4444", riskLevel: "Extreme" },
];

export const ASSET_MAP: Record<string, Asset> = Object.fromEntries(ASSETS.map((a) => [a.ticker, a]));

export const VALID_TICKERS = new Set(ASSETS.map((a) => a.ticker));
