import { NextResponse } from "next/server";
import { getMarketRegime } from "@/services/market.server";
import { getCache, setCache } from "@/lib/api-cache";

const CACHE_KEY = "market:regime";
const TTL_MS    = 5 * 60 * 1000;

export async function GET() {
  const cached = getCache<object>(CACHE_KEY);
  if (cached) {
    return NextResponse.json({ success: true, data: cached, error: null });
  }

  try {
    const data = await getMarketRegime();
    setCache(CACHE_KEY, data, TTL_MS);
    return NextResponse.json({ success: true, data, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}
