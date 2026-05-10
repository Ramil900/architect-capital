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
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard",   href: "/dashboard",   icon: LayoutDashboard },
  { label: "Portfolio",   href: "/portfolio",   icon: BriefcaseBusiness },
  { label: "AI Strategy", href: "/ai-strategy", icon: BrainCircuit },
  { label: "Market",      href: "/market",      icon: TrendingUp },
  { label: "DCA Planner", href: "/dca",         icon: ArrowDownUp },
  { label: "Rebalancing", href: "/rebalancing", icon: BarChart3 },
  { label: "Reports",     href: "/reports",     icon: FileText },
  { label: "Settings",    href: "/settings",    icon: Settings },
];

interface Props {
  isOpen:  boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        "fixed md:relative z-30 flex flex-col h-full md:h-screen w-[220px] border-r shrink-0 transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}
      style={{
        background:  "var(--bg-secondary)",
        borderColor: "var(--border)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-between px-5 py-5 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold shrink-0"
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

        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="md:hidden w-7 h-7 rounded flex items-center justify-center transition-opacity hover:opacity-70"
          style={{ color: "var(--text-muted)" }}
          aria-label="Close menu"
        >
          <X size={15} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 px-2 py-3 flex-1 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all duration-150",
                isActive ? "font-medium" : "hover:opacity-100",
              )}
              style={{
                background:  isActive ? "var(--bg-hover)" : "transparent",
                color:       isActive ? "var(--text-primary)" : "var(--text-secondary)",
                borderLeft:  isActive ? "2px solid var(--accent)" : "2px solid transparent",
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
