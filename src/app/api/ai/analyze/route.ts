import { NextResponse } from "next/server";
import { getDemoAIReport } from "@/services/ai.service";

export function GET() {
  try {
    const data = getDemoAIReport();
    return NextResponse.json({ success: true, data, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}
