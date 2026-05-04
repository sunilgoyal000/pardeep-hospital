import type { Prisma } from "@prisma/client";
import { prisma } from "@/server/db";
import { AppError } from "@/server/errors";
import { eventBus } from "@/server/events/bus";
import { recordAudit } from "@/server/audit";
import { ROLES } from "@/shared/constants/roles";
import type { SessionUser } from "@/shared/types/auth";

import { appointmentsRepo, type AppointmentWithRelations } from "./repository";
import { toView } from "./view";
import { AppointmentEvents } from "./events";
import type {
  CreateAppointmentInput,
  ListAppointmentsQuery,
  UpdateAppointmentInput,
  AppointmentView,
} from "./schema";

async function resolvePatientId(actor: SessionUser, requested?: string) {
  if (actor.role === ROLES.PATIENT) {
    const me = await prisma.patient.findUnique({ where: { userId: actor.id } });
    if (!me) throw new AppError("FORBIDDEN", "No patient profile for current user");
    return me.id;
  }
  if (!requested) throw new AppError("VALIDATION", "patientId is required");
  return requested;
}

async function scopeForActor(actor: SessionUser): Promise<Prisma.AppointmentWhereInput> {
  switch (actor.role) {
    case ROLES.SUPER_ADMIN:
    case ROLES.ADMIN:
      return {};
    case ROLES.DOCTOR: {
      const doc = await prisma.doctor.findUnique({ where: { userId: actor.id } });
      if (!doc) throw new AppError("FORBIDDEN", "No doctor profile for current user");
      return { doctorId: doc.id };
    }
    case ROLES.PATIENT: {
      const pat = await prisma.patient.findUnique({ where: { userId: actor.id } });
      if (!pat) throw new AppError("FORBIDDEN", "No patient profile for current user");
      return { patientId: pat.id };
    }
    default:
      throw new AppError("FORBIDDEN");
  }
}

function assertCanRead(actor: SessionUser, a: AppointmentWithRelations) {
  if (actor.role === ROLES.SUPER_ADMIN || actor.role === ROLES.ADMIN) return;
  if (actor.role === ROLES.DOCTOR && a.doctor.userId === actor.id) return;
  if (actor.role === ROLES.PATIENT && a.patient.userId === actor.id) return;
  throw new AppError("FORBIDDEN");
}

export const appointmentsService = {
  async list(actor: SessionUser, query: ListAppointmentsQuery): Promise<AppointmentView[]> {
    const scope = await scopeForActor(actor);
    const rows = await appointmentsRepo.list(query, scope);
    return rows.map(toView);
  },

  async getById(actor: SessionUser, id: string): Promise<AppointmentView> {
    const row = await appointmentsRepo.findById(id);
    if (!row) throw new AppError("NOT_FOUND");
    assertCanRead(actor, row);
    return toView(row);
  },

  async create(actor: SessionUser, input: CreateAppointmentInput): Promise<AppointmentView> {
    if (input.slotStart < new Date()) {
      throw new AppError("VALIDATION", "Cannot book in the past");
    }
    const patientId = await resolvePatientId(actor, input.patientId);

    const taken = await appointmentsRepo.isSlotTaken(input.doctorId, input.slotStart);
    if (taken) throw new AppError("CONFLICT", "Slot already booked");

    const created = await appointmentsRepo.create({
      doctorId: input.doctorId,
      patientId,
      slotStart: input.slotStart,
      slotEnd: input.slotEnd,
      notes: input.notes,
      status: "BOOKED",
    });

    await recordAudit({
      actor,
      action: "appointment.create",
      entity: "Appointment",
      entityId: created.id,
      metadata: { doctorId: created.doctorId, patientId: created.patientId, slotStart: created.slotStart },
    });

    await eventBus.emit(AppointmentEvents.Created, {
      appointmentId: created.id,
      doctorId: created.doctorId,
      patientId: created.patientId,
      slotStart: created.slotStart,
    });

    return toView(created);
  },

  async update(
    actor: SessionUser,
    id: string,
    input: UpdateAppointmentInput
  ): Promise<AppointmentView> {
    const existing = await appointmentsRepo.findById(id);
    if (!existing) throw new AppError("NOT_FOUND");
    assertCanRead(actor, existing); // same scope as read for now

    if (
      actor.role === ROLES.PATIENT &&
      input.status &&
      input.status !== "CANCELLED"
    ) {
      throw new AppError("FORBIDDEN", "Patients can only cancel");
    }

    if (input.slotStart && input.slotStart.getTime() !== existing.slotStart.getTime()) {
      const taken = await appointmentsRepo.isSlotTaken(
        existing.doctorId,
        input.slotStart,
        id
      );
      if (taken) throw new AppError("CONFLICT", "Slot already booked");
    }

    const updated = await appointmentsRepo.update(id, {
      status: input.status,
      slotStart: input.slotStart,
      slotEnd: input.slotEnd,
      notes: input.notes ?? undefined,
    });

    await recordAudit({
      actor,
      action: "appointment.update",
      entity: "Appointment",
      entityId: id,
      metadata: input as Record<string, unknown>,
    });

    await eventBus.emit(AppointmentEvents.Updated, {
      appointmentId: id,
      changes: input,
    });

    return toView(updated);
  },

  async cancel(actor: SessionUser, id: string): Promise<AppointmentView> {
    const view = await this.update(actor, id, { status: "CANCELLED" });
    await recordAudit({
      actor,
      action: "appointment.cancel",
      entity: "Appointment",
      entityId: id,
    });
    await eventBus.emit(AppointmentEvents.Cancelled, {
      appointmentId: id,
      cancelledBy: actor.id,
    });
    return view;
  },
};
