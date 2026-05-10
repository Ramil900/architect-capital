import { apiGet } from "@/lib/api-client";
import type { AIAnalysisData } from "@/types/ai";

export function getAIAnalysis(): Promise<AIAnalysisData> {
  return apiGet<AIAnalysisData>("/api/ai/analyze");
}
