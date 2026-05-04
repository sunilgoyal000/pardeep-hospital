import { doctorsRepo, type DoctorWithRelations } from "./repository";
import type { DoctorView, ListDoctorsQuery } from "./schema";
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

export const doctorsService = {
  // Any authenticated role can list doctors — needed for booking flows.
  async list(_actor: SessionUser, query: ListDoctorsQuery): Promise<DoctorView[]> {
    const rows = await doctorsRepo.list(query);
    return rows.map(toView);
  },
};
