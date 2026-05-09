import type { Asset } from "@/types/asset";

export const ASSETS: Asset[] = [
  { id: "voo",  ticker: "VOO",   name: "Vanguard S&P 500 ETF",      category: "ETF",    color: "#3b82f6" },
  { id: "qqq",  ticker: "QQQ",   name: "Invesco QQQ Trust",          category: "ETF",    color: "#6366f1" },
  { id: "soxx", ticker: "SOXX",  name: "iShares Semiconductor ETF",  category: "ETF",    color: "#8b5cf6" },
  { id: "smh",  ticker: "SMH",   name: "VanEck Semiconductor ETF",   category: "ETF",    color: "#a855f7" },
  { id: "gld",  ticker: "GLD",   name: "SPDR Gold Trust",            category: "Metals", color: "#f59e0b" },
  { id: "slv",  ticker: "SLV",   name: "iShares Silver Trust",       category: "Metals", color: "#94a3b8" },
  { id: "btc",  ticker: "BTC",   name: "Bitcoin",                    category: "Crypto", color: "#f97316" },
  { id: "eth",  ticker: "ETH",   name: "Ethereum",                   category: "Crypto", color: "#06b6d4" },
  { id: "brkb", ticker: "BRK.B", name: "Berkshire Hathaway B",       category: "Stocks", color: "#22c55e" },
  { id: "tsla", ticker: "TSLA",  name: "Tesla Inc.",                  category: "Stocks", color: "#ef4444" },
];

export const ASSET_MAP: Record<string, Asset> = Object.fromEntries(ASSETS.map((a) => [a.ticker, a]));
