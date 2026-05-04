import { z } from "zod";

export const ListDepartmentsQuerySchema = z.object({
  search: z.string().max(100).optional(),
});

export type ListDepartmentsQuery = z.infer<typeof ListDepartmentsQuerySchema>;

export interface DepartmentView {
  id: string;
  name: string;
  code: string;
  iconEmoji: string | null;
  colorHex: string | null;
  beds: number | null;
  headDoctorName: string | null;
  doctorsCount: number;
}
