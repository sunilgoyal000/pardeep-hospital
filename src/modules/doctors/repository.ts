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

  // For each doctor in `ids`: appointments scheduled today + lifetime distinct patients.
  // O(2) round-trips regardless of `ids` length. Could be materialized later.
  async statsFor(ids: string[]) {
    if (ids.length === 0) return new Map<string, { today: number; lifetime: number }>();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    const [todayGroups, lifetimeGroups] = await Promise.all([
      prisma.appointment.groupBy({
        by: ["doctorId"],
        where: { doctorId: { in: ids }, slotStart: { gte: today, lt: tomorrow } },
        _count: { _all: true },
      }),
      prisma.appointment.groupBy({
        by: ["doctorId", "patientId"],
        where: { doctorId: { in: ids } },
      }),
    ]);

    const todayMap = new Map(todayGroups.map((g) => [g.doctorId, g._count._all]));
    const lifetimeMap = new Map<string, Set<string>>();
    for (const g of lifetimeGroups) {
      const set = lifetimeMap.get(g.doctorId) ?? new Set<string>();
      set.add(g.patientId);
      lifetimeMap.set(g.doctorId, set);
    }

    const out = new Map<string, { today: number; lifetime: number }>();
    for (const id of ids) {
      out.set(id, {
        today: todayMap.get(id) ?? 0,
        lifetime: lifetimeMap.get(id)?.size ?? 0,
      });
    }
    return out;
  },
};
