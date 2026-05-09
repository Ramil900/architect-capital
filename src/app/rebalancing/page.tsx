import { rebalancingData } from "@/constants/rebalancingData";
import RebalanceSummaryCard from "@/components/rebalancing/RebalanceSummaryCard";
import CurrentAllocationChart from "@/components/rebalancing/CurrentAllocationChart";
import TargetAllocationChart from "@/components/rebalancing/TargetAllocationChart";
import RebalanceTable from "@/components/rebalancing/RebalanceTable";
import RebalanceActionCard from "@/components/rebalancing/RebalanceActionCard";
import RebalanceRiskNotes from "@/components/rebalancing/RebalanceRiskNotes";

export default function RebalancingPage() {
  return (
    <div className="flex flex-col gap-6">
      <RebalanceSummaryCard data={rebalancingData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CurrentAllocationChart data={rebalancingData} />
        <TargetAllocationChart data={rebalancingData} />
      </div>

      <RebalanceTable data={rebalancingData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RebalanceActionCard data={rebalancingData} />
        <RebalanceRiskNotes />
      </div>
    </div>
  );
}
