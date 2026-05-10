import { NextResponse } from "next/server";
import { getMarketIndicators } from "@/services/market.server";
import { getExternalMarketIndicators } from "@/services/market.service";

export async function GET() {
  const lastUpdated = new Date().toISOString();
  try {
    const external = await getExternalMarketIndicators();

    if (external.source === "external") {
      return NextResponse.json({
        success: true,
        data:    { indicators: external.indicators, source: external.source, lastUpdated: external.lastUpdated },
        error:   null,
      });
    }

    const supabaseIndicators = await getMarketIndicators();
    if (supabaseIndicators.length > 0) {
      return NextResponse.json({
        success: true,
        data:    { indicators: supabaseIndicators, source: "supabase", lastUpdated },
        error:   null,
      });
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
