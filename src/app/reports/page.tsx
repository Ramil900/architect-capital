"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { getReports, createReport, deleteReport } from "@/services/client/reports.client";
import { getPortfolio } from "@/services/client/portfolio.client";
import { getMarketRegime } from "@/services/client/market.client";
import { getAIAnalysis } from "@/services/client/ai.client";
import { getDcaPlan } from "@/services/client/dca.client";
import { getRebalancePlan } from "@/services/client/rebalance.client";
import { portfolioData as demoPortfolio } from "@/constants/demo-portfolio";
import { marketData as demoMarket } from "@/constants/demo-market";
import { aiAnalysis as demoAI } from "@/constants/demo-ai";
import { dcaData as demoDca } from "@/constants/dcaData";
import { rebalancingData as demoRebalance } from "@/constants/rebalancingData";
import { PageLoading, PageError } from "@/components/ui/PageStates";
import ReportSummaryCard  from "@/components/reports/ReportSummaryCard";
import ReportTypeGrid     from "@/components/reports/ReportTypeGrid";
import AIReportSummary    from "@/components/reports/AIReportSummary";
import ReportHistoryTable from "@/components/reports/ReportHistoryTable";
import ExportCenter       from "@/components/reports/ExportCenter";
import type { ReportSummaryData } from "@/types/reports";
import type { PortfolioSummaryData } from "@/types/portfolio";
import type { MarketRegime } from "@/types/market";
import type { AIAnalysisData } from "@/types/ai";
import type { DCASummaryData } from "@/types/dca";
import type { RebalanceSummaryData } from "@/types/rebalancing";

interface RegimeData { regime: MarketRegime; vix: number; riskScore: number }

export default function ReportsPage() {
  const [data,       setData]       = useState<ReportSummaryData | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionErr,  setActionErr]  = useState<string | null>(null);

  const [portfolio,  setPortfolio]  = useState<PortfolioSummaryData>(demoPortfolio);
  const [regime,     setRegime]     = useState<RegimeData>({ regime: demoMarket.regime, vix: demoMarket.vix, riskScore: demoMarket.riskScore });
  const [ai,         setAI]         = useState<AIAnalysisData>(demoAI);
  const [dca,        setDca]        = useState<DCASummaryData>(demoDca);
  const [rebalance,  setRebalance]  = useState<RebalanceSummaryData>(demoRebalance);

  const load = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const [reportsRes, portfolioRes, regimeRes, aiRes, dcaRes, rebalanceRes] = await Promise.allSettled([
        getReports(),
        getPortfolio(),
        getMarketRegime(),
        getAIAnalysis(),
        getDcaPlan(),
        getRebalancePlan(),
      ]);

      if (reportsRes.status === "fulfilled") { setData(reportsRes.value); setError(null); }
      else setError(reportsRes.reason instanceof Error ? reportsRes.reason.message : "Failed to load reports");

      if (portfolioRes.status  === "fulfilled") setPortfolio(portfolioRes.value);
      if (regimeRes.status     === "fulfilled") setRegime(regimeRes.value);
      if (aiRes.status         === "fulfilled") setAI(aiRes.value);
      if (dcaRes.status        === "fulfilled") setDca(dcaRes.value);
      if (rebalanceRes.status  === "fulfilled") setRebalance(rebalanceRes.value);
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
      const highPriority = rebalance.items.filter((i) => i.priority === "High").length;
      const description = [
        `Portfolio $${Math.round(portfolio.totalValue).toLocaleString()} | P/L ${portfolio.totalPLPercent >= 0 ? "+" : ""}${portfolio.totalPLPercent.toFixed(2)}%`,
        `Market: ${regime.regime} | VIX ${regime.vix} | Risk ${regime.riskScore}/100`,
        `AI: ${ai.portfolioRisk} risk | DCA ${ai.dcaStatus}`,
        `Rebalance: ${highPriority} high-priority action${highPriority !== 1 ? "s" : ""}`,
        `DCA: ${dca.dcaStatus} | Drop ${dca.marketDrop}%`,
      ].join(" · ");

      await createReport({
        type:        "Daily",
        title:       `Daily Portfolio Report — ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
        description,
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
