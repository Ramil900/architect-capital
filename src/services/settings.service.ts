import { createServerClient } from "@/lib/supabase/server";
import { defaultSettings } from "@/constants/settingsData";
import type { AppSettings, RiskProfile, InvestmentHorizon, AIMode, BaseCurrency } from "@/types/settings";

interface DbRow {
  risk_profile:         string;
  investment_horizon:   string;
  max_drawdown:         number;
  cash_reserve_percent: number;
  dca_enabled:          boolean;
  dca_amount:           number;
  dca_frequency:        string;
  leverage:             number;
  rebalance_threshold:  number;
  ai_mode:              string;
  base_currency:        string;
}

function rowToSettings(row: DbRow): AppSettings {
  return {
    ...defaultSettings,
    riskProfile:          row.risk_profile as RiskProfile,
    investmentHorizon:    row.investment_horizon as InvestmentHorizon,
    maxDrawdown:          Number(row.max_drawdown),
    cashReservePercent:   Number(row.cash_reserve_percent),
    dcaEnabled:           row.dca_enabled,
    dcaAmount:            Number(row.dca_amount),
    dcaFrequency:         row.dca_frequency,
    leverage:             Number(row.leverage),
    aiRebalanceThreshold: Number(row.rebalance_threshold),
    aiMode:               row.ai_mode as AIMode,
    baseCurrency:         row.base_currency as BaseCurrency,
  };
}

function settingsToRow(settings: AppSettings) {
  const riskProfile = (["Conservative", "Moderate", "Aggressive"] as const).includes(
    settings.riskProfile as "Conservative" | "Moderate" | "Aggressive"
  ) ? settings.riskProfile : "Moderate";

  return {
    risk_profile:         riskProfile,
    investment_horizon:   settings.investmentHorizon,
    max_drawdown:         settings.maxDrawdown,
    cash_reserve_percent: settings.cashReservePercent,
    dca_enabled:          settings.dcaEnabled,
    dca_amount:           settings.dcaAmount,
    dca_frequency:        settings.dcaFrequency,
    leverage:             settings.leverage,
    rebalance_threshold:  settings.aiRebalanceThreshold,
    ai_mode:              settings.aiMode,
    base_currency:        settings.baseCurrency,
  };
}

export async function getUserSettings(userId: string): Promise<AppSettings> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = await createServerClient() as any;
    const { data, error } = await supabase
      .from("strategy_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !data) return defaultSettings;
    return rowToSettings(data as DbRow);
  } catch {
    return defaultSettings;
  }
}

export async function upsertUserSettings(userId: string, settings: AppSettings): Promise<AppSettings> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = await createServerClient() as any;
  const { data, error } = await supabase
    .from("strategy_settings")
    .upsert({ user_id: userId, ...settingsToRow(settings) }, { onConflict: "user_id" })
    .select("*")
    .single();

  if (error || !data) throw new Error((error as { message?: string })?.message ?? "Failed to save settings");
  return rowToSettings(data as DbRow);
}
