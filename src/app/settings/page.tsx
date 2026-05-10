"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { defaultSettings } from "@/constants/settingsData";
import { getSettings, saveSettings } from "@/services/client/settings.client";
import { PageLoading, PageError } from "@/components/ui/PageStates";
import type { AppSettings } from "@/types/settings";
import StrategySettingsCard     from "@/components/settings/StrategySettingsCard";
import RiskSettingsCard         from "@/components/settings/RiskSettingsCard";
import DcaSettingsCard          from "@/components/settings/DcaSettingsCard";
import AiSettingsCard           from "@/components/settings/AiSettingsCard";
import CurrencySettingsCard     from "@/components/settings/CurrencySettingsCard";
import NotificationSettingsCard from "@/components/settings/NotificationSettingsCard";
import AccountSettingsCard      from "@/components/settings/AccountSettingsCard";

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch(() => setSettings(defaultSettings))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const updated = await saveSettings(settings);
      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <PageLoading />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div />
        <div className="flex items-center gap-3">
          {error && (
            <p className="text-xs" style={{ color: "var(--red)" }}>{error}</p>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-opacity disabled:opacity-60"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            {saving
              ? <span className="w-3.5 h-3.5 rounded-full border-2 animate-spin" style={{ borderColor: "#fff", borderTopColor: "transparent" }} />
              : <Save size={14} />}
            {saved ? "Saved!" : saving ? "Saving…" : "Save settings"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StrategySettingsCard     settings={settings} />
        <RiskSettingsCard         settings={settings} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DcaSettingsCard          settings={settings} />
        <AiSettingsCard           settings={settings} />
        <CurrencySettingsCard     settings={settings} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NotificationSettingsCard settings={settings} />
        <AccountSettingsCard      settings={settings} />
      </div>
    </div>
  );
}
