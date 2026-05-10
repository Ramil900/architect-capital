"use client";

import { useState, useEffect } from "react";
import { BrainCircuit } from "lucide-react";
import { getAIAnalysis, generateAnalysis } from "@/services/client/ai.client";
import type { AIAnalysisData } from "@/types/ai";
import { PageLoading, PageError } from "@/components/ui/PageStates";
import AISummaryCard          from "@/components/ai/AISummaryCard";
import AIChatWindow           from "@/components/ai/AIChatWindow";
import MarketRegimeAnalysis   from "@/components/ai/MarketRegimeAnalysis";
import PortfolioRiskAnalysis  from "@/components/ai/PortfolioRiskAnalysis";
import AIRecommendationPanel  from "@/components/ai/AIRecommendationPanel";
import DcaStatusCard          from "@/components/ai/DcaStatusCard";

export default function AIStrategyPage() {
  const [data,       setData]       = useState<AIAnalysisData | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genError,   setGenError]   = useState<string | null>(null);

  useEffect(() => {
    getAIAnalysis()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleGenerate() {
    setGenerating(true);
    setGenError(null);
    try {
      const result = await generateAnalysis();
      setData(result);
    } catch (e) {
      setGenError(e instanceof Error ? e.message : "AI analysis failed");
    } finally {
      setGenerating(false);
    }
  }

  if (loading) return <PageLoading />;
  if (error)   return <PageError message={error} />;
  if (!data)   return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Generate button */}
      <div className="flex items-center justify-between">
        <div />
        <div className="flex items-center gap-3">
          {genError && (
            <p className="text-xs" style={{ color: "var(--red)" }}>{genError}</p>
          )}
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-opacity disabled:opacity-60"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            {generating
              ? <span className="w-3.5 h-3.5 rounded-full border-2 animate-spin" style={{ borderColor: "#fff", borderTopColor: "transparent" }} />
              : <BrainCircuit size={14} />}
            {generating ? "Generating…" : "Generate AI Analysis"}
          </button>
        </div>
      </div>

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
