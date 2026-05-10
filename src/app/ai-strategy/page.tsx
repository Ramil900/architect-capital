"use client";

import { useState, useEffect } from "react";
import { getAIAnalysis } from "@/services/client/ai.client";
import type { AIAnalysisData } from "@/types/ai";
import { PageLoading, PageError } from "@/components/ui/PageStates";
import AISummaryCard from "@/components/ai/AISummaryCard";
import AIChatWindow from "@/components/ai/AIChatWindow";
import MarketRegimeAnalysis from "@/components/ai/MarketRegimeAnalysis";
import PortfolioRiskAnalysis from "@/components/ai/PortfolioRiskAnalysis";
import AIRecommendationPanel from "@/components/ai/AIRecommendationPanel";
import DcaStatusCard from "@/components/ai/DcaStatusCard";

export default function AIStrategyPage() {
  const [data, setData]       = useState<AIAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    getAIAnalysis()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;
  if (error)   return <PageError message={error} />;
  if (!data)   return null;

  return (
    <div className="flex flex-col gap-6">
      <AISummaryCard data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AIChatWindow />
        </div>
        <div className="flex flex-col gap-6">
          <DcaStatusCard data={data} />
          <MarketRegimeAnalysis data={data} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PortfolioRiskAnalysis data={data} />
        <AIRecommendationPanel data={data} />
      </div>
    </div>
  );
}
