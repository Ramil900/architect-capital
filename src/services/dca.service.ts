import { dcaData } from "@/constants/dcaData";
import type { DCASummaryData, DCAStatus } from "@/types/dca";
import { getDcaStatus, getDcaCashUsage, getActiveDcaZone } from "@/utils/dca-calculations";

export function getDcaPlan(): DCASummaryData {
  return dcaData;
}

export function getDcaStatusFromDrop(marketDrop: number): DCAStatus {
  return getDcaStatus(marketDrop);
}

export function getDcaCashUsagePercent(): number {
  return getDcaCashUsage(dcaData.cashUsed, dcaData.cashReserved);
}

export function getActiveDcaLevel() {
  return getActiveDcaZone(dcaData.marketDrop, dcaData.scenarios);
}
