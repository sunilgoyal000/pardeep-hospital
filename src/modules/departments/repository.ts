import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db";
import type { ListDepartmentsQuery } from "./schema";

const include = {
  headDoctor: { include: { user: { select: { name: true } } } },
  _count: { select: { doctors: true } },
} satisfies Prisma.DepartmentInclude;

export type DepartmentWithRelations = Prisma.DepartmentGetPayload<{ include: typeof include }>;

export const departmentsRepo = {
  list(q: ListDepartmentsQuery) {
    const where: Prisma.DepartmentWhereInput = q.search
      ? { name: { contains: q.search, mode: "insensitive" } }
      : {};
    return prisma.department.findMany({
      where,
      include,
      orderBy: { name: "asc" },
    });
  },
};
