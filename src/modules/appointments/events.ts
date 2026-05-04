export const AppointmentEvents = {
  Created: "appointment.created",
  Updated: "appointment.updated",
  Cancelled: "appointment.cancelled",
} as const;

export interface AppointmentCreatedPayload {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  slotStart: Date;
}

export interface AppointmentUpdatedPayload {
  appointmentId: string;
  changes: Record<string, unknown>;
}

export interface AppointmentCancelledPayload {
  appointmentId: string;
  cancelledBy: string;
}
