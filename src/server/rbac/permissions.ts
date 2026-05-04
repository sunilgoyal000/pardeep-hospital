import { ROLES, type Role } from "@/shared/constants/roles";

// Single source of truth for "who can do what".
// UI guards and service-layer checks both consult this map.

export type Action =
  | "user:manage"
  | "appointment:create"
  | "appointment:read.any"
  | "appointment:read.own"
  | "prescription:create"
  | "prescription:read.any"
  | "prescription:read.own"
  | "pharmacy:order.manage"
  | "pharmacy:order.read.own"
  | "lab:report.manage"
  | "lab:report.read.own"
  | "payment:read.any"
  | "payment:read.own"
  | "audit:read";

export const PERMISSIONS: Record<Action, Role[]> = {
  "user:manage":              [ROLES.SUPER_ADMIN, ROLES.ADMIN],

  "appointment:create":       [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.PATIENT],
  "appointment:read.any":     [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  "appointment:read.own":     [ROLES.DOCTOR, ROLES.PATIENT],

  "prescription:create":      [ROLES.DOCTOR],
  "prescription:read.any":    [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  "prescription:read.own":    [ROLES.DOCTOR, ROLES.PATIENT, ROLES.PHARMACY],

  "pharmacy:order.manage":    [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.PHARMACY],
  "pharmacy:order.read.own":  [ROLES.PATIENT],

  "lab:report.manage":        [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.LAB],
  "lab:report.read.own":      [ROLES.DOCTOR, ROLES.PATIENT],

  "payment:read.any":         [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  "payment:read.own":         [ROLES.PATIENT, ROLES.PHARMACY, ROLES.LAB],

  "audit:read":               [ROLES.SUPER_ADMIN, ROLES.ADMIN],
};

export function can(role: Role, action: Action): boolean {
  return PERMISSIONS[action].includes(role);
}
