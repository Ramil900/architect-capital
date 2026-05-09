import PortfolioSummaryCard from "@/components/dashboard/PortfolioSummaryCard";
import MarketRegimeCard from "@/components/dashboard/MarketRegimeCard";
import AIRecommendationCard from "@/components/dashboard/AIRecommendationCard";
import AssetAllocationChart from "@/components/dashboard/AssetAllocationChart";
import MarketOverviewGrid from "@/components/dashboard/MarketOverviewGrid";
import TopActionsPanel from "@/components/dashboard/TopActionsPanel";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-5 max-w-[1400px]">
      {/* Top summary row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PortfolioSummaryCard />
        <MarketRegimeCard />
        <AIRecommendationCard />
      </div>

      {/* Main row: chart + actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AssetAllocationChart />
        <TopActionsPanel />
      </div>

      {/* Market indicators */}
      <MarketOverviewGrid />
    </div>
  );
}
