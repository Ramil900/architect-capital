"use client";

import { useState } from "react";
import type { AppSettings } from "@/types/settings";

type NotifKey = keyof AppSettings["notifications"];

const notifItems: { key: NotifKey; label: string; desc: string }[] = [
  { key: "dailyReport",    label: "Daily Report",      desc: "End-of-day portfolio summary"          },
  { key: "crisisAlert",    label: "Crisis Alert",      desc: "VIX spikes or major drawdown detected" },
  { key: "dcaTrigger",     label: "DCA Trigger",       desc: "New DCA buy zone reached"              },
  { key: "rebalanceAlert", label: "Rebalance Alert",   desc: "Drift exceeds AI threshold"            },
  { key: "weeklyReport",   label: "Weekly Report",     desc: "7-day performance summary"             },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="relative w-10 h-5 rounded-full transition-colors shrink-0"
      style={{ background: enabled ? "var(--accent)" : "var(--border)" }}
    >
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
        style={{ background: "#fff", left: enabled ? "calc(100% - 18px)" : "2px" }}
      />
    </button>
  );
}

interface Props {
  settings: AppSettings;
}

export default function NotificationSettingsCard({ settings }: Props) {
  const [notifs, setNotifs] = useState(settings.notifications);

  function toggle(key: NotifKey) {
    setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="rounded-lg border p-5 flex flex-col gap-4" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
        Notifications
      </p>

      <div className="flex flex-col gap-3">
        {notifItems.map((item) => (
          <div key={item.key} className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{item.label}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
            </div>
            <Toggle enabled={notifs[item.key]} onChange={() => toggle(item.key)} />
          </div>
        ))}
      </div>
    </div>
  );
}
