"use client";

import { useState } from "react";
import { LogOut, ChevronDown, User } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/client";

interface Props {
  email?: string;
}

export default function UserMenu({ email = "user@example.com" }: Props) {
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await getBrowserClient().auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors"
        style={{ background: open ? "var(--bg-hover)" : "transparent" }}
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "var(--accent)" }}
        >
          <User size={12} color="#fff" />
        </div>
        <span
          className="text-xs font-medium max-w-[120px] truncate hidden sm:block"
          style={{ color: "var(--text-secondary)" }}
        >
          {email}
        </span>
        <ChevronDown
          size={12}
          className="shrink-0 transition-transform"
          style={{
            color:     "var(--text-muted)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Dropdown */}
          <div
            className="absolute right-0 top-full mt-1 w-48 rounded-lg border shadow-lg z-50 overflow-hidden"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
          >
            <div className="px-3 py-2.5 border-b" style={{ borderColor: "var(--border-subtle)" }}>
              <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>{email}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Institutional</p>
            </div>

            <div className="p-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded text-xs transition-colors"
                style={{ color: "var(--red)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <LogOut size={13} />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
