import type { Role } from "@/shared/constants/roles";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
}
