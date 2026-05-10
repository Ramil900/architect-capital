"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Bell } from "lucide-react";
import { getNotifications, markAsRead, deleteNotification } from "@/services/client/notifications.client";
import type { NotificationItem } from "@/types/notifications";
import NotificationList from "./NotificationList";

export default function NotificationBell() {
  const [open,          setOpen]          = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const load = useCallback(() => {
    getNotifications().then(setNotifications).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function handleMarkRead(id: string) {
    try {
      await markAsRead(id);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    } catch { /* silent */ }
  }

  async function handleDelete(id: string) {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch { /* silent */ }
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-8 h-8 rounded flex items-center justify-center transition-colors"
        style={{ color: "var(--text-secondary)" }}
      >
        <Bell size={15} strokeWidth={1.5} />
        {unreadCount > 0 && (
          <span
            className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white font-bold"
            style={{ fontSize: "9px", background: "var(--red)" }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-80 rounded-lg border shadow-lg z-50 overflow-hidden"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              Notifications
            </p>
            {unreadCount > 0 && (
              <span
                className="text-xs font-semibold px-1.5 py-0.5 rounded"
                style={{ color: "var(--red)", background: "var(--red)18" }}
              >
                {unreadCount} unread
              </span>
            )}
          </div>

          <NotificationList
            notifications={notifications}
            onMarkRead={handleMarkRead}
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
}
