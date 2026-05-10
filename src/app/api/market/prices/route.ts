import { NextResponse } from "next/server";
import { getMarketPrices } from "@/services/market.server";
import { getExternalMarketPrices } from "@/services/market.service";

export async function GET() {
  const lastUpdated = new Date().toISOString();
  try {
    const external = await getExternalMarketPrices();

    if (external.source === "external" && Object.keys(external.prices).length > 0) {
      return NextResponse.json({
        success: true,
        data:    { prices: external.prices, source: external.source, lastUpdated: external.lastUpdated },
        error:   null,
      });
    }

    const supabasePrices = await getMarketPrices();
    if (Object.keys(supabasePrices).length > 0) {
      return NextResponse.json({
        success: true,
        data:    { prices: supabasePrices, source: "supabase", lastUpdated },
        error:   null,
      });
    }

    return NextResponse.json({
      success: true,
      data:    { prices: {}, source: "demo", lastUpdated },
      error:   null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}
