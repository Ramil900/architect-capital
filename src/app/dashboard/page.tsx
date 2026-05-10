"use client";

import { useState, useEffect, useCallback } from "react";
import { getPortfolio } from "@/services/client/portfolio.client";
import { getMarketRegime, getMarketIndicators } from "@/services/client/market.client";
import { getAIAnalysis } from "@/services/client/ai.client";
import { portfolioData } from "@/constants/demo-portfolio";
import { marketData as demoMarket } from "@/constants/demo-market";
import { aiAnalysis as demoAI } from "@/constants/demo-ai";
import { PageLoading } from "@/components/ui/PageStates";
import PortfolioSummaryCard from "@/components/dashboard/PortfolioSummaryCard";
import MarketRegimeCard from "@/components/dashboard/MarketRegimeCard";
import AIRecommendationCard from "@/components/dashboard/AIRecommendationCard";
import AssetAllocationChart from "@/components/dashboard/AssetAllocationChart";
import MarketOverviewGrid from "@/components/dashboard/MarketOverviewGrid";
import TopActionsPanel from "@/components/dashboard/TopActionsPanel";
import type { PortfolioSummaryData } from "@/types/portfolio";
import type { MarketRegime, MarketIndicator } from "@/types/market";
import type { AIAnalysisData } from "@/types/ai";

interface RegimeData { regime: MarketRegime; vix: number; riskScore: number }

export default function DashboardPage() {
  const [loading, setLoading]       = useState(true);
  const [portfolio, setPortfolio]   = useState<PortfolioSummaryData>(portfolioData);
  const [regime, setRegime]         = useState<RegimeData>({ regime: demoMarket.regime, vix: demoMarket.vix, riskScore: demoMarket.riskScore });
  const [indicators, setIndicators] = useState<MarketIndicator[]>(demoMarket.indicators);
  const [ai, setAI]                 = useState<AIAnalysisData>(demoAI);

  const load = useCallback(() => {
    setLoading(true);
    Promise.allSettled([
      getPortfolio(),
      getMarketRegime(),
      getMarketIndicators(),
      getAIAnalysis(),
    ]).then(([portfolioRes, regimeRes, indicatorsRes, aiRes]) => {
      if (portfolioRes.status  === "fulfilled") setPortfolio(portfolioRes.value);
      if (regimeRes.status     === "fulfilled") setRegime(regimeRes.value);
      if (indicatorsRes.status === "fulfilled") setIndicators(indicatorsRes.value);
      if (aiRes.status         === "fulfilled") setAI(aiRes.value);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <PageLoading />;

  return (
    <div className="flex flex-col gap-5 max-w-[1400px]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PortfolioSummaryCard
          totalValue={portfolio.totalValue}
          totalPL={portfolio.totalPL}
          totalPLPercent={portfolio.totalPLPercent}
          portfolioRisk={ai.portfolioRisk}
        />
        <MarketRegimeCard regime={regime.regime} vix={regime.vix} riskScore={regime.riskScore} />
        <AIRecommendationCard
          recommendations={ai.recommendations}
          finalSummary={ai.finalSummary}
          dcaStatus={ai.dcaStatus}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AssetAllocationChart />
        <TopActionsPanel recommendations={ai.recommendations} />
      </div>

      <MarketOverviewGrid indicators={indicators} />
    </div>
  );
}
