import { apiGet, apiPost } from "@/lib/api-client";
import type { AppSettings } from "@/types/settings";

export function getSettings(): Promise<AppSettings> {
  return apiGet<AppSettings>("/api/settings");
}

export function saveSettings(settings: AppSettings): Promise<AppSettings> {
  return apiPost<AppSettings>("/api/settings", settings);
}
