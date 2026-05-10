"use client";

import { useState, useEffect } from "react";
import { getReports } from "@/services/client/reports.client";
import type { ReportSummaryData } from "@/types/reports";
import { PageLoading, PageError } from "@/components/ui/PageStates";
import ReportSummaryCard from "@/components/reports/ReportSummaryCard";
import ReportTypeGrid from "@/components/reports/ReportTypeGrid";
import AIReportSummary from "@/components/reports/AIReportSummary";
import ReportHistoryTable from "@/components/reports/ReportHistoryTable";
import ExportCenter from "@/components/reports/ExportCenter";

export default function ReportsPage() {
  const [data, setData]       = useState<ReportSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    getReports()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;
  if (error)   return <PageError message={error} />;
  if (!data)   return null;

  return (
    <div className="flex flex-col gap-6">
      <ReportSummaryCard data={data} />
      <ReportTypeGrid data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AIReportSummary data={data} />
        </div>
        <ExportCenter />
      </div>

      <ReportHistoryTable data={data} />
    </div>
  );
}
