import { NextResponse } from "next/server";

export function successResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data, error: null }, { status });
}

export function errorResponse(message: string, status = 500): NextResponse {
  return NextResponse.json({ success: false, data: null, error: message }, { status });
}
