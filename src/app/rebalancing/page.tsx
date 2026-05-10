"use client";

import { useState, useEffect, useCallback } from "react";
import { BookmarkCheck } from "lucide-react";
import { getRebalancePlan, saveRebalanceAction } from "@/services/client/rebalance.client";
import type { RebalanceSummaryData } from "@/types/rebalancing";
import { PageLoading, PageError } from "@/components/ui/PageStates";
import RebalanceSummaryCard   from "@/components/rebalancing/RebalanceSummaryCard";
import CurrentAllocationChart from "@/components/rebalancing/CurrentAllocationChart";
import TargetAllocationChart  from "@/components/rebalancing/TargetAllocationChart";
import RebalanceTable         from "@/components/rebalancing/RebalanceTable";
import RebalanceActionCard    from "@/components/rebalancing/RebalanceActionCard";
import RebalanceRiskNotes     from "@/components/rebalancing/RebalanceRiskNotes";

export default function RebalancingPage() {
  const [data,    setData]    = useState<RebalanceSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);

  const load = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const d = await getRebalancePlan();
      setData(d);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load rebalance plan");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  async function handleSaveAction() {
    if (!data) return;
    const topAction = data.items.find(
      (item) => item.priority === "High" && (item.action === "Buy" || item.action === "Sell" || item.action === "Reduce"),
    );
    if (!topAction) return;

    setSaving(true);
    setSaved(false);
    setSaveErr(null);
    try {
      await saveRebalanceAction({
        ticker:      topAction.ticker,
        action:      topAction.action,
        diffPercent: topAction.diffPercent,
        diffValue:   topAction.diffValue,
        priority:    topAction.priority,
        executed:    true,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      load(false);
    } catch (e) {
      setSaveErr(e instanceof Error ? e.message : "Failed to record action");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <PageLoading />;
  if (error)   return <PageError message={error} />;
  if (!data)   return null;

  const hasActionableItem = data.items.some(
    (item) => item.priority === "High" && (item.action === "Buy" || item.action === "Sell" || item.action === "Reduce"),
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Save Rebalance Action */}
      <div className="flex items-center justify-between">
        <div />
        <div className="flex items-center gap-3">
          {saveErr && (
            <p className="text-xs" style={{ color: "var(--red)" }}>{saveErr}</p>
          )}
          {hasActionableItem && (
            <button
              onClick={handleSaveAction}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-opacity disabled:opacity-60"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              {saving
                ? <span className="w-3.5 h-3.5 rounded-full border-2 animate-spin" style={{ borderColor: "#fff", borderTopColor: "transparent" }} />
                : <BookmarkCheck size={14} />}
              {saved ? "Recorded!" : saving ? "Saving…" : "Save Rebalance Action"}
            </button>
          )}
        </div>
      </div>

      <RebalanceSummaryCard data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CurrentAllocationChart data={data} />
        <TargetAllocationChart  data={data} />
      </div>

      <RebalanceTable data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RebalanceActionCard data={data} />
        <RebalanceRiskNotes />
      </div>
    </div>
  );
}
