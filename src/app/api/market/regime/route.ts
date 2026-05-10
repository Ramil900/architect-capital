import { NextResponse } from "next/server";
import { getMarketData } from "@/services/market.service";

export function GET() {
  try {
    const { regime, vix, riskScore } = getMarketData();
    return NextResponse.json({ success: true, data: { regime, vix, riskScore }, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}
