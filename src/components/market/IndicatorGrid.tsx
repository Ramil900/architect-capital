import type { MarketIndicator } from "@/types/market";
import MarketIndicatorCard from "./MarketIndicatorCard";

interface Props {
  indicators: MarketIndicator[];
}

export default function IndicatorGrid({ indicators }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {indicators.map((ind) => (
        <MarketIndicatorCard key={ind.id} indicator={ind} />
      ))}
    </div>
  );
}
