import { createServerClient } from "@/lib/supabase/server";
import { portfolioData } from "@/constants/demo-portfolio";
import { ASSETS, VALID_TICKERS } from "@/constants/assets";
import { TARGET_ALLOCATION } from "@/constants/target-allocation";
import { buildPortfolioSummary } from "@/utils/portfolio-calculations";
import type { RawPosition, PortfolioSummaryData, PriceSource } from "@/types/portfolio";
import type { AssetCategory } from "@/types/asset";

interface DbMarketPrice { ticker: string; price: string | number; recorded_at: string }

async function fetchMarketPrices(tickers: string[]): Promise<Record<string, number>> {
  if (tickers.length === 0) return {};
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = await createServerClient() as any;
    const { data, error } = await supabase
      .from("market_prices")
      .select("ticker, price, recorded_at")
      .in("ticker", tickers)
      .order("recorded_at", { ascending: false });

    if (error || !data) return {};
    const prices: Record<string, number> = {};
    for (const row of data as DbMarketPrice[]) {
      if (!(row.ticker in prices)) prices[row.ticker] = Number(row.price);
    }
    return prices;
  } catch {
    return {};
  }
}

export async function getPriceByTicker(
  ticker: string,
  fallback = 0,
): Promise<{ price: number; source: "market" | "stored" }> {
  const prices = await fetchMarketPrices([ticker]);
  return prices[ticker] !== undefined
    ? { price: prices[ticker], source: "market" }
    : { price: fallback, source: "stored" };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function assertRealPosition(positionId: string) {
  if (!UUID_RE.test(positionId)) {
    throw new Error("Demo data is read-only. Add your own positions to edit or delete them.");
  }
}

function classifyAssetError(err: { message?: string } | null): Error {
  const msg = err?.message ?? "";
  if (msg.includes("does not exist")) {
    return new Error("Database schema not initialized. Run the SQL migration in Supabase first.");
  }
  if (msg.includes("Results contain 0 rows") || msg.includes("PGRST116")) {
    return new Error("Assets table is empty. Run database seed/migration.");
  }
  return new Error(msg || "Unknown database error");
}

// ─── Asset lookup helpers ────────────────────────────────────────────────────

interface DbAsset {
  id:             string;
  ticker:         string;
  name:           string;
  category:       string;
  target_percent: number;
  risk_level:     string;
  is_active:      boolean;
}

export async function getAssetByTicker(ticker: string): Promise<DbAsset> {
  if (!VALID_TICKERS.has(ticker)) {
    throw new Error(`Unsupported ticker: ${ticker}. Allowed: ${[...VALID_TICKERS].join(", ")}`);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = await createServerClient() as any;
  const { data, error } = await supabase
    .from("assets")
    .select("id, ticker, name, category, target_percent, risk_level, is_active")
    .eq("ticker", ticker)
    .single();

  if (error) throw classifyAssetError(error);
  if (!data)  throw new Error(`Asset not found: ${ticker}`);
  return data as DbAsset;
}

export async function getAssetById(assetId: string): Promise<DbAsset> {
  if (!UUID_RE.test(assetId)) {
    throw new Error(`Invalid asset ID: ${assetId}`);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = await createServerClient() as any;
  const { data, error } = await supabase
    .from("assets")
    .select("id, ticker, name, category, target_percent, risk_level, is_active")
    .eq("id", assetId)
    .single();

  if (error) throw classifyAssetError(error);
  if (!data)  throw new Error(`Asset not found by id: ${assetId}`);
  return data as DbAsset;
}

// ─── Portfolio positions ─────────────────────────────────────────────────────

interface DbRow {
  id:             string;
  ticker:         string;
  quantity:       string | number;
  average_price:  string | number;
  current_price:  string | number;
  target_percent: string | number;
  assets: { name: string; category: string } | null;
}

function rowToRaw(row: DbRow, marketPrice?: number): RawPosition {
  const asset        = ASSETS.find((a) => a.ticker === row.ticker);
  const storedPrice  = Number(row.current_price) || 0;
  const currentPrice = marketPrice ?? storedPrice;
  const priceSource: PriceSource = marketPrice !== undefined ? "market" : storedPrice > 0 ? "stored" : "demo";

  return {
    id:            row.id,
    ticker:        row.ticker,
    name:          row.assets?.name ?? asset?.name ?? row.ticker,
    category:      (row.assets?.category ?? asset?.category ?? "ETF") as AssetCategory,
    quantity:      Number(row.quantity),
    averagePrice:  Number(row.average_price),
    currentPrice,
    targetPercent: Number(row.target_percent) || TARGET_ALLOCATION[row.ticker] || 0,
    priceSource,
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

    const rows    = data as DbRow[];
    const tickers = rows.map((r) => r.ticker);
    const marketPrices = await fetchMarketPrices(tickers);

    const raw = rows.map((row) => rowToRaw(row, marketPrices[row.ticker]));
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
  const asset = await getAssetByTicker(input.ticker);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = await createServerClient() as any;
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
