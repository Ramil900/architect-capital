import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session";
import { getDemoAIReport } from "@/services/ai.service";
import { generateAIAnalysis } from "@/services/ai.server";

export function GET() {
  try {
    const data = getDemoAIReport();
    return NextResponse.json({ success: true, data, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, data: null, error: "Unauthenticated" }, { status: 401 });
  }

  try {
    const data = await generateAIAnalysis(session.user.id);
    return NextResponse.json({ success: true, data, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI analysis failed";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}
