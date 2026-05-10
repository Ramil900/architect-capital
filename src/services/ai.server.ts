import { getOpenAIClient } from "@/lib/openai";
import { getUserPortfolioPositions } from "@/services/portfolio.server";
import { getMarketIndicators, getMarketRegime } from "@/services/market.server";
import { ASSETS } from "@/constants/assets";
import { aiAnalysis } from "@/constants/demo-ai";
import type { AIAnalysisData, AIRecommendation, AIAction, AIRegime, RiskLevel, DCAStatus } from "@/types/ai";

const SYSTEM_PROMPT = `You are a senior institutional investment analyst, risk manager, and portfolio strategist at "Architect Capital" — a professional portfolio management platform for sophisticated investors.

Your role:
- Institutional investment analyst: assess allocation efficiency, concentration risk, and return/risk trade-offs
- Risk manager: identify tail risks, regime shifts, correlation breakdowns, and drawdown scenarios
- Portfolio strategist: provide actionable, evidence-based rebalancing and DCA guidance

ANALYSIS FRAMEWORK:
1. Market Regime Assessment — evaluate VIX (fear/complacency), DXY (dollar strength), US10Y (rate pressure), S&P500/Nasdaq trend, BTC/ETH sentiment, Gold/Silver as safe-haven demand
2. Portfolio Risk Profiling — concentration risk, asset correlation, target vs current weight drift, unrealized P/L exposure
3. Rebalancing Needs — identify positions significantly off target allocation
4. DCA Guidance — assess whether conditions favor accumulation, pause, or scaling back

UNCERTAINTY PRINCIPLES (always apply):
- Market regimes can shift without warning; all analysis is probabilistic, not certain
- Past performance, indicator readings, and correlations do not guarantee future outcomes
- Never promise returns, never use "guaranteed", "100% buy", "sure thing", or "no risk"
- Every recommendation must acknowledge specific downside risk
- Use precise hedged language: "elevated probability of", "consider reducing exposure", "risk-adjusted opportunity under current conditions", "should conditions deteriorate"
- Recommendations are for informational and educational purposes only — not financial advice
- Never suggest automated trading, leverage, or margin strategies
- Always highlight what could go wrong with each recommendation

REQUIRED JSON STRUCTURE (respond with nothing else — valid JSON only):
{
  "marketRegime": "Risk-On" | "Neutral" | "Risk-Off" | "Crisis Mode",
  "portfolioRisk": "Low" | "Medium" | "High" | "Extreme",
  "riskScore": <integer 0-100>,
  "confidence": <integer 50-95>,
  "mainRiskFactors": [<3-5 concise risk factor strings, each referencing specific data>],
  "recommendations": [
    {
      "asset": <ticker string, e.g. "VOO", "BTC", "GLD">,
      "action": "Buy" | "Hold" | "Reduce" | "Sell",
      "reason": <1-2 sentences: state the rationale AND the specific downside risk>,
      "priority": "Low" | "Medium" | "High"
    }
  ],
  "dcaStatus": "Active" | "Paused" | "Recommended",
  "rebalanceSummary": <1-2 sentences on portfolio drift and rebalancing priority>,
  "finalSummary": <2-3 sentences: balanced assessment, regime context, top risk, and outlook uncertainty>
}`;

interface RawAIOutput {
  marketRegime:     string;
  portfolioRisk:    string;
  riskScore:        number;
  confidence:       number;
  mainRiskFactors:  string[];
  recommendations:  { asset?: string; ticker?: string; action: string; reason?: string; reasoning?: string; priority?: string; confidence?: number }[];
  dcaStatus:        string;
  rebalanceSummary?: string;
  finalSummary:     string;
}

function buildUserPrompt(_userId: string, portfolioText: string, marketText: string): string {
  return `INSTITUTIONAL PORTFOLIO ANALYSIS REQUEST

${portfolioText}

${marketText}

ANALYSIS INSTRUCTIONS:
- Identify the top 3-5 risk factors specific to this portfolio and current market conditions
- Flag any position with current weight deviating more than 5% from target as a rebalancing candidate
- Assess concentration risk: if any single asset exceeds 30% weight, flag as elevated risk
- Evaluate DCA conditions: Risk-Off or Crisis Mode regimes with VIX above 25 favor DCA accumulation in quality assets
- For each recommendation, name the specific risk that could invalidate it
- marketRegime must reflect actual VIX, trend, and macro context provided
- riskScore 0-30 = Low, 31-55 = Medium, 56-75 = High, 76-100 = Extreme

Provide your institutional-grade analysis strictly in the required JSON format. Every recommendation must include a specific downside risk.`;
}

function tickerToName(ticker: string): string {
  return ASSETS.find((a) => a.ticker === ticker)?.name ?? ticker;
}

const PRIORITY_TO_CONFIDENCE: Record<string, number> = { High: 85, Medium: 70, Low: 55 };
const RISK_LEVEL_MAP: Record<string, RiskLevel> = {
  Low: "Low", Medium: "Moderate", Moderate: "Moderate", High: "High", Extreme: "Critical", Critical: "Critical",
};

function mapRawToAnalysis(raw: RawAIOutput): AIAnalysisData {
  const validRegimes: AIRegime[] = ["Risk-On", "Neutral", "Risk-Off", "Crisis Mode"];
  const validDca:     DCAStatus[] = ["Active", "Paused", "Recommended"];
  const validActions: AIAction[]  = ["Buy", "Hold", "Reduce", "Sell"];

  const marketRegime  = validRegimes.includes(raw.marketRegime as AIRegime) ? raw.marketRegime as AIRegime : "Neutral";
  const portfolioRisk = RISK_LEVEL_MAP[raw.portfolioRisk] ?? "Moderate";
  const dcaStatus     = validDca.includes(raw.dcaStatus as DCAStatus) ? raw.dcaStatus as DCAStatus : "Recommended";

  const recommendations: AIRecommendation[] = (raw.recommendations ?? [])
    .filter((r) => (r.asset || r.ticker) && validActions.includes(r.action as AIAction))
    .map((r) => {
      const ticker = (r.asset ?? r.ticker ?? "").trim();
      const confidence = r.priority
        ? (PRIORITY_TO_CONFIDENCE[r.priority] ?? 70)
        : Math.min(95, Math.max(50, Number(r.confidence) || 70));
      return {
        ticker,
        name:      tickerToName(ticker),
        action:    r.action as AIAction,
        reasoning: (r.reason ?? r.reasoning ?? "").trim(),
        confidence,
      };
    });

  return {
    marketRegime,
    portfolioRisk,
    riskScore:       Math.min(100, Math.max(0, Number(raw.riskScore) || 50)),
    confidence:      Math.min(95,  Math.max(50, Number(raw.confidence) || 70)),
    mainRiskFactors: Array.isArray(raw.mainRiskFactors) ? raw.mainRiskFactors.slice(0, 5) : [],
    recommendations,
    dcaStatus,
    dcaAmount:       aiAnalysis.dcaAmount,
    dcaFrequency:    aiAnalysis.dcaFrequency,
    dcaAllocation:   aiAnalysis.dcaAllocation,
    rebalanceSummary: raw.rebalanceSummary ?? "",
    finalSummary:    raw.finalSummary ?? "",
    lastUpdated:     new Date().toISOString(),
  };
}

export async function generateAIAnalysis(userId: string): Promise<AIAnalysisData> {
  const client = getOpenAIClient();
  if (!client) return { ...aiAnalysis, lastUpdated: new Date().toISOString() };

  try {
    const [portfolioData, indicators, { regime, vix, riskScore }] = await Promise.all([
      getUserPortfolioPositions(userId),
      getMarketIndicators(),
      getMarketRegime(),
    ]);

    const totalValue = portfolioData.totalValue;
    const positions  = portfolioData.positions;

    const concentrationWarnings = positions
      .filter((p) => p.currentPercent > 30)
      .map((p) => `  ⚠ CONCENTRATION: ${p.ticker} at ${p.currentPercent.toFixed(1)}% (>30% threshold)`);

    const driftWarnings = positions
      .filter((p) => Math.abs(p.currentPercent - p.targetPercent) > 5)
      .map((p) => {
        const drift = (p.currentPercent - p.targetPercent).toFixed(1);
        return `  ↕ DRIFT: ${p.ticker} ${parseFloat(drift) > 0 ? "+" : ""}${drift}% off target`;
      });

    const portfolioText = [
      `PORTFOLIO OVERVIEW`,
      `  Total Value: $${totalValue.toLocaleString()}`,
      `  Positions: ${positions.length}`,
      ...(concentrationWarnings.length ? concentrationWarnings : []),
      ...(driftWarnings.length ? driftWarnings : []),
      ``,
      `POSITIONS (ticker | qty | avg cost | current price | weight → target | P/L%)`,
      ...positions.map((p) =>
        `  ${p.ticker}: qty=${p.quantity}, avg=$${p.averagePrice.toFixed(2)}, price=$${p.currentPrice.toFixed(2)}, weight=${p.currentPercent.toFixed(1)}%→${p.targetPercent}%, P/L=${p.unrealizedPLPercent.toFixed(1)}%`
      ),
    ].join("\n");

    const INDICATOR_PRIORITY = ["VIX", "SPX", "IXIC", "US10Y", "DXY", "BTC", "ETH", "XAU", "XAG"];
    const sortedIndicators = [...indicators].sort(
      (a, b) => INDICATOR_PRIORITY.indexOf(a.symbol) - INDICATOR_PRIORITY.indexOf(b.symbol),
    );

    const marketText = [
      `MARKET CONDITIONS`,
      `  Regime: ${regime} | VIX: ${vix} | Risk Score: ${riskScore}/100`,
      ``,
      `MARKET INDICATORS (symbol | value | status | interpretation)`,
      ...sortedIndicators.slice(0, 9).map((i) =>
        `  ${i.symbol}: ${i.displayValue} | ${i.status} | ${i.interpretation}`
      ),
    ].join("\n");

    const response = await client.chat.completions.create({
      model:           "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature:     0.25,
      max_tokens:      1500,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: buildUserPrompt(userId, portfolioText, marketText) },
      ],
    });

    const content = response.choices[0].message.content ?? "{}";
    const raw: RawAIOutput = JSON.parse(content);
    return mapRawToAnalysis(raw);
  } catch {
    return { ...aiAnalysis, lastUpdated: new Date().toISOString() };
  }
}
