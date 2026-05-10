import { createServerClient } from "@/lib/supabase/server";
import type { NotificationItem, NotificationType } from "@/types/notifications";

export interface CreateNotificationInput {
  type:    NotificationType;
  title:   string;
  message: string;
}

interface DbRow {
  id:         string;
  type:       string;
  title:      string;
  message:    string;
  read:       boolean;
  created_at: string;
}

const demoNotifications: NotificationItem[] = [
  {
    id:        "demo-n1",
    type:      "warning",
    title:     "Rebalance Needed",
    message:   "BRK.B is 3.7% above target allocation. Consider reducing.",
    read:      false,
    createdAt: new Date(Date.now() - 3600_000).toISOString(),
  },
  {
    id:        "demo-n2",
    type:      "success",
    title:     "DCA Executed",
    message:   "$500 deployed into VOO at current market price.",
    read:      false,
    createdAt: new Date(Date.now() - 86_400_000).toISOString(),
  },
  {
    id:        "demo-n3",
    type:      "info",
    title:     "Market Regime Update",
    message:   "Portfolio operating in Risk-On regime. VIX below 20.",
    read:      true,
    createdAt: new Date(Date.now() - 172_800_000).toISOString(),
  },
];

function rowToItem(row: DbRow): NotificationItem {
  return {
    id:        row.id,
    type:      row.type as NotificationType,
    title:     row.title,
    message:   row.message,
    read:      row.read,
    createdAt: row.created_at,
  };
}

export async function getUserNotifications(userId: string): Promise<NotificationItem[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = await createServerClient() as any;
    const { data, error } = await supabase
      .from("notifications")
      .select("id, type, title, message, read, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error || !data || data.length === 0) return demoNotifications;
    return (data as DbRow[]).map(rowToItem);
  } catch {
    return demoNotifications;
  }
}

export async function createNotification(userId: string, input: CreateNotificationInput): Promise<NotificationItem> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = await createServerClient() as any;
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id:    userId,
      type:       input.type,
      title:      input.title,
      message:    input.message,
      read:       false,
      created_at: new Date().toISOString(),
    })
    .select("id, type, title, message, read, created_at")
    .single();

  if (error) throw new Error(error.message);
  return rowToItem(data as DbRow);
}

export async function markNotificationAsRead(userId: string, notificationId: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = await createServerClient() as any;
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
}

export async function deleteNotification(userId: string, notificationId: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = await createServerClient() as any;
  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
}
