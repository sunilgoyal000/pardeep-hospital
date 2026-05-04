import type { AppointmentStatus } from "@prisma/client";
import type { AppointmentWithRelations } from "./repository";
import type { AppointmentView } from "./schema";

const STATUS_LABEL: Record<AppointmentStatus, AppointmentView["status"]> = {
  BOOKED: "Pending",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "Cancelled",
};

function toToken(id: string) {
  // PH-{last 3 of id, uppercase}
  return `PH-${id.slice(-3).toUpperCase()}`;
}

function fmtDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function fmtTime(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

export function toView(a: AppointmentWithRelations): AppointmentView {
  return {
    id: a.id,
    patientId: a.patientId,
    patient: a.patient.user.name ?? "Patient",
    doctorId: a.doctorId,
    doctor: a.doctor.user.name ?? "Doctor",
    dept: a.doctor.department?.name ?? a.doctor.specialty,
    date: fmtDate(a.slotStart),
    time: fmtTime(a.slotStart),
    status: STATUS_LABEL[a.status],
    token: a.token ?? toToken(a.id),
  };
}
