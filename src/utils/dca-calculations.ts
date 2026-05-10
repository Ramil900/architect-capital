import type { DCAStatus, DCALevel, DCAScenario } from "@/types/dca";

export function getDcaStatus(marketDrop: number): DCAStatus {
  if (marketDrop >= 0)   return "No Action";
  if (marketDrop >= -10) return "Partial DCA";
  if (marketDrop >= -20) return "Full DCA";
  return "Crisis DCA";
}

export function getDcaCashUsage(cashUsed: number, cashReserved: number): number {
  return cashReserved === 0 ? 0 : Math.round((cashUsed / cashReserved) * 100);
}

export function getActiveDcaZone(marketDrop: number, scenarios: DCAScenario[]): DCALevel | null {
  const triggered = scenarios.filter((s) => marketDrop <= s.drop);
  if (!triggered.length) return null;
  return triggered[triggered.length - 1].level;
}
