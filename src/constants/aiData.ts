import type { AIAnalysisData, ChatMessage } from "@/types/ai";

export const aiAnalysis: AIAnalysisData = {
  marketRegime:  "Risk-On",
  portfolioRisk: "Moderate",
  riskScore:     34,
  confidence:    87,
  mainRiskFactors: [
    "US10Y elevated at 4.35% — rate shock risk",
    "DXY strength at 104.2 — EM and commodity pressure",
    "TSLA overweight +2.3% vs target with -12.5% unrealized loss",
    "Crypto allocation approaching upper threshold",
  ],
  recommendations: [
    {
      ticker:     "TSLA",
      name:       "Tesla Inc.",
      action:     "Reduce",
      reasoning:  "Overweight vs target. -12.5% unrealized loss. No near-term catalyst. Reduce 30–40% to free capital.",
      confidence: 82,
    },
    {
      ticker:     "VOO",
      name:       "Vanguard S&P 500 ETF",
      action:     "Buy",
      reasoning:  "Underweight vs 20% target. Bull trend intact. Core index exposure — priority allocation.",
      confidence: 91,
    },
    {
      ticker:     "SMH",
      name:       "VanEck Semiconductor ETF",
      action:     "Buy",
      reasoning:  "Underweight vs target. Semiconductor cycle recovery underway. AI demand structural tailwind.",
      confidence: 79,
    },
    {
      ticker:     "GLD",
      name:       "SPDR Gold Trust",
      action:     "Hold",
      reasoning:  "Within target allocation. Central bank demand provides floor. Dollar headwinds limit upside.",
      confidence: 88,
    },
    {
      ticker:     "BTC",
      name:       "Bitcoin",
      action:     "Hold",
      reasoning:  "Post-halving momentum intact. ETF inflows accelerating. Within target — no action needed.",
      confidence: 76,
    },
  ],
  dcaStatus:    "Recommended",
  dcaAmount:    500,
  dcaFrequency: "Weekly",
  dcaAllocation: [
    { ticker: "VOO", percent: 60 },
    { ticker: "SMH", percent: 20 },
    { ticker: "BTC", percent: 20 },
  ],
  finalSummary:
    "Portfolio is well-positioned for the current Risk-On regime. Primary action: reduce TSLA exposure and deploy proceeds into underweight ETF positions. DCA into VOO and SMH recommended. Crypto within bounds — no rebalancing required.",
  lastUpdated: "May 10, 2026 · 09:42 AM",
};

export const quickQuestions: { label: string; answer: string }[] = [
  {
    label:  "Что купить сегодня?",
    answer:
      "На основе текущего анализа рекомендую увеличить позиции в VOO и SMH. Оба актива торгуются ниже целевого процента. VOO: текущий ~19.2% vs цель 20%. SMH: ~8.8% vs цель 10%. Уверенность: 91% и 79% соответственно.",
  },
  {
    label:  "Что продать?",
    answer:
      "TSLA показывает -12.5% нереализованного убытка и превышает целевую аллокацию на 2.3%. Рекомендую сократить позицию на 30–40%. Это освободит капитал для ребалансировки в пользу VOO и SMH.",
  },
  {
    label:  "Насколько опасен рынок?",
    answer:
      "Риск-скор: 34/100 — умеренный. VIX 16.8 — волатильность низкая, режим Risk-On. Основные риски: повышенная доходность US10Y (4.35%) и сила доллара (DXY 104.2). Системной угрозы нет.",
  },
  {
    label:  "Нужно ли включать DCA?",
    answer:
      "Да, DCA рекомендован. Рынок в Risk-On режиме — регулярные покупки исторически показывают лучшие результаты. Оптимальная стратегия: $500 еженедельно: 60% VOO, 20% SMH, 20% BTC.",
  },
  {
    label:  "Можно ли использовать плечо?",
    answer:
      "Не рекомендуется. Несмотря на Risk-On режим, US10Y на уровне 4.35% делает стоимость заимствований высокой. Подождите снижения ставок ФРС или падения VIX ниже 14.",
  },
  {
    label:  "Какие активы перегружены?",
    answer:
      "TSLA превышает целевой % на 2.3% — приоритет к сокращению. ETH незначительно перегружен (+1.1% vs цель). Остальные позиции находятся в допустимых пределах аллокации.",
  },
];

export const initialMessages: ChatMessage[] = [
  {
    id:      "0",
    role:    "ai",
    content: "Добро пожаловать в AI Strategy Terminal. Текущий рыночный режим: Risk-On (VIX 16.8). Портфельный риск: Moderate (34/100). Выберите вопрос ниже или задайте свой.",
  },
];
