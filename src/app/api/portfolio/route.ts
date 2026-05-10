import { NextResponse } from "next/server";
import { getPortfolioSummary } from "@/services/portfolio.service";

export function GET() {
  try {
    const data = getPortfolioSummary();
    return NextResponse.json({ success: true, data, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}
