"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  BrainCircuit,
  TrendingUp,
  ArrowDownUp,
  BarChart3,
  FileText,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Portfolio", href: "/portfolio", icon: BriefcaseBusiness },
  { label: "AI Strategy", href: "/ai-strategy", icon: BrainCircuit },
  { label: "Market", href: "/market", icon: TrendingUp },
  { label: "DCA Planner", href: "/dca", icon: ArrowDownUp },
  { label: "Rebalancing", href: "/rebalancing", icon: BarChart3 },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex flex-col w-[220px] min-h-screen border-r shrink-0"
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--border)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2 px-5 py-5 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          AC
        </div>
        <span
          className="text-sm font-semibold tracking-wide"
          style={{ color: "var(--text-primary)" }}
        >
          Архитектор
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 px-2 py-3 flex-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all duration-150",
                isActive
                  ? "font-medium"
                  : "hover:opacity-100"
              )}
              style={{
                background: isActive ? "var(--bg-hover)" : "transparent",
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                borderLeft: isActive
                  ? "2px solid var(--accent)"
                  : "2px solid transparent",
              }}
            >
              <Icon size={16} strokeWidth={1.5} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-5 py-4 border-t text-xs"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        v1.0 MVP
      </div>
    </aside>
  );
}
