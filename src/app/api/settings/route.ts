import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session";
import { getUserSettings, upsertUserSettings } from "@/services/settings.service";
import type { AppSettings } from "@/types/settings";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, data: null, error: "Unauthenticated" }, { status: 401 });
  }

  try {
    const data = await getUserSettings(session.user.id);
    return NextResponse.json({ success: true, data, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load settings";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, data: null, error: "Unauthenticated" }, { status: 401 });
  }

  try {
    const settings: AppSettings = await request.json();
    const data = await upsertUserSettings(session.user.id, settings);
    return NextResponse.json({ success: true, data, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save settings";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}
