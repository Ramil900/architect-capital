import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session";
import { getDcaPlan } from "@/services/dca.service";
import { saveDcaAction, getDcaHistory, type DcaActionInput } from "@/services/dca.server";

export async function GET() {
  const session = await getSession();

  try {
    const plan = getDcaPlan();

    if (!session) {
      return NextResponse.json({ success: true, data: { ...plan, history: [] }, error: null });
    }

    const history = await getDcaHistory(session.user.id);
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
    const body: DcaActionInput = await request.json();
    await saveDcaAction(session.user.id, body);
    return NextResponse.json({ success: true, data: null, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save DCA action";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}
