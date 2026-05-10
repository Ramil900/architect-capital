import { NextResponse } from "next/server";
import { getMarketIndicators } from "@/services/market.service";

export function GET() {
  try {
    const data = getMarketIndicators();
    return NextResponse.json({ success: true, data, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}
