"use client";

import { useState, useEffect } from "react";
import { getDcaPlan } from "@/services/client/dca.client";
import type { DCASummaryData } from "@/types/dca";
import { PageLoading, PageError } from "@/components/ui/PageStates";
import DcaSummaryCard from "@/components/dca/DcaSummaryCard";
import DcaScenarioCard from "@/components/dca/DcaScenarioCard";
import DcaBuyZoneTable from "@/components/dca/DcaBuyZoneTable";
import CashDeploymentCard from "@/components/dca/CashDeploymentCard";
import DcaRiskPanel from "@/components/dca/DcaRiskPanel";
import DcaRecommendationPanel from "@/components/dca/DcaRecommendationPanel";

export default function DcaPage() {
  const [data, setData]       = useState<DCASummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    getDcaPlan()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;
  if (error)   return <PageError message={error} />;
  if (!data)   return null;

  return (
    <div className="flex flex-col gap-6">
      <DcaSummaryCard data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DcaScenarioCard data={data} />
        <CashDeploymentCard data={data} />
      </div>

      <DcaBuyZoneTable data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DcaRiskPanel data={data} />
        <DcaRecommendationPanel data={data} />
      </div>
    </div>
  );
}
