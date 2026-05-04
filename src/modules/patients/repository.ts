import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db";
import type { ListPatientsQuery } from "./schema";

const include = {
  user: { select: { name: true, email: true, phone: true } },
  appointments: {
    where: { status: { in: ["COMPLETED", "CONFIRMED", "BOOKED"] } },
    orderBy: { slotStart: "desc" },
    take: 1,
    include: {
      doctor: {
        include: {
          user: { select: { name: true } },
          department: { select: { name: true } },
        },
      },
    },
  },
  _count: { select: { appointments: true } },
} satisfies Prisma.PatientInclude;

export type PatientWithRelations = Prisma.PatientGetPayload<{ include: typeof include }>;

export const patientsRepo = {
  list(q: ListPatientsQuery) {
    const where: Prisma.PatientWhereInput = q.search
      ? {
          OR: [
            { user: { name: { contains: q.search, mode: "insensitive" } } },
            { user: { email: { contains: q.search, mode: "insensitive" } } },
            { user: { phone: { contains: q.search } } },
          ],
        }
      : {};
    return prisma.patient.findMany({
      where,
      include,
      orderBy: { user: { name: "asc" } },
      take: q.limit,
    });
  },

  findById(id: string) {
    return prisma.patient.findUnique({ where: { id }, include });
  },
};
