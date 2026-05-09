import { defaultSettings } from "@/constants/settingsData";
import StrategySettingsCard from "@/components/settings/StrategySettingsCard";
import RiskSettingsCard from "@/components/settings/RiskSettingsCard";
import DcaSettingsCard from "@/components/settings/DcaSettingsCard";
import AiSettingsCard from "@/components/settings/AiSettingsCard";
import CurrencySettingsCard from "@/components/settings/CurrencySettingsCard";
import NotificationSettingsCard from "@/components/settings/NotificationSettingsCard";
import AccountSettingsCard from "@/components/settings/AccountSettingsCard";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StrategySettingsCard settings={defaultSettings} />
        <RiskSettingsCard     settings={defaultSettings} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DcaSettingsCard      settings={defaultSettings} />
        <AiSettingsCard       settings={defaultSettings} />
        <CurrencySettingsCard settings={defaultSettings} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NotificationSettingsCard settings={defaultSettings} />
        <AccountSettingsCard      settings={defaultSettings} />
      </div>
    </div>
  );
}
