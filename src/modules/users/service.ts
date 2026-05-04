import bcrypt from "bcryptjs";
import { prisma } from "@/server/db";
import { AppError } from "@/server/errors";
import { recordAudit } from "@/server/audit";
import { ROLES } from "@/shared/constants/roles";
import type { SessionUser } from "@/shared/types/auth";

import { usersRepo, type UserWithRelations } from "./repository";
import type {
  CreateUserInput,
  ListUsersQuery,
  UpdateUserInput,
  UserAdminView,
} from "./schema";

const ADMIN_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN] as const;

function assertAdmin(actor: SessionUser) {
  if (!ADMIN_ROLES.includes(actor.role as typeof ADMIN_ROLES[number])) {
    throw new AppError("FORBIDDEN");
  }
}

function toView(u: UserWithRelations): UserAdminView {
  return {
    id: u.id,
    email: u.email,
    name: u.name ?? "",
    role: u.role,
    department: u.doctor?.department?.name ?? null,
    isActive: u.isActive,
    lastLoginAt: u.lastLoginAt ? u.lastLoginAt.toISOString() : null,
    createdAt: u.createdAt.toISOString(),
  };
}

export const usersService = {
  async list(actor: SessionUser, query: ListUsersQuery): Promise<UserAdminView[]> {
    assertAdmin(actor);
    const rows = await usersRepo.list(query);
    return rows.map(toView);
  },

  async create(actor: SessionUser, input: CreateUserInput): Promise<UserAdminView> {
    assertAdmin(actor);

    const existing = await usersRepo.findByEmail(input.email);
    if (existing) throw new AppError("CONFLICT", "A user with that email already exists");

    const passwordHash = await bcrypt.hash(input.password, 10);

    // Single transaction so a half-created Doctor/Patient profile can never leak.
    const created = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: input.email,
          name: input.name,
          phone: input.phone,
          role: input.role,
          passwordHash,
        },
      });

      if (input.role === "DOCTOR") {
        if (input.departmentId) {
          const dept = await tx.department.findUnique({ where: { id: input.departmentId } });
          if (!dept) throw new AppError("VALIDATION", "Department not found");
        }
        await tx.doctor.create({
          data: {
            userId: user.id,
            departmentId: input.departmentId,
            specialty: input.specialty,
            consultFee: input.consultFee,
            experienceYears: input.experienceYears,
          },
        });
      } else if (input.role === "PATIENT") {
        await tx.patient.create({ data: { userId: user.id } });
      }

      return user;
    });

    await recordAudit({
      actor,
      action: "user.create",
      entity: "User",
      entityId: created.id,
      metadata: { role: input.role, email: input.email },
    });

    const fresh = await usersRepo.findById(created.id);
    return toView(fresh!);
  },

  async update(
    actor: SessionUser,
    id: string,
    input: UpdateUserInput
  ): Promise<UserAdminView> {
    assertAdmin(actor);

    if (input.isActive === false && id === actor.id) {
      throw new AppError("VALIDATION", "You cannot deactivate your own account");
    }

    const existing = await usersRepo.findById(id);
    if (!existing) throw new AppError("NOT_FOUND");

    await prisma.user.update({
      where: { id },
      data: {
        name: input.name,
        phone: input.phone ?? undefined,
        isActive: input.isActive,
      },
    });

    await recordAudit({
      actor,
      action: input.isActive === false ? "user.deactivate" : "user.update",
      entity: "User",
      entityId: id,
      metadata: input as Record<string, unknown>,
    });

    const fresh = await usersRepo.findById(id);
    return toView(fresh!);
  },
};
