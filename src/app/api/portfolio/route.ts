import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session";
import {
  getUserPortfolioPositions,
  addPortfolioPosition,
  updatePortfolioPosition,
  deletePortfolioPosition,
  type AddPositionInput,
  type UpdatePositionInput,
} from "@/services/portfolio.server";

function unauth() {
  return NextResponse.json({ success: false, data: null, error: "Unauthenticated" }, { status: 401 });
}

export async function GET() {
  const session = await getSession();
  if (!session) return unauth();
  try {
    const data = await getUserPortfolioPositions(session.user.id);
    return NextResponse.json({ success: true, data, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load portfolio";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return unauth();
  try {
    const body: AddPositionInput = await request.json();
    await addPortfolioPosition(session.user.id, body);
    return NextResponse.json({ success: true, data: null, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to add position";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return unauth();
  try {
    const { positionId, ...input }: { positionId: string } & UpdatePositionInput = await request.json();
    await updatePortfolioPosition(session.user.id, positionId, input);
    return NextResponse.json({ success: true, data: null, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update position";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return unauth();
  try {
    const { positionId }: { positionId: string } = await request.json();
    await deletePortfolioPosition(session.user.id, positionId);
    return NextResponse.json({ success: true, data: null, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete position";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}
