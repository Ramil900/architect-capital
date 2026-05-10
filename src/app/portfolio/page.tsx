"use client";

import { useState, useEffect } from "react";
import { getPortfolio } from "@/services/client/portfolio.client";
import type { PortfolioSummaryData } from "@/types/portfolio";
import { PageLoading, PageError } from "@/components/ui/PageStates";
import PortfolioSummary from "@/components/portfolio/PortfolioSummary";
import PortfolioTable from "@/components/portfolio/PortfolioTable";
import AllocationStatus from "@/components/portfolio/AllocationStatus";
import PortfolioAnalyticsCard from "@/components/portfolio/PortfolioAnalyticsCard";

export default function PortfolioPage() {
  const [data, setData]       = useState<PortfolioSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    getPortfolio()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;
  if (error)   return <PageError message={error} />;
  if (!data)   return null;

  return (
    <div className="flex flex-col gap-6">
      <PortfolioSummary data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AllocationStatus positions={data.positions} />
        </div>
        <PortfolioAnalyticsCard data={data} />
      </div>

      <PortfolioTable data={data} />
    </div>
  );
}
