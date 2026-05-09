import { User, Shield } from "lucide-react";
import type { AppSettings } from "@/types/settings";

interface Props {
  settings: AppSettings;
}

export default function AccountSettingsCard({ settings }: Props) {
  const { account } = settings;

  return (
    <div className="rounded-lg border p-5 flex flex-col gap-4" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
        Account
      </p>

      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "color-mix(in srgb, var(--accent) 20%, transparent)" }}
        >
          <User size={20} style={{ color: "var(--accent)" }} />
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{account.name}</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{account.email}</p>
        </div>
      </div>

      <div
        className="rounded-lg p-3 flex items-center gap-2"
        style={{ background: "color-mix(in srgb, var(--accent) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)" }}
      >
        <Shield size={14} style={{ color: "var(--accent)" }} />
        <div>
          <p className="text-xs font-semibold" style={{ color: "var(--accent)" }}>{account.plan} Plan</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Member since {account.joinedAt}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        {[
          { label: "Change Password", color: "var(--text-secondary)" },
          { label: "Export Account Data", color: "var(--text-secondary)" },
          { label: "Delete Account", color: "var(--red)" },
        ].map((action) => (
          <button
            key={action.label}
            className="text-left text-xs py-1.5 px-2 rounded transition-colors"
            style={{ color: action.color }}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
