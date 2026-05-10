"use client";

import { useState, useEffect, useCallback } from "react";
import { BookmarkCheck } from "lucide-react";
import { getDcaPlan, saveDcaAction } from "@/services/client/dca.client";
import type { DCASummaryData } from "@/types/dca";
import { PageLoading, PageError } from "@/components/ui/PageStates";
import DcaSummaryCard         from "@/components/dca/DcaSummaryCard";
import DcaScenarioCard        from "@/components/dca/DcaScenarioCard";
import DcaBuyZoneTable        from "@/components/dca/DcaBuyZoneTable";
import CashDeploymentCard     from "@/components/dca/CashDeploymentCard";
import DcaRiskPanel           from "@/components/dca/DcaRiskPanel";
import DcaRecommendationPanel from "@/components/dca/DcaRecommendationPanel";

export default function DcaPage() {
  const [data,    setData]    = useState<DCASummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const d = await getDcaPlan();
      setData(d);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load DCA plan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleRecordAction() {
    if (!data) return;
    const rec = data.recommendations.find((r) => r.action === "Buy Now" && r.amount);
    if (!rec || !rec.amount) return;

    const zone = data.buyZones.find((z) => z.ticker === rec.ticker);
    const price = zone?.currentPrice ?? 0;

    setSaving(true);
    setSaved(false);
    setSaveErr(null);
    try {
      await saveDcaAction({
        ticker:     rec.ticker,
        dcaLevel:   data.buyZones.find((z) => z.ticker === rec.ticker)?.activeLevel ?? "Normal Buy",
        amount:     rec.amount,
        price,
        marketDrop: data.marketDrop,
        status:     "Executed",
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setSaveErr(e instanceof Error ? e.message : "Failed to record action");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <PageLoading />;
  if (error)   return <PageError message={error} />;
  if (!data)   return null;

  const hasActionableRec = data.recommendations.some((r) => r.action === "Buy Now" && r.amount);

  return (
    <div className="flex flex-col gap-6">
      {/* Record DCA Action */}
      <div className="flex items-center justify-between">
        <div />
        <div className="flex items-center gap-3">
          {saveErr && (
            <p className="text-xs" style={{ color: "var(--red)" }}>{saveErr}</p>
          )}
          {hasActionableRec && (
            <button
              onClick={handleRecordAction}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-opacity disabled:opacity-60"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              {saving
                ? <span className="w-3.5 h-3.5 rounded-full border-2 animate-spin" style={{ borderColor: "#fff", borderTopColor: "transparent" }} />
                : <BookmarkCheck size={14} />}
              {saved ? "Recorded!" : saving ? "Saving…" : "Record DCA Action"}
            </button>
          )}
        </div>
      </div>

      <DcaSummaryCard data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DcaScenarioCard    data={data} />
        <CashDeploymentCard data={data} />
      </div>

      <DcaBuyZoneTable data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DcaRiskPanel           data={data} />
        <DcaRecommendationPanel data={data} />
      </div>
    </div>
  );
}
