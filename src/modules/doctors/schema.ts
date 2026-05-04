import { z } from "zod";

export const ListDoctorsQuerySchema = z.object({
  departmentId: z.string().optional(),
  search: z.string().max(100).optional(),
});

export type ListDoctorsQuery = z.infer<typeof ListDoctorsQuerySchema>;

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
