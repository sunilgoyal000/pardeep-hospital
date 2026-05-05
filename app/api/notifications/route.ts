import { NextResponse } from "next/server";
import { withAuth } from "@/server/middleware/withRole";
import { toErrorResponse } from "@/server/errors";
import { notificationsService } from "@/modules/notifications/service";
import { ListNotificationsQuerySchema } from "@/modules/notifications/schema";

export const GET = withAuth(async (req, { user }) => {
  try {
    const params = Object.fromEntries(new URL(req.url).searchParams);
    const query = ListNotificationsQuerySchema.parse(params);
    const data = await notificationsService.list(user, query);
    return NextResponse.json({ data });
  } catch (err) {
    return toErrorResponse(err);
  }
});

export const PATCH = withAuth(async (_req, { user }) => {
  try {
    const data = await notificationsService.markAllRead(user);
    return NextResponse.json({ data });
  } catch (err) {
    return toErrorResponse(err);
  }
});
