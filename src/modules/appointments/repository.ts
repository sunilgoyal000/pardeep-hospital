import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db";
import type { ListAppointmentsQuery } from "./schema";

const includeRelations = {
  patient: { include: { user: { select: { name: true } } } },
  doctor: {
    include: {
      user: { select: { name: true } },
      department: { select: { name: true } },
    },
  },
} satisfies Prisma.AppointmentInclude;

export type AppointmentWithRelations = Prisma.AppointmentGetPayload<{
  include: typeof includeRelations;
}>;

function buildWhere(q: ListAppointmentsQuery): Prisma.AppointmentWhereInput {
  const where: Prisma.AppointmentWhereInput = {};
  if (q.doctorId) where.doctorId = q.doctorId;
  if (q.patientId) where.patientId = q.patientId;
  if (q.status) where.status = q.status;
  if (q.from || q.to) {
    where.slotStart = {};
    if (q.from) where.slotStart.gte = q.from;
    if (q.to) where.slotStart.lte = q.to;
  }
  return where;
}

export const appointmentsRepo = {
  findById(id: string) {
    return prisma.appointment.findUnique({ where: { id }, include: includeRelations });
  },

  list(q: ListAppointmentsQuery, scope: Prisma.AppointmentWhereInput = {}) {
    return prisma.appointment.findMany({
      where: { AND: [buildWhere(q), scope] },
      include: includeRelations,
      orderBy: { slotStart: "desc" },
      take: q.limit,
      ...(q.cursor ? { skip: 1, cursor: { id: q.cursor } } : {}),
    });
  },

  isSlotTaken(doctorId: string, slotStart: Date, excludeId?: string) {
    return prisma.appointment.findFirst({
      where: {
        doctorId,
        slotStart,
        status: { not: "CANCELLED" },
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });
  },

  create(data: Prisma.AppointmentUncheckedCreateInput) {
    return prisma.appointment.create({ data, include: includeRelations });
  },

  update(id: string, data: Prisma.AppointmentUncheckedUpdateInput) {
    return prisma.appointment.update({ where: { id }, data, include: includeRelations });
  },
};
