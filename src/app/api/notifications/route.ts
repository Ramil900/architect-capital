import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session";
import {
  getUserNotifications,
  createNotification,
  markNotificationAsRead,
  deleteNotification,
  type CreateNotificationInput,
} from "@/services/notification.service";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, data: null, error: "Unauthenticated" }, { status: 401 });
  }

  try {
    const data = await getUserNotifications(session.user.id);
    return NextResponse.json({ success: true, data, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, data: null, error: "Unauthenticated" }, { status: 401 });
  }

  try {
    const body: CreateNotificationInput = await request.json();
    const notification = await createNotification(session.user.id, body);
    return NextResponse.json({ success: true, data: notification, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create notification";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, data: null, error: "Unauthenticated" }, { status: 401 });
  }

  try {
    const { notificationId } = await request.json();
    if (!notificationId) {
      return NextResponse.json({ success: false, data: null, error: "notificationId required" }, { status: 400 });
    }
    await markNotificationAsRead(session.user.id, notificationId);
    return NextResponse.json({ success: true, data: null, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to mark as read";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, data: null, error: "Unauthenticated" }, { status: 401 });
  }

  try {
    const { notificationId } = await request.json();
    if (!notificationId) {
      return NextResponse.json({ success: false, data: null, error: "notificationId required" }, { status: 400 });
    }
    await deleteNotification(session.user.id, notificationId);
    return NextResponse.json({ success: true, data: null, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete notification";
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}
