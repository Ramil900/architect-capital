export type NotificationType = "info" | "warning" | "success" | "error";

export interface NotificationItem {
  id:        string;
  type:      NotificationType;
  title:     string;
  message:   string;
  read:      boolean;
  createdAt: string;
}
