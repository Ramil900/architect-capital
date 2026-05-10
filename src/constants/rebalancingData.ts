import type { RebalanceItem, RebalanceSummaryData } from "@/types/rebalancing";
import { ASSETS } from "@/constants/assets";
import { TARGET_ALLOCATION } from "@/constants/target-allocation";
import {
  calculateTargetValue,
  calculateDifferenceValue,
  calculateDifferencePercent,
  getRebalanceAction,
  getRebalancePriority,
  generateRebalancePlan,
} from "@/utils/rebalance-calculations";

const TOTAL_VALUE = 164713;

const CURRENT_VALUES: Record<string, number> = {
  "VOO":   25600,
  "QQQ":   20475,
  "SOXX":  16560,
  "SMH":   16320,
  "GLD":   17550,
  "SLV":   16240,
  "BTC":   12543,
  "ETH":    9000,
  "BRK.B": 22550,
  "TSLA":   7875,
};

const items: RebalanceItem[] = ASSETS.map((a) => {
  const currentValue   = CURRENT_VALUES[a.ticker];
  const targetPercent  = TARGET_ALLOCATION[a.ticker];
  const currentPercent = (currentValue / TOTAL_VALUE) * 100;
  const targetValue    = calculateTargetValue(TOTAL_VALUE, targetPercent);
  const diffPercent    = calculateDifferencePercent(targetPercent, currentPercent);
  const diffValue      = calculateDifferenceValue(targetValue, currentValue);
  return {
    ticker:  a.ticker,
    name:    a.name,
    category:a.category,
    color:   a.color,
    currentValue,
    currentPercent,
    targetPercent,
    targetValue,
    diffPercent,
    diffValue,
    action:   getRebalanceAction(diffPercent),
    priority: getRebalancePriority(diffPercent),
  };
});

const { buyNeeded, reduceNeeded, actionsNeeded } = generateRebalancePlan(items);

export const rebalancingData: RebalanceSummaryData = {
  totalValue:        TOTAL_VALUE,
  balanceScore:      71,
  actionsNeeded,
  totalBuyNeeded:    buyNeeded,
  totalReduceNeeded: reduceNeeded,
  items,
};
