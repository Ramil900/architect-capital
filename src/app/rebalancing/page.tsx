"use client";

import { useState, useEffect } from "react";
import { getRebalancePlan } from "@/services/client/rebalance.client";
import type { RebalanceSummaryData } from "@/types/rebalancing";
import { PageLoading, PageError } from "@/components/ui/PageStates";
import RebalanceSummaryCard from "@/components/rebalancing/RebalanceSummaryCard";
import CurrentAllocationChart from "@/components/rebalancing/CurrentAllocationChart";
import TargetAllocationChart from "@/components/rebalancing/TargetAllocationChart";
import RebalanceTable from "@/components/rebalancing/RebalanceTable";
import RebalanceActionCard from "@/components/rebalancing/RebalanceActionCard";
import RebalanceRiskNotes from "@/components/rebalancing/RebalanceRiskNotes";

export default function RebalancingPage() {
  const [data, setData]       = useState<RebalanceSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    getRebalancePlan()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;
  if (error)   return <PageError message={error} />;
  if (!data)   return null;

  return (
    <div className="flex flex-col gap-6">
      <RebalanceSummaryCard data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CurrentAllocationChart data={data} />
        <TargetAllocationChart data={data} />
      </div>

      <RebalanceTable data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RebalanceActionCard data={data} />
        <RebalanceRiskNotes />
      </div>
    </div>
  );
}
