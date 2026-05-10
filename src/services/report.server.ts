import { createServerClient } from "@/lib/supabase/server";
import type { ReportType, ReportStatus, ReportItem } from "@/types/reports";
import { reportsData } from "@/constants/reportsData";

export interface CreateReportInput {
  type:        ReportType;
  title:       string;
  description: string;
  status?:     ReportStatus;
}

interface DbRow {
  id:           string;
  type:         string;
  title:        string;
  description:  string;
  status:       string;
  generated_at: string;
  size:         string | null;
}

function rowToItem(row: DbRow): ReportItem {
  return {
    id:          row.id,
    type:        row.type        as ReportType,
    title:       row.title,
    description: row.description,
    status:      row.status      as ReportStatus,
    generatedAt: new Date(row.generated_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
    size:        row.size ?? "—",
  };
}

export async function getUserReports(userId: string): Promise<ReportItem[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = await createServerClient() as any;
    const { data, error } = await supabase
      .from("ai_reports")
      .select("id, type, title, description, status, generated_at, size")
      .eq("user_id", userId)
      .order("generated_at", { ascending: false })
      .limit(50);

    if (error || !data || data.length === 0) return reportsData.reports;
    return (data as DbRow[]).map(rowToItem);
  } catch {
    return reportsData.reports;
  }
}

export async function createReport(userId: string, input: CreateReportInput): Promise<ReportItem> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = await createServerClient() as any;
  const { data, error } = await supabase
    .from("ai_reports")
    .insert({
      user_id:      userId,
      type:         input.type,
      title:        input.title,
      description:  input.description,
      status:       input.status ?? "Generated",
      generated_at: new Date().toISOString(),
      size:         null,
    })
    .select("id, type, title, description, status, generated_at, size")
    .single();

  if (error) throw new Error(error.message);
  return rowToItem(data as DbRow);
}

export async function deleteReport(userId: string, reportId: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = await createServerClient() as any;
  const { error } = await supabase
    .from("ai_reports")
    .delete()
    .eq("id", reportId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
}
