export type RiskLevel    = "Low" | "Moderate" | "High" | "Critical";
export type AIAction     = "Buy" | "Hold" | "Reduce" | "Sell";
export type AIRegime     = "Risk-On" | "Neutral" | "Risk-Off" | "Crisis Mode";
export type DCAStatus    = "Active" | "Paused" | "Recommended";
export type MessageRole  = "user" | "ai";

export interface AIRecommendation {
  ticker:     string;
  name:       string;
  action:     AIAction;
  reasoning:  string;
  confidence: number;
}

export interface ChatMessage {
  id:       string;
  role:     MessageRole;
  content:  string;
}

export interface AIAnalysisData {
  marketRegime:    AIRegime;
  portfolioRisk:   RiskLevel;
  riskScore:       number;
  confidence:      number;
  mainRiskFactors: string[];
  recommendations: AIRecommendation[];
  dcaStatus:       DCAStatus;
  dcaAmount:       number;
  dcaFrequency:    string;
  dcaAllocation:   { ticker: string; percent: number }[];
  finalSummary:    string;
  lastUpdated:     string;
}
