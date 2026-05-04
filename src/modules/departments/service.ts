import { departmentsRepo, type DepartmentWithRelations } from "./repository";
import type { DepartmentView, ListDepartmentsQuery } from "./schema";
import type { SessionUser } from "@/shared/types/auth";

function toView(d: DepartmentWithRelations): DepartmentView {
  return {
    id: d.id,
    name: d.name,
    code: d.code,
    iconEmoji: d.iconEmoji ?? null,
    colorHex: d.colorHex ?? null,
    beds: d.beds ?? null,
    headDoctorName: d.headDoctor?.user.name ?? null,
    doctorsCount: d._count.doctors,
  };
}

export const departmentsService = {
  // Department metadata is non-PII; any authenticated role can list.
  async list(_actor: SessionUser, query: ListDepartmentsQuery): Promise<DepartmentView[]> {
    const rows = await departmentsRepo.list(query);
    return rows.map(toView);
  },
};
