import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session";
import { refreshMarketData } from "@/services/market.service";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, data: null, error: "Unauthenticated" }, { status: 401 });
  }

  try {
    const data = await refreshMarketData();
    return NextResponse.json({ success: true, data, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Refresh failed";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}
