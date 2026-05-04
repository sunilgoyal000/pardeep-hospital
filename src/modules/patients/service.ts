import { AppError } from "@/server/errors";
import { ROLES } from "@/shared/constants/roles";
import type { SessionUser } from "@/shared/types/auth";

import { patientsRepo, type PatientWithRelations } from "./repository";
import type { ListPatientsQuery, PatientView } from "./schema";

function toView(p: PatientWithRelations): PatientView {
  return {
    id: p.id,
    name: p.user.name ?? "Patient",
    email: p.user.email ?? null,
    phoneLast4: p.user.phone ? p.user.phone.slice(-4) : null,
  };
}

const ALLOWED_LIST_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DOCTOR] as const;

export const patientsService = {
  // PII surface — only staff roles can browse the patient directory.
  // Patients themselves never list "all patients"; they read their own record elsewhere.
  async list(actor: SessionUser, query: ListPatientsQuery): Promise<PatientView[]> {
    if (!ALLOWED_LIST_ROLES.includes(actor.role as typeof ALLOWED_LIST_ROLES[number])) {
      throw new AppError("FORBIDDEN");
    }
    const rows = await patientsRepo.list(query);
    return rows.map(toView);
  },
};
