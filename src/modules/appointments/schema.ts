import { z } from "zod";

export const AppointmentStatusSchema = z.enum([
  "BOOKED",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
]);

export const CreateAppointmentSchema = z
  .object({
    doctorId: z.string().min(1),
    patientId: z.string().min(1).optional(), // required for ADMIN; ignored for PATIENT (defaults to actor)
    slotStart: z.coerce.date(),
    slotEnd: z.coerce.date(),
    notes: z.string().max(2000).optional(),
  })
  .refine((v) => v.slotEnd > v.slotStart, {
    message: "slotEnd must be after slotStart",
    path: ["slotEnd"],
  });

export const UpdateAppointmentSchema = z.object({
  status: AppointmentStatusSchema.optional(),
  slotStart: z.coerce.date().optional(),
  slotEnd: z.coerce.date().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export const ListAppointmentsQuerySchema = z.object({
  doctorId: z.string().optional(),
  patientId: z.string().optional(),
  status: AppointmentStatusSchema.optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  cursor: z.string().optional(),
});

export type CreateAppointmentInput = z.infer<typeof CreateAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof UpdateAppointmentSchema>;
export type ListAppointmentsQuery = z.infer<typeof ListAppointmentsQuerySchema>;

// View shape consumed by the admin UI. Decouples DB rows from UI.
export interface AppointmentView {
  id: string;
  patient: string;
  patientId: string;
  doctor: string;
  doctorId: string;
  dept: string;
  date: string; // YYYY-MM-DD
  time: string; // h:mm AM/PM
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  token: string;
}
