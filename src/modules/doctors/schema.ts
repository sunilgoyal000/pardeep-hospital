import { z } from "zod";

export const ListDoctorsQuerySchema = z.object({
  departmentId: z.string().optional(),
  search: z.string().max(100).optional(),
});

export type ListDoctorsQuery = z.infer<typeof ListDoctorsQuerySchema>;

export const UpdateDoctorSchema = z.object({
  specialty: z.string().min(1).max(120).optional(),
  consultFee: z.coerce.number().int().min(0).optional(),
  departmentId: z.string().nullable().optional(),
  isAvailable: z.boolean().optional(),
  experienceYears: z.coerce.number().int().min(0).max(80).nullable().optional(),
  rating: z.coerce.number().min(0).max(5).nullable().optional(),
  imageUrl: z.string().url().max(2048).nullable().optional(),
});
export type UpdateDoctorInput = z.infer<typeof UpdateDoctorSchema>;

// Used by the booking modal; kept lean.
export interface DoctorView {
  id: string;
  name: string;
  specialty: string;
  department: string | null;
  consultFee: number;
  isAvailable: boolean;
}

// Richer admin-grade view used by the doctors directory.
export interface DoctorAdminView extends DoctorView {
  imageUrl: string | null;
  experienceYears: number | null;
  rating: number | null;
  appointmentsToday: number;
  patientsLifetime: number;
}
