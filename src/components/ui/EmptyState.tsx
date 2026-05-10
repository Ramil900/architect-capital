"use client";

import { FolderOpen } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  title:        string;
  message:      string;
  onAction?:    () => void;
  actionLabel?: string;
  icon?:        ReactNode;
}

export function EmptyState({ title, message, onAction, actionLabel = "Get Started", icon }: Props) {
  return (
    <div className="flex items-center justify-center" style={{ minHeight: "280px" }}>
      <div
        className="max-w-sm w-full rounded-xl border p-8 text-center"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
      >
        <div
          className="w-11 h-11 rounded-full mx-auto mb-5 flex items-center justify-center"
          style={{ background: "var(--bg-hover)" }}
        >
          {icon ?? <FolderOpen size={18} strokeWidth={1.5} style={{ color: "var(--text-muted)" }} />}
        </div>

        <p
          className="text-sm font-semibold tracking-wide mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </p>

        <p
          className="text-xs leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          {message}
        </p>

        {onAction && (
          <button
            onClick={onAction}
            className="mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-opacity hover:opacity-80"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
