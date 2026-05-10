import { NextRequest, NextResponse } from "next/server";
import { refreshMarketData } from "@/services/market.service";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const bearerSecret = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const secret = req.nextUrl.searchParams.get("secret")
    ?? req.headers.get("x-cron-secret")
    ?? bearerSecret;

  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ success: false, data: null, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await refreshMarketData();
    return NextResponse.json({
      success: true,
      data: {
        refreshed:   true,
        source:      result.source,
        lastUpdated: result.syncedAt,
      },
      error: null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Refresh failed";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}
