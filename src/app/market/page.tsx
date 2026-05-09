import { marketData } from "@/constants/marketData";
import MarketSummary from "@/components/market/MarketSummary";
import MarketTrendChart from "@/components/market/MarketTrendChart";
import RiskScoreCard from "@/components/market/RiskScoreCard";
import IndicatorGrid from "@/components/market/IndicatorGrid";
import MarketInterpretation from "@/components/market/MarketInterpretation";

export default function MarketPage() {
  return (
    <div className="flex flex-col gap-6">
      <MarketSummary data={marketData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MarketTrendChart />
        </div>
        <RiskScoreCard data={marketData} />
      </div>

      <IndicatorGrid indicators={marketData.indicators} />

      <MarketInterpretation data={marketData} />
    </div>
  );
}
