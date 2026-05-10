import { NextResponse } from "next/server";
import { exportReport } from "@/services/export.service";
import type { ExportFormat } from "@/types/reports";

const VALID_FORMATS: ExportFormat[] = ["PDF", "CSV", "Excel"];

export async function POST(request: Request) {
  try {
    const { reportId, format } = (await request.json()) as {
      reportId?: string;
      format?:   ExportFormat;
    };

    if (!reportId || !format || !VALID_FORMATS.includes(format)) {
      return NextResponse.json(
        { success: false, data: null, error: "reportId and valid format required" },
        { status: 400 },
      );
    }

    const result = await exportReport(reportId, format);

    const body = new Uint8Array(result.buffer);
    return new Response(body, {
      headers: {
        "Content-Type":        result.contentType,
        "Content-Disposition": `attachment; filename="${result.filename}"`,
        "Content-Length":      String(body.byteLength),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Export failed";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}
