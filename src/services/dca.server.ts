import { createServerClient } from "@/lib/supabase/server";
import type { DCALevel } from "@/types/dca";

export interface DcaActionInput {
  ticker:     string;
  dcaLevel:   DCALevel;
  amount:     number;
  price:      number;
  marketDrop: number;
  status?:    "Executed" | "Skipped" | "Pending";
}

export interface DcaHistoryItem {
  id:         string;
  ticker:     string;
  dcaLevel:   string;
  amount:     number;
  price:      number;
  marketDrop: number;
  status:     string;
  executedAt: string;
}

interface DbRow {
  id:          string;
  ticker:      string;
  dca_level:   string;
  amount:      string | number;
  price:       string | number;
  market_drop: string | number;
  status:      string;
  executed_at: string;
}

function rowToItem(row: DbRow): DcaHistoryItem {
  return {
    id:         row.id,
    ticker:     row.ticker,
    dcaLevel:   row.dca_level,
    amount:     Number(row.amount),
    price:      Number(row.price),
    marketDrop: Number(row.market_drop),
    status:     row.status,
    executedAt: row.executed_at,
  };
}

export async function getDcaHistory(userId: string): Promise<DcaHistoryItem[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = await createServerClient() as any;
    const { data, error } = await supabase
      .from("dca_history")
      .select("id, ticker, dca_level, amount, price, market_drop, status, executed_at")
      .eq("user_id", userId)
      .order("executed_at", { ascending: false })
      .limit(50);

    if (error || !data) return [];
    return (data as DbRow[]).map(rowToItem);
  } catch {
    return [];
  }
}

export async function saveDcaAction(userId: string, input: DcaActionInput): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = await createServerClient() as any;
  const { error } = await supabase
    .from("dca_history")
    .insert({
      user_id:     userId,
      ticker:      input.ticker,
      dca_level:   input.dcaLevel,
      amount:      input.amount,
      price:       input.price,
      market_drop: input.marketDrop,
      status:      input.status ?? "Executed",
    });

  if (error) throw new Error(error.message);
}
