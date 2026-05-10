"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { getReports, createReport, deleteReport } from "@/services/client/reports.client";
import type { ReportSummaryData } from "@/types/reports";
import { PageLoading, PageError } from "@/components/ui/PageStates";
import ReportSummaryCard   from "@/components/reports/ReportSummaryCard";
import ReportTypeGrid      from "@/components/reports/ReportTypeGrid";
import AIReportSummary     from "@/components/reports/AIReportSummary";
import ReportHistoryTable  from "@/components/reports/ReportHistoryTable";
import ExportCenter        from "@/components/reports/ExportCenter";

export default function ReportsPage() {
  const [data,       setData]       = useState<ReportSummaryData | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionErr,  setActionErr]  = useState<string | null>(null);

  const load = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const d = await getReports();
      setData(d);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  async function handleGenerate() {
    setGenerating(true);
    setActionErr(null);
    try {
      await createReport({
        type:        "Daily",
        title:       "Daily Portfolio Report",
        description: "End-of-day summary: positions, P/L, AI signals, and market regime.",
        status:      "Generated",
      });
      await load(false);
    } catch (e) {
      setActionErr(e instanceof Error ? e.message : "Failed to generate report");
    } finally {
      setGenerating(false);
    }
  }

  async function handleDelete(reportId: string) {
    setDeletingId(reportId);
    setActionErr(null);
    try {
      await deleteReport(reportId);
      await load(false);
    } catch (e) {
      setActionErr(e instanceof Error ? e.message : "Failed to delete report");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <PageLoading />;
  if (error)   return <PageError message={error} />;
  if (!data)   return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div />
        <div className="flex items-center gap-3">
          {actionErr && (
            <p className="text-xs" style={{ color: "var(--red)" }}>{actionErr}</p>
          )}
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-opacity disabled:opacity-60"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            {generating
              ? <span className="w-3.5 h-3.5 rounded-full border-2 animate-spin" style={{ borderColor: "#fff", borderTopColor: "transparent" }} />
              : <Plus size={14} />}
            {generating ? "Generating…" : "Generate Demo Report"}
          </button>
        </div>
      </div>

      <ReportSummaryCard data={data} />
      <ReportTypeGrid    data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AIReportSummary data={data} />
        </div>
        <ExportCenter />
      </div>

      <ReportHistoryTable data={data} onDelete={handleDelete} deletingId={deletingId} />
    </div>
  );
}
