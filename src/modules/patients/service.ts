import { AppError } from "@/server/errors";
import { ROLES } from "@/shared/constants/roles";
import type { SessionUser } from "@/shared/types/auth";

import { patientsRepo, type PatientWithRelations } from "./repository";
import type { ListPatientsQuery, PatientView } from "./schema";

const ACTIVE_WINDOW_DAYS = 90;

function ageFromDob(dob: Date | null): number | null {
  if (!dob) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age -= 1;
  return age;
}

function toView(p: PatientWithRelations): PatientView {
  const last = p.appointments[0] ?? null;
  const isActive =
    last &&
    Date.now() - last.slotStart.getTime() < ACTIVE_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  return {
    id: p.id,
    name: p.user.name ?? "Patient",
    email: p.user.email ?? null,
    phoneLast4: p.user.phone ? p.user.phone.slice(-4) : null,
    gender: p.gender,
    bloodGroup: p.bloodGroup,
    age: ageFromDob(p.dob),
    lastVisit: last ? last.slotStart.toISOString().slice(0, 10) : null,
    lastVisitDoctor: last ? last.doctor.user.name ?? null : null,
    lastVisitDept: last ? last.doctor.department?.name ?? last.doctor.specialty : null,
    appointmentCount: p._count.appointments,
    status: isActive ? "Active" : "Inactive",
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

  async getById(actor: SessionUser, id: string): Promise<PatientView> {
    if (!ALLOWED_LIST_ROLES.includes(actor.role as typeof ALLOWED_LIST_ROLES[number])) {
      throw new AppError("FORBIDDEN");
    }
    const row = await patientsRepo.findById(id);
    if (!row) throw new AppError("NOT_FOUND");
    return toView(row);
  },
};
