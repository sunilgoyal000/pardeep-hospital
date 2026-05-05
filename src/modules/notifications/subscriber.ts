import { prisma } from "@/server/db";
import { eventBus } from "@/server/events/bus";
import { logger } from "@/server/logger";
import { AppointmentEvents } from "@/modules/appointments/events";
import { notificationsService } from "./service";

// HMR-safe registration: globalThis sentinel survives Next dev-server reloads
// so we don't pile up duplicate handlers on every save.
const REGISTRY = Symbol.for("@app/notifications-subscriber-registered");
type GlobalWithFlag = typeof globalThis & { [REGISTRY]?: true };

async function handleAppointmentCreated(payload: {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  slotStart: Date;
}) {
  const appt = await prisma.appointment.findUnique({
    where: { id: payload.appointmentId },
    include: {
      patient: { include: { user: { select: { name: true } } } },
      doctor:  { include: { user: { select: { name: true } } } },
    },
  });
  if (!appt) return;

  const when = appt.slotStart.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  await notificationsService.createInternal({
    type: "APPOINTMENT",
    title: "New appointment booked",
    body: `${appt.patient.user.name ?? "Patient"} booked with ${appt.doctor.user.name ?? "Doctor"} — ${when}`,
    userId: null, // broadcast to staff
    metadata: { appointmentId: appt.id },
  });
}

async function handleAppointmentCancelled(payload: { appointmentId: string; cancelledBy: string }) {
  const appt = await prisma.appointment.findUnique({
    where: { id: payload.appointmentId },
    include: {
      patient: { include: { user: { select: { name: true } } } },
      doctor:  { include: { user: { select: { name: true } } } },
    },
  });
  if (!appt) return;

  await notificationsService.createInternal({
    type: "APPOINTMENT",
    title: "Appointment cancelled",
    body: `${appt.patient.user.name ?? "Patient"} cancelled with ${appt.doctor.user.name ?? "Doctor"}`,
    userId: null,
    metadata: { appointmentId: appt.id },
  });
}

export function registerNotificationSubscribers() {
  const g = globalThis as GlobalWithFlag;
  if (g[REGISTRY]) return;
  g[REGISTRY] = true;

  eventBus.on<Parameters<typeof handleAppointmentCreated>[0]>(
    AppointmentEvents.Created,
    handleAppointmentCreated
  );
  eventBus.on<Parameters<typeof handleAppointmentCancelled>[0]>(
    AppointmentEvents.Cancelled,
    handleAppointmentCancelled
  );

  logger.info("notifications subscriber registered");
}
