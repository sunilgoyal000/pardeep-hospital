import { doctorsRepo, type DoctorWithRelations } from "./repository";
import type { DoctorView, DoctorAdminView, ListDoctorsQuery } from "./schema";
import { AppError } from "@/server/errors";
import { ROLES } from "@/shared/constants/roles";
import type { SessionUser } from "@/shared/types/auth";

function toView(d: DoctorWithRelations): DoctorView {
  return {
    id: d.id,
    name: d.user.name ?? "Doctor",
    specialty: d.specialty,
    department: d.department?.name ?? null,
    consultFee: Number(d.consultFee),
    isAvailable: d.isAvailable,
  };
}

const STAFF_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN] as const;

export const doctorsService = {
  // Any authenticated role can list doctors — needed for booking flows.
  async list(_actor: SessionUser, query: ListDoctorsQuery): Promise<DoctorView[]> {
    const rows = await doctorsRepo.list(query);
    return rows.map(toView);
  },

  // Admin directory view — includes today/lifetime counts.
  async listForAdmin(actor: SessionUser, query: ListDoctorsQuery): Promise<DoctorAdminView[]> {
    if (!STAFF_ROLES.includes(actor.role as typeof STAFF_ROLES[number])) {
      throw new AppError("FORBIDDEN");
    }
    const rows = await doctorsRepo.list(query);
    const stats = await doctorsRepo.statsFor(rows.map((r) => r.id));
    return rows.map((r) => {
      const s = stats.get(r.id) ?? { today: 0, lifetime: 0 };
      return {
        ...toView(r),
        imageUrl: r.imageUrl ?? null,
        experienceYears: r.experienceYears ?? null,
        rating: r.rating != null ? Number(r.rating) : null,
        appointmentsToday: s.today,
        patientsLifetime: s.lifetime,
      };
    });
  },
};
