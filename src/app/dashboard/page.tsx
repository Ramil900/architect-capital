"use client";

import { useState, useEffect } from "react";
import { getPortfolio } from "@/services/client/portfolio.client";
import { getMarketRegime } from "@/services/client/market.client";
import { PageLoading, PageError } from "@/components/ui/PageStates";
import PortfolioSummaryCard from "@/components/dashboard/PortfolioSummaryCard";
import MarketRegimeCard from "@/components/dashboard/MarketRegimeCard";
import AIRecommendationCard from "@/components/dashboard/AIRecommendationCard";
import AssetAllocationChart from "@/components/dashboard/AssetAllocationChart";
import MarketOverviewGrid from "@/components/dashboard/MarketOverviewGrid";
import TopActionsPanel from "@/components/dashboard/TopActionsPanel";

export default function DashboardPage() {
  const [ready, setReady]     = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getPortfolio(), getMarketRegime()])
      .then(() => setReady(true))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;
  if (error)   return <PageError message={error} />;
  if (!ready)  return null;

  return (
    <div className="flex flex-col gap-5 max-w-[1400px]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PortfolioSummaryCard />
        <MarketRegimeCard />
        <AIRecommendationCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AssetAllocationChart />
        <TopActionsPanel />
      </div>

      <MarketOverviewGrid />
    </div>
  );
}
