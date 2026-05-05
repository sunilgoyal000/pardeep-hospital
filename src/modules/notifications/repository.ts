import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db";
import type { ListNotificationsQuery } from "./schema";

export const notificationsRepo = {
  list(audienceUserId: string | null, q: ListNotificationsQuery) {
    const where: Prisma.NotificationWhereInput = {
      OR: [{ userId: null }, ...(audienceUserId ? [{ userId: audienceUserId }] : [])],
    };
    if (q.type) where.type = q.type;
    if (q.unreadOnly) where.isRead = false;

    return prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: q.limit,
    });
  },

  countUnread(audienceUserId: string | null) {
    return prisma.notification.count({
      where: {
        isRead: false,
        OR: [{ userId: null }, ...(audienceUserId ? [{ userId: audienceUserId }] : [])],
      },
    });
  },

  markRead(id: string) {
    return prisma.notification.update({ where: { id }, data: { isRead: true } });
  },

  markAllRead(audienceUserId: string | null) {
    return prisma.notification.updateMany({
      where: {
        isRead: false,
        OR: [{ userId: null }, ...(audienceUserId ? [{ userId: audienceUserId }] : [])],
      },
      data: { isRead: true },
    });
  },

  create(data: Prisma.NotificationUncheckedCreateInput) {
    return prisma.notification.create({ data });
  },
};
