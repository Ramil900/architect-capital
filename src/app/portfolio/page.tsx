import { getPortfolioSummary } from "@/services/portfolio.service";
import PortfolioSummary from "@/components/portfolio/PortfolioSummary";
import PortfolioTable from "@/components/portfolio/PortfolioTable";
import AllocationStatus from "@/components/portfolio/AllocationStatus";
import PortfolioAnalyticsCard from "@/components/portfolio/PortfolioAnalyticsCard";

export default function PortfolioPage() {
  const portfolioData = getPortfolioSummary();

  return (
    <div className="flex flex-col gap-6">
      <PortfolioSummary data={portfolioData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AllocationStatus positions={portfolioData.positions} />
        </div>
        <PortfolioAnalyticsCard data={portfolioData} />
      </div>

      <PortfolioTable data={portfolioData} />
    </div>
  );
}
