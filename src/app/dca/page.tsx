import { dcaData } from "@/constants/dcaData";
import DcaSummaryCard from "@/components/dca/DcaSummaryCard";
import DcaScenarioCard from "@/components/dca/DcaScenarioCard";
import DcaBuyZoneTable from "@/components/dca/DcaBuyZoneTable";
import CashDeploymentCard from "@/components/dca/CashDeploymentCard";
import DcaRiskPanel from "@/components/dca/DcaRiskPanel";
import DcaRecommendationPanel from "@/components/dca/DcaRecommendationPanel";

export default function DcaPage() {
  return (
    <div className="flex flex-col gap-6">
      <DcaSummaryCard data={dcaData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DcaScenarioCard data={dcaData} />
        <CashDeploymentCard data={dcaData} />
      </div>

      <DcaBuyZoneTable data={dcaData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DcaRiskPanel data={dcaData} />
        <DcaRecommendationPanel data={dcaData} />
      </div>
    </div>
  );
}
