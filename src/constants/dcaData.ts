import type { DCASummaryData, DCALevel } from "@/types/dca";
import { ASSET_MAP } from "@/constants/assets";

type BuyZoneBase = {
  ticker: string; currentPrice: number;
  smallBuy: number; normalBuy: number; strongBuy: number;
  aggressiveBuy: number; crisisBuy: number;
  activeLevel: DCALevel;
};

export const dcaData: DCASummaryData = {
  marketDrop:       -12,
  dcaStatus:        "Partial DCA",
  cashReserved:     10000,
  cashUsed:         2000,
  cashUsagePercent: 20,
  riskLevel:        "Medium-High",
  recommendedAssets:["VOO", "GLD"],
  avoidAssets:      ["TSLA", "ETH"],

  scenarios: [
    { drop: -5,  level: "Small Buy",      cashDeployPercent: 20,  cashDeployAmount: 2000,  triggered: true,  current: false },
    { drop: -10, level: "Normal Buy",     cashDeployPercent: 40,  cashDeployAmount: 4000,  triggered: true,  current: true  },
    { drop: -20, level: "Strong Buy",     cashDeployPercent: 60,  cashDeployAmount: 6000,  triggered: false, current: false },
    { drop: -35, level: "Aggressive Buy", cashDeployPercent: 80,  cashDeployAmount: 8000,  triggered: false, current: false },
    { drop: -50, level: "Crisis Buy",     cashDeployPercent: 100, cashDeployAmount: 10000, triggered: false, current: false },
  ],

  buyZones: ([
    { ticker: "VOO",   currentPrice: 512,   smallBuy: 553,   normalBuy: 524,   strongBuy: 465,   aggressiveBuy: 378,  crisisBuy: 291,  activeLevel: "Normal Buy" },
    { ticker: "QQQ",   currentPrice: 455,   smallBuy: 491,   normalBuy: 465,   strongBuy: 414,   aggressiveBuy: 336,  crisisBuy: 258,  activeLevel: "Normal Buy" },
    { ticker: "SOXX",  currentPrice: 230,   smallBuy: 248,   normalBuy: 235,   strongBuy: 209,   aggressiveBuy: 170,  crisisBuy: 131,  activeLevel: "Normal Buy" },
    { ticker: "SMH",   currentPrice: 240,   smallBuy: 259,   normalBuy: 245,   strongBuy: 218,   aggressiveBuy: 177,  crisisBuy: 136,  activeLevel: "Normal Buy" },
    { ticker: "GLD",   currentPrice: 225,   smallBuy: 243,   normalBuy: 230,   strongBuy: 205,   aggressiveBuy: 166,  crisisBuy: 128,  activeLevel: "Normal Buy" },
    { ticker: "SLV",   currentPrice: 29,    smallBuy: 31.3,  normalBuy: 29.7,  strongBuy: 26.4,  aggressiveBuy: 21.4, crisisBuy: 16.5, activeLevel: "Normal Buy" },
    { ticker: "BTC",   currentPrice: 67800, smallBuy: 73200, normalBuy: 69300, strongBuy: 61600, aggressiveBuy: 50100,crisisBuy: 38500,activeLevel: "Normal Buy" },
    { ticker: "ETH",   currentPrice: 3600,  smallBuy: 3886,  normalBuy: 3682,  strongBuy: 3273,  aggressiveBuy: 2659, crisisBuy: 2046, activeLevel: "Normal Buy" },
    { ticker: "BRK.B", currentPrice: 410,   smallBuy: 443,   normalBuy: 419,   strongBuy: 373,   aggressiveBuy: 303,  crisisBuy: 233,  activeLevel: "Normal Buy" },
    { ticker: "TSLA",  currentPrice: 175,   smallBuy: 189,   normalBuy: 179,   strongBuy: 159,   aggressiveBuy: 129,  crisisBuy: 99,   activeLevel: "Normal Buy" },
  ] as BuyZoneBase[]).map((z) => ({
    ...z,
    name:     ASSET_MAP[z.ticker].name,
    category: ASSET_MAP[z.ticker].category,
  })),

  riskFactors: [
    "Market still -12% from ATH — further downside possible before recovery",
    "DXY strength at 104.2 may continue pressuring risk assets",
    "No Fed pivot signal — rates staying higher for longer",
    "TSLA fundamental uncertainty — DCA not supported by technicals",
    "ETH regulatory overhang — avoid aggressive accumulation",
  ],

  recommendations: [
    { ticker: "VOO",   action: "Buy Now",       amount: 2000, note: "Core position. Buy $2,000 now at Normal Buy zone. Add $2,000 more at -20% (Strong Buy)." },
    { ticker: "GLD",   action: "Buy Now",       amount: 1000, note: "Safe-haven allocation. Reduces portfolio correlation. Buy $1,000 now." },
    { ticker: "QQQ",   action: "Wait for Zone", amount: 1500, note: "Wait for -20% Strong Buy zone ($414) for better entry risk/reward." },
    { ticker: "BTC",   action: "Wait for Zone", amount: null, note: "Within target allocation. Wait for -20% zone ($61,600) before adding." },
    { ticker: "TSLA",  action: "Avoid",         amount: null, note: "Fundamental concerns. -12.5% unrealized loss. Avoid DCA — wait for trend reversal." },
    { ticker: "ETH",   action: "Avoid",         amount: null, note: "Regulatory uncertainty pending. Avoid aggressive buying. Monitor for clarity." },
  ],
};
