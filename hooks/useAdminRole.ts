"use client";
import { create } from "zustand";

export type AdminRole = "Super Admin" | "Doctor" | "Receptionist" | "Pharmacist";

interface AdminRoleState {
  role: AdminRole;
  setRole: (role: AdminRole) => void;
}

export const useAdminRole = create<AdminRoleState>((set) => ({
  role: "Super Admin",
  setRole: (role) => set({ role }),
}));
