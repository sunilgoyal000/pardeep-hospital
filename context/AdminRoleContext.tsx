"use client";
// LEGACY: this React Context drives only the admin shell's role-switcher pill (UI affordance).
// The authoritative role for authorization is `session.user.role` via NextAuth — never trust
// this value for permission checks. Slated for removal once AdminSidebar/AdminTopbar are
// rewired to consume the real session role through a server-passed prop.
import React, { createContext, useContext, useState } from "react";

export type AdminRole = "Super Admin" | "Doctor" | "Receptionist" | "Pharmacist";

interface AdminRoleContextType {
  role: AdminRole;
  setRole: (role: AdminRole) => void;
}

const AdminRoleContext = createContext<AdminRoleContextType | undefined>(undefined);

export function AdminRoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<AdminRole>("Super Admin");

  return (
    <AdminRoleContext.Provider value={{ role, setRole }}>
      {children}
    </AdminRoleContext.Provider>
  );
}

export function useAdminRole() {
  const context = useContext(AdminRoleContext);
  if (context === undefined) {
    throw new Error("useAdminRole must be used within an AdminRoleProvider");
  }
  return context;
}
