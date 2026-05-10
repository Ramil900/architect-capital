"use client";

import { useState, useEffect } from "react";
import { getMarketData } from "@/services/client/market.client";
import type { MarketData } from "@/types/market";
import { PageLoading, PageError } from "@/components/ui/PageStates";
import MarketSummary from "@/components/market/MarketSummary";
import MarketTrendChart from "@/components/market/MarketTrendChart";
import RiskScoreCard from "@/components/market/RiskScoreCard";
import IndicatorGrid from "@/components/market/IndicatorGrid";
import MarketInterpretation from "@/components/market/MarketInterpretation";

export default function MarketPage() {
  const [data, setData]       = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    getMarketData()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;
  if (error)   return <PageError message={error} />;
  if (!data)   return null;

  return (
    <div className="flex flex-col gap-6">
      <MarketSummary data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MarketTrendChart />
        </div>
        <RiskScoreCard data={data} />
      </div>

      <IndicatorGrid indicators={data.indicators} />

      <MarketInterpretation data={data} />
    </div>
  );
}
