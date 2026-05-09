import { aiAnalysis } from "@/constants/aiData";
import AISummaryCard from "@/components/ai/AISummaryCard";
import AIChatWindow from "@/components/ai/AIChatWindow";
import MarketRegimeAnalysis from "@/components/ai/MarketRegimeAnalysis";
import PortfolioRiskAnalysis from "@/components/ai/PortfolioRiskAnalysis";
import AIRecommendationPanel from "@/components/ai/AIRecommendationPanel";
import DcaStatusCard from "@/components/ai/DcaStatusCard";

export default function AIStrategyPage() {
  return (
    <div className="flex flex-col gap-6">
      <AISummaryCard data={aiAnalysis} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AIChatWindow />
        </div>
        <div className="flex flex-col gap-6">
          <DcaStatusCard data={aiAnalysis} />
          <MarketRegimeAnalysis data={aiAnalysis} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PortfolioRiskAnalysis data={aiAnalysis} />
        <AIRecommendationPanel data={aiAnalysis} />
      </div>
    </div>
  );
}
