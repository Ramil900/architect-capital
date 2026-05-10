"use client";

import { Check, Trash2 } from "lucide-react";
import type { NotificationItem, NotificationType } from "@/types/notifications";

const typeColor: Record<NotificationType, string> = {
  info:    "var(--accent)",
  warning: "var(--yellow)",
  success: "var(--green)",
  error:   "var(--red)",
};

interface Props {
  notifications: NotificationItem[];
  onMarkRead:    (id: string) => void;
  onDelete:      (id: string) => void;
}

export default function NotificationList({ notifications, onMarkRead, onDelete }: Props) {
  if (notifications.length === 0) {
    return (
      <p className="px-4 py-6 text-center text-xs" style={{ color: "var(--text-muted)" }}>
        No notifications
      </p>
    );
  }

  return (
    <ul className="max-h-80 overflow-y-auto divide-y" style={{ borderColor: "var(--border-subtle)" }}>
      {notifications.map((n) => {
        const color = typeColor[n.type];
        const isDemoItem = n.id.startsWith("demo-");
        return (
          <li
            key={n.id}
            className="flex items-start gap-3 px-4 py-3"
            style={{ opacity: n.read ? 0.6 : 1 }}
          >
            <span
              className="mt-0.5 w-2 h-2 rounded-full shrink-0"
              style={{ background: n.read ? "var(--border)" : color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                {n.title}
              </p>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {n.message}
              </p>
            </div>
            {!isDemoItem && (
              <div className="flex items-center gap-1 shrink-0">
                {!n.read && (
                  <button
                    onClick={() => onMarkRead(n.id)}
                    className="p-1 rounded"
                    style={{ color: "var(--text-muted)" }}
                    title="Mark as read"
                  >
                    <Check size={12} />
                  </button>
                )}
                <button
                  onClick={() => onDelete(n.id)}
                  className="p-1 rounded"
                  style={{ color: "var(--text-muted)" }}
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
