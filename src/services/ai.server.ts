import { getOpenAIClient } from "@/lib/openai";
import { getUserPortfolioPositions } from "@/services/portfolio.server";
import { getMarketIndicators, getMarketRegime } from "@/services/market.server";
import { ASSETS } from "@/constants/assets";
import { aiAnalysis } from "@/constants/demo-ai";
import type { AIAnalysisData, AIRecommendation, AIAction, AIRegime, RiskLevel, DCAStatus } from "@/types/ai";

const SYSTEM_PROMPT = `You are an institutional investment AI assistant for "Architect Capital" — a professional portfolio management platform.

Analyze the provided portfolio and market data, then respond ONLY with a valid JSON object.

SAFETY RULES (strictly enforce):
- Never promise specific returns or guarantee profitability
- Never use language like "guaranteed", "100% buy", "sure thing", or "no risk"
- Always mention risk alongside every recommendation
- Use hedged language: "consider reducing", "may benefit from", "risk-adjusted opportunity"
- Recommendations are for informational and educational purposes only

REQUIRED JSON STRUCTURE (respond with nothing else):
{
  "marketRegime": "Risk-On" | "Neutral" | "Risk-Off" | "Crisis Mode",
  "portfolioRisk": "Low" | "Moderate" | "High" | "Critical",
  "riskScore": <integer 0-100>,
  "confidence": <integer 50-95>,
  "mainRiskFactors": [<3-5 concise risk factor strings>],
  "recommendations": [
    {
      "ticker": <asset ticker string>,
      "action": "Buy" | "Hold" | "Reduce" | "Sell",
      "reasoning": <1-2 sentences, must mention risk>,
      "confidence": <integer 50-95>
    }
  ],
  "dcaStatus": "Active" | "Paused" | "Recommended",
  "finalSummary": <2-3 sentences, balanced, must mention risk>
}`;

interface RawAIOutput {
  marketRegime:    string;
  portfolioRisk:   string;
  riskScore:       number;
  confidence:      number;
  mainRiskFactors: string[];
  recommendations: { ticker: string; action: string; reasoning: string; confidence: number }[];
  dcaStatus:       string;
  finalSummary:    string;
}

function buildUserPrompt(userId: string, portfolioText: string, marketText: string): string {
  return `PORTFOLIO ANALYSIS REQUEST

${portfolioText}

${marketText}

Provide your institutional-grade analysis in the required JSON format. Ensure all recommendations acknowledge risk.`;
}

function tickerToName(ticker: string): string {
  return ASSETS.find((a) => a.ticker === ticker)?.name ?? ticker;
}

function mapRawToAnalysis(raw: RawAIOutput): AIAnalysisData {
  const validRegimes: AIRegime[] = ["Risk-On", "Neutral", "Risk-Off", "Crisis Mode"];
  const validRisks:   RiskLevel[] = ["Low", "Moderate", "High", "Critical"];
  const validDca:     DCAStatus[] = ["Active", "Paused", "Recommended"];
  const validActions: AIAction[]  = ["Buy", "Hold", "Reduce", "Sell"];

  const marketRegime  = validRegimes.includes(raw.marketRegime as AIRegime) ? raw.marketRegime as AIRegime : "Neutral";
  const portfolioRisk = validRisks.includes(raw.portfolioRisk as RiskLevel) ? raw.portfolioRisk as RiskLevel : "Moderate";
  const dcaStatus     = validDca.includes(raw.dcaStatus as DCAStatus) ? raw.dcaStatus as DCAStatus : "Recommended";

  const recommendations: AIRecommendation[] = (raw.recommendations ?? [])
    .filter((r) => r.ticker && validActions.includes(r.action as AIAction))
    .map((r) => ({
      ticker:     r.ticker,
      name:       tickerToName(r.ticker),
      action:     r.action as AIAction,
      reasoning:  r.reasoning ?? "",
      confidence: Math.min(95, Math.max(50, Number(r.confidence) || 70)),
    }));

  return {
    marketRegime,
    portfolioRisk,
    riskScore:       Math.min(100, Math.max(0, Number(raw.riskScore) || 50)),
    confidence:      Math.min(95,  Math.max(50, Number(raw.confidence) || 70)),
    mainRiskFactors: Array.isArray(raw.mainRiskFactors) ? raw.mainRiskFactors.slice(0, 5) : [],
    recommendations,
    dcaStatus,
    dcaAmount:    aiAnalysis.dcaAmount,
    dcaFrequency: aiAnalysis.dcaFrequency,
    dcaAllocation: aiAnalysis.dcaAllocation,
    finalSummary: raw.finalSummary ?? "",
    lastUpdated:  new Date().toISOString(),
  };
}

export async function generateAIAnalysis(userId: string): Promise<AIAnalysisData> {
  const client = getOpenAIClient();
  if (!client) return { ...aiAnalysis, lastUpdated: new Date().toISOString() };

  try {
    const [portfolioData, indicators, { regime, vix }] = await Promise.all([
      getUserPortfolioPositions(userId),
      getMarketIndicators(),
      getMarketRegime(),
    ]);

    const portfolioText = [
      `PORTFOLIO (Total: $${portfolioData.totalValue.toLocaleString()})`,
      ...portfolioData.positions.map((p) =>
        `  ${p.ticker}: qty=${p.quantity}, avg=$${p.averagePrice}, current=$${p.currentPrice}, weight=${p.currentPercent.toFixed(1)}% (target ${p.targetPercent}%), P/L=${p.unrealizedPLPercent.toFixed(1)}%`
      ),
    ].join("\n");

    const marketText = [
      `MARKET CONDITIONS (Regime: ${regime}, VIX: ${vix})`,
      ...indicators.slice(0, 7).map((i) =>
        `  ${i.symbol}: ${i.displayValue} | ${i.status} | ${i.interpretation}`
      ),
    ].join("\n");

    const response = await client.chat.completions.create({
      model:           "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature:     0.3,
      max_tokens:      1200,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: buildUserPrompt(userId, portfolioText, marketText) },
      ],
    });

    const raw: RawAIOutput = JSON.parse(response.choices[0].message.content ?? "{}");
    return mapRawToAnalysis(raw);
  } catch {
    return { ...aiAnalysis, lastUpdated: new Date().toISOString() };
  }
}
