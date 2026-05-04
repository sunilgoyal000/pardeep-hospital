import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db";
import type { ListDoctorsQuery } from "./schema";

const include = {
  user: { select: { name: true } },
  department: { select: { name: true } },
} satisfies Prisma.DoctorInclude;

export type DoctorWithRelations = Prisma.DoctorGetPayload<{ include: typeof include }>;

export const doctorsRepo = {
  list(q: ListDoctorsQuery) {
    const where: Prisma.DoctorWhereInput = {};
    if (q.departmentId) where.departmentId = q.departmentId;
    if (q.search) {
      where.OR = [
        { user: { name: { contains: q.search, mode: "insensitive" } } },
        { specialty: { contains: q.search, mode: "insensitive" } },
      ];
    }
    return prisma.doctor.findMany({
      where,
      include,
      orderBy: [{ isAvailable: "desc" }, { specialty: "asc" }],
      take: 200,
    });
  },
};
