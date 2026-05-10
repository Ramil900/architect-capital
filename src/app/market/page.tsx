"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { getMarketData, refreshMarketData } from "@/services/client/market.client";
import type { MarketData } from "@/types/market";
import { PageLoading, PageError } from "@/components/ui/PageStates";
import MarketSummary from "@/components/market/MarketSummary";
import MarketTrendChart from "@/components/market/MarketTrendChart";
import RiskScoreCard from "@/components/market/RiskScoreCard";
import IndicatorGrid from "@/components/market/IndicatorGrid";
import MarketInterpretation from "@/components/market/MarketInterpretation";

export default function MarketPage() {
  const [data, setData]         = useState<MarketData | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [syncing, setSyncing]   = useState(false);
  const [syncMsg, setSyncMsg]   = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    getMarketData()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  async function handleRefresh() {
    setSyncing(true);
    setSyncMsg(null);
    try {
      await refreshMarketData();
      setSyncMsg({ ok: true, text: "Market data refreshed successfully." });
      load();
    } catch (e) {
      setSyncMsg({ ok: false, text: e instanceof Error ? e.message : "Refresh failed" });
    } finally {
      setSyncing(false);
    }
  }

  if (loading) return <PageLoading />;
  if (error)   return <PageError message={error} />;
  if (!data)   return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <MarketSummary data={data} />
        <div className="flex flex-col items-end gap-1 shrink-0 ml-4">
          <button
            onClick={handleRefresh}
            disabled={syncing}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded border disabled:opacity-50"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            <RefreshCw size={12} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Refreshing…" : "Refresh Market Data"}
          </button>
          {syncMsg && (
            <p className="text-xs" style={{ color: syncMsg.ok ? "var(--green)" : "var(--red)" }}>
              {syncMsg.text}
            </p>
          )}
        </div>
      </div>

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
