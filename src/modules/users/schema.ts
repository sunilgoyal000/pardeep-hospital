import { z } from "zod";

export const RoleSchema = z.enum([
  "SUPER_ADMIN",
  "ADMIN",
  "DOCTOR",
  "PATIENT",
  "PHARMACY",
  "LAB",
]);
export type Role = z.infer<typeof RoleSchema>;

export const ListUsersQuerySchema = z.object({
  search: z.string().max(100).optional(),
  role: RoleSchema.optional(),
  active: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  limit: z.coerce.number().int().min(1).max(200).default(100),
});

export type ListUsersQuery = z.infer<typeof ListUsersQuerySchema>;

const BaseUserFields = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(120),
  phone: z.string().max(30).optional(),
  password: z.string().min(8).max(128),
});

const DoctorProfileFields = z.object({
  departmentId: z.string().min(1).optional(),
  specialty: z.string().min(1).max(120),
  consultFee: z.coerce.number().int().min(0).default(0),
  experienceYears: z.coerce.number().int().min(0).max(80).optional(),
});

export const CreateUserSchema = z.discriminatedUnion("role", [
  BaseUserFields.extend({ role: z.literal("SUPER_ADMIN") }),
  BaseUserFields.extend({ role: z.literal("ADMIN") }),
  BaseUserFields.extend({ role: z.literal("PHARMACY") }),
  BaseUserFields.extend({ role: z.literal("LAB") }),
  BaseUserFields.extend({ role: z.literal("PATIENT") }),
  BaseUserFields.extend({ role: z.literal("DOCTOR") }).merge(DoctorProfileFields),
]);

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  phone: z.string().max(30).nullable().optional(),
  isActive: z.boolean().optional(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

export interface UserAdminView {
  id: string;
  email: string;
  name: string;
  role: Role;
  department: string | null;  // for DOCTOR users
  isActive: boolean;
  lastLoginAt: string | null;  // ISO
  createdAt: string;
}
