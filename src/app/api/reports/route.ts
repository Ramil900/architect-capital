import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session";
import { getReportSummary } from "@/services/report.service";
import { getUserReports, createReport, deleteReport, type CreateReportInput } from "@/services/report.server";

export async function GET() {
  const session = await getSession();
  try {
    const summary = getReportSummary();

    if (!session) {
      return NextResponse.json({ success: true, data: summary, error: null });
    }

    const reports = await getUserReports(session.user.id);
    return NextResponse.json({
      success: true,
      data:    { ...summary, reports, totalReports: reports.length },
      error:   null,
    });
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
    const body: CreateReportInput = await request.json();
    const report = await createReport(session.user.id, body);
    return NextResponse.json({ success: true, data: report, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create report";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, data: null, error: "Unauthenticated" }, { status: 401 });
  }

  try {
    const { reportId } = await request.json();
    if (!reportId) {
      return NextResponse.json({ success: false, data: null, error: "reportId required" }, { status: 400 });
    }
    await deleteReport(session.user.id, reportId);
    return NextResponse.json({ success: true, data: null, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete report";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}
