import { z } from "zod";

export const ListPatientsQuerySchema = z.object({
  search: z.string().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type ListPatientsQuery = z.infer<typeof ListPatientsQuerySchema>;

export interface PatientView {
  id: string;
  name: string;
  email: string | null;
  phoneLast4: string | null;
}
