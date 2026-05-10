import { getReportSummary } from "@/services/report.service";
import ReportSummaryCard from "@/components/reports/ReportSummaryCard";
import ReportTypeGrid from "@/components/reports/ReportTypeGrid";
import AIReportSummary from "@/components/reports/AIReportSummary";
import ReportHistoryTable from "@/components/reports/ReportHistoryTable";
import ExportCenter from "@/components/reports/ExportCenter";

export default function ReportsPage() {
  const reportsData = getReportSummary();

  return (
    <div className="flex flex-col gap-6">
      <ReportSummaryCard data={reportsData} />
      <ReportTypeGrid data={reportsData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AIReportSummary data={reportsData} />
        </div>
        <ExportCenter />
      </div>

      <ReportHistoryTable data={reportsData} />
    </div>
  );
}
