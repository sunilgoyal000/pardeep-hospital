import { NextResponse } from "next/server";
import { withAuth } from "@/server/middleware/withRole";
import { toErrorResponse } from "@/server/errors";
import { notificationsService } from "@/modules/notifications/service";

type Ctx = { params: Promise<{ id: string }> };

export const PATCH = withAuth<Ctx>(async (_req, { user, params }) => {
  try {
    const { id } = await params;
    const data = await notificationsService.markRead(user, id);
    return NextResponse.json({ data });
  } catch (err) {
    return toErrorResponse(err);
  }
});
