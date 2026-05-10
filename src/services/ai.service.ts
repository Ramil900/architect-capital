import { aiAnalysis, quickQuestions, initialMessages } from "@/constants/demo-ai";
import type { AIAnalysisData, AIRecommendation, ChatMessage } from "@/types/ai";

export function getDemoAIReport(): AIAnalysisData {
  return aiAnalysis;
}

export function getAIRecommendations(): AIRecommendation[] {
  return aiAnalysis.recommendations;
}

export function getQuickQuestions(): { label: string; answer: string }[] {
  return quickQuestions;
}

export function getInitialMessages(): ChatMessage[] {
  return initialMessages;
}
