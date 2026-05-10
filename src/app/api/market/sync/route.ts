import { NextResponse } from "next/server";
import { syncAllMarketData } from "@/services/market-sync.service";

export async function POST(request: Request) {
  const secret = process.env.MARKET_SYNC_SECRET;

  if (secret) {
    const authHeader = request.headers.get("x-sync-secret");
    if (authHeader !== secret) {
      return NextResponse.json({ success: false, data: null, error: "Forbidden" }, { status: 403 });
    }
  } else if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { success: false, data: null, error: "MARKET_SYNC_SECRET not configured" },
      { status: 403 },
    );
  }

  try {
    const result = await syncAllMarketData();
    return NextResponse.json({ success: true, data: result, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}
