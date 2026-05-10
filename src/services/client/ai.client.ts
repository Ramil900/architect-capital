import { apiGet } from "@/lib/api-client";
import type { AIAnalysisData } from "@/types/ai";

export function getAIAnalysis(): Promise<AIAnalysisData> {
  return apiGet<AIAnalysisData>("/api/ai/analyze");
}

export async function generateAnalysis(): Promise<AIAnalysisData> {
  const res = await fetch("/api/ai/analyze", { method: "POST" });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  const json: { success: boolean; data: AIAnalysisData | null; error: string | null } = await res.json();
  if (!json.success || !json.data) throw new Error(json.error ?? "AI analysis failed");
  return json.data;
}
