export const DCA_ZONE_DROPS = {
  smallBuy:      -5,
  normalBuy:     -10,
  strongBuy:     -20,
  aggressiveBuy: -35,
  crisisBuy:     -50,
} as const;

export type DCAZoneKey = keyof typeof DCA_ZONE_DROPS;
