import { createServerClient } from "@/lib/supabase/server";
import type { RebalanceAction, RebalancePriority } from "@/types/rebalancing";

export interface RebalanceActionInput {
  ticker:      string;
  action:      RebalanceAction;
  diffPercent: number;
  diffValue:   number;
  priority:    RebalancePriority;
  executed?:   boolean;
}

export interface RebalanceHistoryItem {
  id:          string;
  ticker:      string;
  action:      RebalanceAction;
  diffPercent: number;
  diffValue:   number;
  priority:    RebalancePriority;
  executed:    boolean;
  executedAt:  string | null;
  createdAt:   string;
}

interface DbRow {
  id:           string;
  ticker:       string;
  action:       string;
  diff_percent: string | number;
  diff_value:   string | number;
  priority:     string;
  executed:     boolean;
  executed_at:  string | null;
  created_at:   string;
}

function rowToItem(row: DbRow): RebalanceHistoryItem {
  return {
    id:          row.id,
    ticker:      row.ticker,
    action:      row.action as RebalanceAction,
    diffPercent: Number(row.diff_percent),
    diffValue:   Number(row.diff_value),
    priority:    row.priority as RebalancePriority,
    executed:    row.executed,
    executedAt:  row.executed_at,
    createdAt:   row.created_at,
  };
}

export async function getRebalanceHistory(userId: string): Promise<RebalanceHistoryItem[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = await createServerClient() as any;
    const { data, error } = await supabase
      .from("rebalance_history")
      .select("id, ticker, action, diff_percent, diff_value, priority, executed, executed_at, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error || !data) return [];
    return (data as DbRow[]).map(rowToItem);
  } catch {
    return [];
  }
}

export async function saveRebalanceAction(userId: string, input: RebalanceActionInput): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = await createServerClient() as any;
  const { error } = await supabase
    .from("rebalance_history")
    .insert({
      user_id:      userId,
      ticker:       input.ticker,
      action:       input.action,
      diff_percent: input.diffPercent,
      diff_value:   input.diffValue,
      priority:     input.priority,
      executed:     input.executed ?? false,
      executed_at:  input.executed ? new Date().toISOString() : null,
    });

  if (error) throw new Error(error.message);
}
