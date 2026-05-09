"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/portfolio": "Portfolio",
  "/ai-strategy": "AI Strategy",
  "/market": "Market Indicators",
  "/dca": "DCA Planner",
  "/rebalancing": "Rebalancing",
  "/reports": "Reports",
  "/settings": "Settings",
};

export default function Topbar() {
  const pathname = usePathname();

  const title =
    Object.entries(pageTitles).find(([key]) =>
      pathname.startsWith(key)
    )?.[1] ?? "Архитектор Капитала";

  const now = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header
      className="flex items-center justify-between px-6 py-3 border-b shrink-0"
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--border)",
        height: "52px",
      }}
    >
      {/* Title */}
      <h1
        className="text-sm font-semibold tracking-wide"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {now}
        </span>

        <button
          className="w-8 h-8 rounded flex items-center justify-center transition-colors"
          style={{ color: "var(--text-secondary)" }}
        >
          <Bell size={15} strokeWidth={1.5} />
        </button>

        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          U
        </div>
      </div>
    </header>
  );
}
