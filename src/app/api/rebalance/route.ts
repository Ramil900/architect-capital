import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session";
import { getRebalanceSummary } from "@/services/rebalance.service";
import { saveRebalanceAction, getRebalanceHistory, type RebalanceActionInput } from "@/services/rebalance.server";

export async function GET() {
  const session = await getSession();
  try {
    const plan = getRebalanceSummary();

    if (!session) {
      return NextResponse.json({ success: true, data: { ...plan, history: [] }, error: null });
    }

    const history = await getRebalanceHistory(session.user.id);
    return NextResponse.json({ success: true, data: { ...plan, history }, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, data: null, error: "Unauthenticated" }, { status: 401 });
  }

  try {
    const body: RebalanceActionInput = await request.json();
    await saveRebalanceAction(session.user.id, body);
    return NextResponse.json({ success: true, data: null, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save rebalance action";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}
