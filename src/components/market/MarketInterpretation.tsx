import type { MarketData } from "@/types/market";

const regimeText: Record<string, { headline: string; body: string; watchLevels: string[] }> = {
  "Risk-On": {
    headline: "Favourable conditions for risk assets",
    body:
      "The market is operating in a Risk-On regime driven by subdued volatility (VIX 16.8) and improving equity breadth. " +
      "Growth assets — equities, crypto, and industrial metals — historically outperform in this environment. " +
      "The primary headwinds are elevated Treasury yields and dollar strength, which may cap upside in rate-sensitive sectors and EM. " +
      "Maintain core risk positions while monitoring VIX for any reversal toward the 18 threshold.",
    watchLevels: [
      "VIX 18 — Regime shift to Neutral",
      "VIX 25 — Shift to Risk-Off, reduce equities",
      "US10Y 4.50% — Rate shock risk elevated",
      "DXY 106 — Commodity and EM pressure intensifies",
    ],
  },
  "Neutral": {
    headline: "Mixed signals — balanced positioning advised",
    body:
      "Markets are in a transitional Neutral regime. Volatility is elevated but not alarming. " +
      "Reduce momentum exposure and favour quality assets with strong fundamentals. " +
      "Diversification across asset classes is key.",
    watchLevels: [
      "VIX 18 — Potential return to Risk-On",
      "VIX 25 — Downside regime shift",
      "S&P 500 200-day MA — Key support level",
    ],
  },
  "Risk-Off": {
    headline: "Defensive posture warranted",
    body:
      "Elevated volatility signals institutional risk reduction. Shift toward defensive assets — gold, Treasuries, and cash. " +
      "Reduce speculative positions in crypto and high-beta equities.",
    watchLevels: [
      "VIX 35 — Crisis threshold — capital preservation priority",
      "Gold $2,400 — Safe-haven breakout level",
      "S&P 500 200-day MA — Bull/bear inflection",
    ],
  },
  "Crisis Mode": {
    headline: "Extreme stress — capital preservation priority",
    body:
      "Crisis-level volatility. Historical drawdowns accelerate at VIX > 35. " +
      "Prioritize liquidity and capital preservation. Avoid averaging into falling positions.",
    watchLevels: [
      "VIX 50 — Potential capitulation zone",
      "S&P 500 -20% — Bear market confirmed",
    ],
  },
};

interface Props {
  data: MarketData;
}

export default function MarketInterpretation({ data }: Props) {
  const text = regimeText[data.regime];
  const cautionIndicators = data.indicators.filter((i) => i.status === "Caution");
  const dangerIndicators  = data.indicators.filter((i) => i.status === "Danger");

  return (
    <div
      className="rounded-lg border p-5"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
        AI Market Interpretation
      </p>

      <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
        {text.headline}
      </p>
      <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
        {text.body}
      </p>

      {(cautionIndicators.length > 0 || dangerIndicators.length > 0) && (
        <div className="mb-4">
          <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>Flagged Indicators</p>
          <div className="flex flex-wrap gap-2">
            {cautionIndicators.map((i) => (
              <span key={i.id} className="text-xs px-2 py-1 rounded font-medium" style={{ color: "var(--yellow)", background: "color-mix(in srgb, var(--yellow) 12%, transparent)" }}>
                ⚠ {i.symbol}
              </span>
            ))}
            {dangerIndicators.map((i) => (
              <span key={i.id} className="text-xs px-2 py-1 rounded font-medium" style={{ color: "var(--red)", background: "color-mix(in srgb, var(--red) 12%, transparent)" }}>
                ✕ {i.symbol}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>Key Watch Levels</p>
        <ul className="flex flex-col gap-1.5">
          {text.watchLevels.map((level) => (
            <li key={level} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--accent)" }} />
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{level}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
