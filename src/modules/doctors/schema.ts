import { z } from "zod";

export const ListDoctorsQuerySchema = z.object({
  departmentId: z.string().optional(),
  search: z.string().max(100).optional(),
});

export type ListDoctorsQuery = z.infer<typeof ListDoctorsQuerySchema>;

export interface DoctorView {
  id: string;
  name: string;
  specialty: string;
  department: string | null;
  consultFee: number;
  isAvailable: boolean;
}
