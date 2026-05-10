import { NextResponse } from "next/server";
import { getMarketPrices } from "@/services/market.server";
import { getExternalMarketPrices } from "@/services/market.service";
import { getCache, setCache } from "@/lib/api-cache";

const CACHE_KEY = "market:prices";
const TTL_MS    = 2 * 60 * 1000;

export async function GET() {
  const cached = getCache<object>(CACHE_KEY);
  if (cached) {
    return NextResponse.json({ success: true, data: cached, error: null });
  }

  const lastUpdated = new Date().toISOString();
  try {
    const external = await getExternalMarketPrices();

    if (external.source === "external" && Object.keys(external.prices).length > 0) {
      const data = {
        prices:      external.prices,
        priceData:   external.priceData,
        source:      external.source,
        lastUpdated: external.lastUpdated,
      };
      setCache(CACHE_KEY, data, TTL_MS);
      return NextResponse.json({ success: true, data, error: null });
    }

    const supabasePrices = await getMarketPrices();
    if (Object.keys(supabasePrices).length > 0) {
      const data = { prices: supabasePrices, priceData: {}, source: "supabase", lastUpdated };
      setCache(CACHE_KEY, data, TTL_MS);
      return NextResponse.json({ success: true, data, error: null });
    }

    return NextResponse.json({
      success: true,
      data: { prices: {}, priceData: {}, source: "demo", lastUpdated },
      error: null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}
