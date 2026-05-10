import { createServerClient } from "@/lib/supabase/server";
import { portfolioData } from "@/constants/demo-portfolio";
import { ASSETS } from "@/constants/assets";
import { TARGET_ALLOCATION } from "@/constants/target-allocation";
import { buildPortfolioSummary } from "@/utils/portfolio-calculations";
import type { RawPosition, PortfolioSummaryData } from "@/types/portfolio";
import type { AssetCategory } from "@/types/asset";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function assertRealPosition(positionId: string) {
  if (!UUID_RE.test(positionId)) {
    throw new Error("Demo data is read-only. Add your own positions to edit or delete them.");
  }
}

interface DbRow {
  id:             string;
  ticker:         string;
  quantity:       string | number;
  average_price:  string | number;
  current_price:  string | number;
  target_percent: string | number;
  assets: { name: string; category: string } | null;
}

function rowToRaw(row: DbRow): RawPosition {
  const asset = ASSETS.find((a) => a.ticker === row.ticker);
  return {
    id:            row.id,
    ticker:        row.ticker,
    name:          row.assets?.name ?? asset?.name ?? row.ticker,
    category:      (row.assets?.category ?? asset?.category ?? "ETF") as AssetCategory,
    quantity:      Number(row.quantity),
    averagePrice:  Number(row.average_price),
    currentPrice:  Number(row.current_price) || 0,
    targetPercent: Number(row.target_percent) || TARGET_ALLOCATION[row.ticker] || 0,
  };
}

export async function getUserPortfolioPositions(userId: string): Promise<PortfolioSummaryData> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = await createServerClient() as any;
    const { data, error } = await supabase
      .from("portfolio_positions")
      .select("id, ticker, quantity, average_price, current_price, target_percent, assets(name, category)")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error || !data || (data as DbRow[]).length === 0) return portfolioData;

    const raw = (data as DbRow[]).map(rowToRaw);
    return buildPortfolioSummary(raw);
  } catch {
    return portfolioData;
  }
}

export interface AddPositionInput {
  ticker:       string;
  quantity:     number;
  averagePrice: number;
  currentPrice: number;
}

export async function addPortfolioPosition(userId: string, input: AddPositionInput): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = await createServerClient() as any;

  const { data: asset, error: assetError } = await supabase
    .from("assets")
    .select("id, target_percent")
    .eq("ticker", input.ticker)
    .single();

  if (assetError) {
    const msg = assetError.message?.includes("does not exist")
      ? "Database schema not initialized. Run the SQL migration in Supabase first."
      : assetError.message;
    throw new Error(msg);
  }
  if (!asset) throw new Error(`Asset not found: ${input.ticker}`);

  const { error } = await supabase
    .from("portfolio_positions")
    .insert({
      user_id:        userId,
      asset_id:       asset.id,
      ticker:         input.ticker,
      quantity:       input.quantity,
      average_price:  input.averagePrice,
      current_price:  input.currentPrice,
      target_percent: asset.target_percent,
    });

  if (error) throw new Error(error.message);
}

export interface UpdatePositionInput {
  quantity:     number;
  averagePrice: number;
  currentPrice: number;
}

export async function updatePortfolioPosition(
  userId:     string,
  positionId: string,
  input:      UpdatePositionInput,
): Promise<void> {
  assertRealPosition(positionId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = await createServerClient() as any;
  const { error } = await supabase
    .from("portfolio_positions")
    .update({
      quantity:      input.quantity,
      average_price: input.averagePrice,
      current_price: input.currentPrice,
    })
    .eq("id", positionId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
}

export async function deletePortfolioPosition(userId: string, positionId: string): Promise<void> {
  assertRealPosition(positionId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = await createServerClient() as any;
  const { error } = await supabase
    .from("portfolio_positions")
    .delete()
    .eq("id", positionId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
}
