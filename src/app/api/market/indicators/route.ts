import { NextResponse } from "next/server";
import { getMarketIndicators } from "@/services/market.server";
import { getExternalMarketIndicators } from "@/services/market.service";
import { getCache, setCache } from "@/lib/api-cache";

const CACHE_KEY = "market:indicators";
const TTL_MS    = 10 * 60 * 1000;

export async function GET() {
  const cached = getCache<object>(CACHE_KEY);
  if (cached) {
    return NextResponse.json({ success: true, data: cached, error: null });
  }

  const lastUpdated = new Date().toISOString();
  try {
    const external = await getExternalMarketIndicators();

    if (external.source === "external") {
      const data = { indicators: external.indicators, source: external.source, lastUpdated: external.lastUpdated };
      setCache(CACHE_KEY, data, TTL_MS);
      return NextResponse.json({ success: true, data, error: null });
    }

    const supabaseIndicators = await getMarketIndicators();
    if (supabaseIndicators.length > 0) {
      const data = { indicators: supabaseIndicators, source: "supabase", lastUpdated };
      setCache(CACHE_KEY, data, TTL_MS);
      return NextResponse.json({ success: true, data, error: null });
    }

    return NextResponse.json({
      success: true,
      data:    { indicators: external.indicators, source: "demo", lastUpdated },
      error:   null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}
