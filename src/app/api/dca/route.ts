import { NextResponse } from "next/server";
import { getDcaPlan } from "@/services/dca.service";

export function GET() {
  try {
    const data = getDcaPlan();
    return NextResponse.json({ success: true, data, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}
