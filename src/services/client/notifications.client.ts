import { apiGet, apiMutate } from "@/lib/api-client";
import type { NotificationItem, NotificationType } from "@/types/notifications";

export interface CreateNotificationInput {
  type:    NotificationType;
  title:   string;
  message: string;
}

export function getNotifications(): Promise<NotificationItem[]> {
  return apiGet<NotificationItem[]>("/api/notifications");
}

export function createNotification(notification: CreateNotificationInput): Promise<void> {
  return apiMutate("POST", "/api/notifications", notification);
}

export function markAsRead(notificationId: string): Promise<void> {
  return apiMutate("PATCH", "/api/notifications", { notificationId });
}

export function deleteNotification(notificationId: string): Promise<void> {
  return apiMutate("DELETE", "/api/notifications", { notificationId });
}
