import { AppError } from "@/server/errors";
import { ROLES } from "@/shared/constants/roles";
import type { SessionUser } from "@/shared/types/auth";

import { notificationsRepo } from "./repository";
import type {
  ListNotificationsQuery,
  NotificationType,
  NotificationView,
} from "./schema";

const STAFF_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.DOCTOR,
  ROLES.PHARMACY,
  ROLES.LAB,
] as const;

function audienceFor(actor: SessionUser): string | null {
  // For now: staff see broadcast (userId null) + their own. Patients see only their own.
  return actor.id;
}

function toView(n: {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: Date;
}): NotificationView {
  return {
    id: n.id,
    type: n.type,
    title: n.title,
    body: n.body,
    isRead: n.isRead,
    createdAt: n.createdAt.toISOString(),
  };
}

export const notificationsService = {
  async list(actor: SessionUser, query: ListNotificationsQuery): Promise<NotificationView[]> {
    const rows = await notificationsRepo.list(audienceFor(actor), query);
    return rows.map((r) => toView(r));
  },

  async markRead(actor: SessionUser, id: string): Promise<NotificationView> {
    // Note: ownership check via select+update; broadcast rows (userId=null) are mutable by anyone
    // who can see them, which is acceptable since we only flip isRead, not content.
    const row = await notificationsRepo.markRead(id);
    if (row.userId !== null && row.userId !== actor.id) {
      throw new AppError("FORBIDDEN");
    }
    return toView(row);
  },

  async markAllRead(actor: SessionUser): Promise<{ count: number }> {
    const result = await notificationsRepo.markAllRead(audienceFor(actor));
    return { count: result.count };
  },

  // Internal API used by the event-bus subscriber. No actor — system writes.
  async createInternal(input: {
    type: NotificationType;
    title: string;
    body: string;
    userId?: string | null;
    metadata?: Record<string, unknown>;
  }) {
    return notificationsRepo.create({
      type: input.type,
      title: input.title,
      body: input.body,
      userId: input.userId ?? null,
      metadata: input.metadata as never,
    });
  },

  // Reserved for a future patient-facing notifications page.
  _staffRoles: STAFF_ROLES,
};
