import { NextResponse } from "next/server";
import { getReportSummary } from "@/services/report.service";

export function GET() {
  try {
    const data = getReportSummary();
    return NextResponse.json({ success: true, data, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}
