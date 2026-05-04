import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db";
import type { ListUsersQuery } from "./schema";

const include = {
  doctor: { include: { department: { select: { name: true } } } },
} satisfies Prisma.UserInclude;

export type UserWithRelations = Prisma.UserGetPayload<{ include: typeof include }>;

export const usersRepo = {
  list(q: ListUsersQuery) {
    const where: Prisma.UserWhereInput = {};
    if (q.role) where.role = q.role;
    if (q.active !== undefined) where.isActive = q.active;
    if (q.search) {
      where.OR = [
        { name: { contains: q.search, mode: "insensitive" } },
        { email: { contains: q.search, mode: "insensitive" } },
      ];
    }
    return prisma.user.findMany({
      where,
      include,
      orderBy: { createdAt: "desc" },
      take: q.limit,
    });
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id }, include });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },
};
