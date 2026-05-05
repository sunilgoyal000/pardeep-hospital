import { z } from "zod";

export const ListPatientsQuerySchema = z.object({
  search: z.string().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(100),
});

export type ListPatientsQuery = z.infer<typeof ListPatientsQuerySchema>;

export const UpdatePatientSchema = z.object({
  dob: z.coerce.date().nullable().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).nullable().optional(),
  bloodGroup: z.string().max(8).nullable().optional(),
});
export type UpdatePatientInput = z.infer<typeof UpdatePatientSchema>;

export interface PatientView {
  id: string;
  name: string;
  email: string | null;
  phoneLast4: string | null;
  gender: "MALE" | "FEMALE" | "OTHER" | null;
  bloodGroup: string | null;
  age: number | null;
  // Derived from the patient's most-recent appointment
  lastVisit: string | null; // YYYY-MM-DD or null
  lastVisitDoctor: string | null;
  lastVisitDept: string | null;
  appointmentCount: number;
  status: "Active" | "Inactive";
}
